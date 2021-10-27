/* eslint-disable no-undef */
const { task } = require('gulp');
const sh = require('shelljs');
const readline = require('readline');
const fs = require('fs');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const peerDependencies = require('rollup-plugin-peer-deps-external');
const replace = require('@rollup/plugin-replace');
const image = require('@rollup/plugin-image');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const { terser } = require('rollup-plugin-terser');
const jsonPlugin = require('@rollup/plugin-json');
const less = require('rollup-plugin-less-modules');

let target = '';
try {
  target = titleCase(process.argv[4]).replace(/-/g, '');
} catch (err) {
  console.log(err);
}

function checkTests(target) {
  if (target !== 'ComponentsLibrary') {
    const componentExistsInModules = sh.test(
      '-f',
      `./modules/ComponentsLibrary/${target}/index.tsx`,
    );
    const componentIsTested = sh.test(
      '-f',
      `./test/modules/ComponentsLibrary/${target}/index.test.tsx`,
    );
    const isTested = sh.test('-f', `./test/modules/${target}/index.test.tsx`);
    if (!isTested && !componentIsTested) {
      warn(
        `The module you are running appears to be untested (/test/modules/${target}/index.test.tsx NOT FOUND). Please consider creating unit tests to ensure that the module works as intended.`,
      );
    } else if (!isTested && componentIsTested) {
      warn(
        `The module you are running has tests in the Components Library (/test/modules/ComponentsLibrary/${target}/index.test.tsx EXISTS), however it does not appear to have module tests (/test/modules/${target}/index.test.tsx NOT FOUND). Please consider creating unit tests for the module to ensure that the component works well in module form.`,
      );
    } else if (componentExistsInModules && isTested && !componentIsTested) {
      warn(
        `The module you are running is tested (/test/modules/${target}/index.test.tsx EXISTS), however the component by the same name is not tested (/test/modules/ComponentsLibrary/${target}/index.test.tsx NOT FOUND). Please consider creating unit tests for the component to ensure that the component functions correctly.`,
      );
    }
  }
}

/**
 * Serves all modules to localhost:1234 via parcel
 */
async function start() {
  info(
    'Starting the module via Parcel alongside the test suite in watch mode.',
  );

  try {
    const res = sh.test('-f', `./modules/${target}/index.html`);
    if (res == false) throw new Error(`Failed to determine target`);
  } catch (err) {
    error(
      `Failed to determine target. Attemped at: modules/${target}/index.html.`,
    );
    warn(
      `Are you sure this is a module and not a component? You can use "yarn start --ComponentsLibrary" to view a list of components.`,
    );
    return;
  }

  checkTests(target);

  try {
    const target = titleCase(process.argv[4].replace(/-/g, ''));
    sh.exec(
      `( yarn test --colors -w -grep ${target} --reporter-options consoleReporter=min,quiet=true & parcel modules/${target}/index.html; )`,
    );
  } catch (err) {
    error(err);
    try {
      const branch = (await getBranch()).replace(/\n/g, '');
      console.log(`awaiting parcel modules/${branch}/index.html`);
      sh.exec(
        `( yarn test --colors -w -grep ${target} --reporter-options consoleReporter=min,quiet=true & parcel modules/${branch}/index.html; )`,
      );
    } catch (err) {
      error(err);
      error('Failed to determine target from branch or CLI flags');
    }
  }
}

async function clean() {
  try {
    sh.exec('echo Cleaning cache...');
    sh.exec(`rm -r .cache`);
    if (process.argv[4] === '--Modules') {
      sh.exec('echo Reinstalling node modules...');
      sh.exec(`yarn install`);
    }
  } catch (err) {
    error(err);
  }
}

async function getDescriptionAndDocument() {
  let description = await textPrompt('Description (optional): ');
  if (description === '' || !description) {
    description = 'None';
  }
  let designDocument = await textPrompt('Design Document / Spec (optional): ');
  if (designDocument === '' || !designDocument) {
    designDocument = 'None Specified';
  }
  return { description, designDocument };
}

function validateModuleName(name) {
  if (name.includes('_') || name.includes('-')) {
    error(
      'React components should adhere to Pascal case and should not contain the characters "_" or "-".',
    );
    return false;
  }
  return true;
}

const ModuleTypes = {
  Component: 'component',
  Module: 'module',
};

function getModuleType(typeArg) {
  switch (typeArg.replace(/-/g, '').toLowerCase()) {
    case ModuleTypes['Component']:
      return ModuleTypes['Component'];
    case 'c':
      return ModuleTypes['Component'];
    case ModuleTypes['Module']:
      return ModuleTypes['Module'];
    case 'm':
      return ModuleTypes['Module'];
    case ModuleTypes['TestOnly']:
      return 'test-only';
    case 't':
      return 'test-only';
    case 'testonly':
      return ModuleTypes['Module']; // Testonly should already be recorded as true, we can act as if it's a module
    default:
      warn(
        `Unknown flag passed ${process.argv[5]
          .replace(/-/g, '')
          .toLowerCase()} - creating as a module. For a component instead, run "yarn make --ComponentName --C" or "yarn make --ComponentName --Component".`,
      );
  }
}

function replaceKeywords(fileToWorkOn, userSpecsInput, nameOfModule) {
  return fileToWorkOn
    .sed(new RegExp('TITLE_HERE', 'g'), nameOfModule)
    .sed(new RegExp('DESCRIPTION', 'g'), userSpecsInput.description)
    .sed(new RegExp('DOCUMENT', 'g'), userSpecsInput.designDocument);
}

/**
 * Creates a new local module, module name should be passed as flag
 *
 * e.g. `yarn make --MyModule`
 */
async function create() {
  let name = titleCase(process.argv[4].replace(/-/g, ''));
  let testOnly;
  if (process.argv[5]) {
    testOnly = titleCase(process.argv[5].replace(/-/g, '')) === 'Testonly'; // so that module doesn't have a need for extra flag
  }
  if (process.argv[6] && !testOnly) {
    testOnly = titleCase(process.argv[6].replace(/-/g, '')) === 'Testonly';
  }
  if (!name) {
    name = await textPrompt('Module name: ');
  }

  const userSpecs = await getDescriptionAndDocument();

  const valid = validateModuleName(name);
  if (!valid) return;

  let moduleType = ModuleTypes['Module'];
  if (process.argv[5]) {
    moduleType = getModuleType(process.argv[5]);
  }

  switch (moduleType) {
    case ModuleTypes['Module']:
      sh.cd('templates/NewModule');
      break;
    case ModuleTypes['Component']:
      sh.cd('templates/NewComponent');
      break;
  }

  // Get the text from the template files
  const indexJS = replaceKeywords(sh.cat(['index.txt']), userSpecs, name);
  let mainJS;
  if (moduleType === ModuleTypes['Module']) {
    mainJS = replaceKeywords(sh.cat(['main.txt']), userSpecs, name);
  }
  const reducerJS = replaceKeywords(sh.cat(['reducer.txt']), userSpecs, name);
  let examplesJS;
  if (moduleType === ModuleTypes['Component']) {
    examplesJS = replaceKeywords(sh.cat(['examples.txt']), userSpecs, name);
  }
  let html;
  if (moduleType === ModuleTypes['Module']) {
    html = replaceKeywords(sh.cat(['index.html.txt']), userSpecs, name);
  }

  sh.cd('test/modules');

  const testJS = replaceKeywords(sh.cat(['index.test.txt']), userSpecs, name);

  sh.cd('../../../../');

  sh.cd('test');

  switch (moduleType) {
    case ModuleTypes['Component']:
      sh.mkdir(`modules/ComponentsLibrary/${name}`);
      sh.cd(`modules/ComponentsLibrary/${name}`);
      break;
    case ModuleTypes['Module']:
      sh.mkdir(`modules/${name}`);
      sh.cd(`modules/${name}`);
      break;
  }

  sh.touch('index.test.tsx');
  testJS.to('index.test.tsx');

  info(`Test file created in: ${sh.pwd()}`);

  if (testOnly) return; // Work is done here

  switch (moduleType) {
    case ModuleTypes['Component']:
      sh.cd('../../../../');
      sh.mkdir(`modules/ComponentsLibrary/${name}`);
      sh.cd(`modules/ComponentsLibrary/${name}`);
      sh.touch('examples.tsx');
      examplesJS.to('examples.tsx');
      break;
    case ModuleTypes['Module']:
      sh.cd('../../../');
      sh.mkdir(`modules/${name}`);
      sh.cd(`modules/${name}`);
      sh.touch('index.html');
      sh.touch('main.tsx');
      html.to('index.html');
      mainJS.to('main.tsx');
      break;
  }
  sh.touch('index.tsx');
  sh.touch('reducer.tsx');
  indexJS.to('index.tsx');
  reducerJS.to('reducer.tsx');

  info(`Module files created in: ${sh.pwd()}`);

  moduleType === ModuleTypes['Component']
    ? warn(
        "Don't forget to add the component to the ComponentsLibrary index file, otherwise it won't show up when the Components Library is run! (/modules/ComponentsLibrary/index.tsx)",
      )
    : warn("Don't forget to update MODULE_MAP in constants!");
}

/**
 * Prints `question` in the console and awaits user input. Returns user input as string
 * @param question
 */
function textPrompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(`[\x1b[2m${timestamp()}\x1b[0m] ${question}`, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getModulesList() {
  sh.cd('./modules');
  const list = sh.ls().stdout.split('\n');
  sh.cd('..');
  return list.filter(l => l);
}

async function buildIndex() {
  const mods = await getModulesList();
  let idxFile = 'export ';
  for (const m of mods) {
    idxFile = `${idxFile}export { ${m} } from "./build/dist/${m}";\n`;
  }
  const shStr = new sh.ShellString(idxFile);
  shStr.to('index.js');
}

function info(...msgs) {
  log('\x1b[2m')(msgs);
}

function warn(...msgs) {
  log('\x1b[33m')(msgs);
}

function error(...msgs) {
  log('\x1b[31m')(msgs);
}

function timestamp() {
  return new Date()
    .toLocaleTimeString('en-US', { hour12: false })
    .replace(/\s\w\w/, '');
}

function log(color) {
  return msgs => {
    console.log(`[${color}${timestamp()}\x1b[0m] ${msgs.join(' ')}`);
  };
}

task(start);

task(clean);

task(create);

function cfmTemplate(title) {
  title = titleCase(title);
  return `
<!DOCTYPE html>
<html>
  <body>
    <div id="${title}Root"></div>
    <script src="app/assets/modules/${title}.js"></script>
    <script>
      ReactDOM.render(
        React.createElement(${title}, { userID: <cfoutput>#session.user.id#</cfoutput> }),
        document.getElementById('${title}Root'),
      );
    </script>
  </body>
</html>`.replace('\n', '');
}

function cfcTemplate(title) {
  title = title.toLowerCase();
  return `
  function ${title}(rc){
    rc.title = "${titleCase(title)}";
  }

}`;
}

async function patchCFC() {
  const branch = (await getBranch()).replace(/\n/g, '');
  const res = sh.cat('build/common/module.cfc');
  const cfcFunc = cfcTemplate(branch);
  if (!res.stdout.includes(cfcFunc)) {
    const output = sh.ShellString(res.stdout.replace(/}$/, cfcFunc));
    output.to('build/common/module.cfc');
    sh.exec(`scp build/common/module.cfc ${MODULE_CFC}`);
    const cfmFile = sh.ShellString(cfmTemplate(branch));
    cfmFile.to(`build/modules/${branch}.cfm`);
    sh.exec(
      `scp build/modules/${branch}.cfm ${MODULE_CFM}/${branch.toLowerCase()}.cfm`,
    );
    sh.rm(`build/modules/${branch}.cfm`);
  }
}

function titleCase(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function getBranch() {
  return new Promise(resolve => {
    sh.exec(
      'git rev-parse --abbrev-ref HEAD',
      { silent: true },
      (code, output) => {
        resolve(output);
      },
    );
  });
}

async function buildRelease() {
  const modules = await getModulesList();
  sh.exec(
    'tsc --jsx preserve --outdir build/dist --esModuleInterop constants.ts',
  );
  for (const m of modules) {
    try {
      await releaseBuild(m);
    } catch (err) {
      warn(`failed to build ${m}`);
    }
  }
}

async function releaseBuild(target) {
  let inputStr = `modules/${target}/main.tsx`;
  if (!fs.existsSync(inputStr)) {
    inputStr = `modules/${target}/main.ts`;
  }
  let bundle;
  try {
    bundle = await rollup.rollup({
      input: inputStr,
      plugins: [
        resolve({ browser: false, preferBuiltins: true }),
        commonjs({
          namedExports: NAMED_EXPORTS,
        }),
        globals(),
        builtins(),
        typescript({
          module: 'commonjs',
          noEmitOnError: false,
        }),
        less({
          output: `build/modules/${target}Less.css`,
        }),
        image(),
        jsonPlugin(),
        peerDependencies(),
        replace({
          include: ['./**/*.js'],
          values: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            //'core-dev.kalosflorida.com': 'core.kalosflorida.com',
            'dev-core.kalosflorida.com': 'prod-core.kalosflorida.com',
            'https://dev-core.kalosflorida.com': JSON.stringify(
              'https://prod-core.kalosflorida.com',
            ),
          },
          delimiter: ['', ''],
        }),
      ],
    });
    await bundle.write({
      file: `build/dist/${target}/index.js`,
      name: titleCase(target),
      format: 'cjs',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      plugins: [],
    });
  } catch (err) {
    console.log('in error');
    console.log('in error');
    console.log('in error');
    console.log('in error');
    console.log('in error');
    bundle = await rollup.rollup({
      input: inputStr,
      plugins: [
        resolve({ browser: false, preferBuiltins: true }),
        commonjs({
          namedExports: NAMED_EXPORTS,
        }),
        globals(),
        builtins(),
        typescript({
          module: 'commonjs',
          noEmitOnError: false,
        }),
        image(),
        jsonPlugin(),
        peerDependencies(),
        replace({
          include: ['./**/*.js'],
          values: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            //'core-dev.kalosflorida.com': 'core.kalosflorida.com',
            'dev-core.kalosflorida.com': 'prod-core.kalosflorida.com',
            'https://dev-core.kalosflorida.com':
              'https://prod-core.kalosflorida.com',
          },
          delimiter: ['', ''],
        }),
      ],
    });
    await bundle.write({
      file: `build/dist/${target}/index.js`,
      name: titleCase(target),
      format: 'cjs',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      plugins: [],
    });
  }
  sh.sed(
    '-i',
    'dev-core.kalosflorida.com',
    'prod-core.kalosflorida.com',
    `build/dist/${target}/index.js`,
  );
  sh.sed(
    '-i',
    'bufferEs6.hasOwnProperty(key$2)',
    'key$2 in bufferEs6',
    `build/modules/${target}.js`,
  );
  sh.sed(
    '-i',
    '_a = _typeModule(_typeModule)',
    'var _a = _typeModule(_typeModule);',
    `build/modules/${target}.js`,
  );
}

async function rollupBuild(t) {
  if (t && typeof t === 'string') {
    target = t;
  }
  console.log(target);
  if (target.includes('-')) {
    target = process.argv[4].replace(/-/g, '');
  }
  const minify = process.argv[5];
  let inputStr = `modules/${target}/main.tsx`;
  if (!fs.existsSync(inputStr)) {
    inputStr = `modules/${target}/main.ts`;
  }
  const bundle = await rollup.rollup({
    input: inputStr,
    plugins: [
      resolve({ browser: true, preferBuiltins: true }),
      commonjs({
        namedExports: NAMED_EXPORTS,
      }),
      globals(),
      builtins(),
      typescript({
        module: 'ES2015',
        noEmitOnError: false,
      }),
      less({
        output: `build/modules/${target}Less.css`,
      }),
      minify && terser(),
      image(),
      jsonPlugin(),
      peerDependencies(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  });

  await bundle.write({
    file: `build/modules/${target}.js`,
    name: titleCase(target),
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'google-protobuf': 'googleProtobuf',
    },
    plugins: [],
  });
  sh.sed(
    '-i',
    'dev-core.kalosflorida.com',
    'prod-core.kalosflorida.com',
    `build/modules/${target}.js`,
  );
  sh.sed(
    '-i',
    'bufferEs6.hasOwnProperty(key$2)',
    'key$2 in bufferEs6',
    `build/modules/${target}.js`,
  );
  sh.sed(
    '-i',
    '_a = _typeModule(_typeModule)',
    'var _a = _typeModule(_typeModule);',
    `build/modules/${target}.js`,
  );
}

async function googBuild() {
  const bundle = await rollup.rollup({
    input: 'node_modules/google-protobuf/google-protobuf.js',
    plugins: [resolve(), commonjs()],
  });

  await bundle.write({
    file: 'build/common/google-protobuf.js',
    name: 'googleProtobuf',
    format: 'umd',
  });
}

async function runTests(target) {
  if (sh.exec(`jest /modules/${target}/index.test.* -u`).code != 0) {
    error('Please ensure all unit tests are passing before release.');
    sh.exit(1);
  }
}

async function buildAll() {
  const moduleList = await getModulesList();
  for (const m of moduleList) {
    try {
      const cfName = MODULE_MAP[m];
      if (cfName.length === 3) {
        await release(m);
        await upload(m);
        if (cfName[0] === 'admin') {
          await bustCache(cfName[1], cfName[2]);
        }
      }
    } catch (err) {
      info(`Failed to build module: ${m}\n${err}`);
    }
  }
}

async function release(target = '') {
  if (target === '' || typeof target !== 'string') {
    target = titleCase(process.argv[4].replace(/-/g, ''));
  }

  checkTests();
  let response = '';
  while (response.toLowerCase() !== 'y' && response.toLowerCase() !== 'n') {
    response = await textPrompt('Would you like to release anyway (y/n)? ');
  }

  if (response.toLowerCase() === 'n') return;

  info('Rolling up build. This may take a moment...');

  await rollupBuild(target);

  info('Build rolled up.');

  sh.exec(
    `scp build/modules/${target}.js ${KALOS_ASSETS}/modules/${target}.js`,
  );

  if (sh.test('-f', `build/modules/${target}.css`)) {
    sh.exec(
      `scp build/modules/${target}.css ${KALOS_ASSETS}/css/${target}.css`,
    );
  }

  if (sh.test('-f', `build/modules/${target}Less.css`)) {
    sh.exec(
      `scp build/modules/${target}Less.css ${KALOS_ASSETS}/css/${target}Less.css`,
    );
  }
}

async function upload(target = '') {
  if (target === '' || typeof target !== 'string') {
    target = titleCase(process.argv[4].replace(/-/g, ''));
  }
  sh.exec(
    `scp build/modules/${target}.js ${KALOS_ASSETS}/modules/${target}.js`,
  );
}

async function bustCache(controller = '', filename = '') {
  if (typeof controller !== 'string' || controller === '') {
    controller = process.argv[4].replace(/-/g, '');
  }

  if (typeof filename !== 'string' || filename === '') {
    filename = process.argv[5].replace(/-/g, '');
  }

  sh.exec(
    `scp ${KALOS_ROOT}/app/admin/views/${controller}/${filename}.cfm tmp/${filename}.cfm`,
  );
  const res = sh.cat(`tmp/${filename}.cfm`);
  if (res.stdout.includes('.js?version=')) {
    const versionMatch = res.stdout.match(/\.js\?version=\d{1,}/g);
    if (versionMatch) {
      const version = parseInt(versionMatch[0].replace(/\.js\?version=/g, ''));
      const newVersion = version + 1;
      const newFile = new sh.ShellString(
        res.stdout.replace(
          /\.js\?version=\d{1,}/g,
          `.js?version=${newVersion}`,
        ),
      );
      sh.rm(`tmp/${filename}.cfm`);
      await newFile.to(`tmp/${filename}.cfm`);
      sh.exec(
        `scp tmp/${filename}.cfm ${KALOS_ROOT}/app/admin/views/${controller}/${filename}.cfm`,
      );
    }
  }
}

task('index', buildIndex);
task('bundle', rollupBuild);
task('bust', bustCache);
task('goog', googBuild);
task('distribute', buildRelease);
task(release);
task('cfpatch', patchCFC);
task(upload);
task('build-all', buildAll);

const KALOS_ROOT = 'kalos-prod:/opt/coldfusion11/cfusion/wwwroot';
const KALOS_ASSETS = `${KALOS_ROOT}/app/assets`;
const MODULE_CFC = `${KALOS_ROOT}/app/admin/controllers/module.cfc`;
const MODULE_CFM = `${KALOS_ROOT}/app/admin/views/module`;
const NAMED_EXPORTS = {
  'node_modules/throttle-debounce/index.umd.js': ['debounce'],
  'node_modules/scheduler/index.js': [
    'unstable_scheduleCallback',
    'unstable_cancelCallback',
  ],
  'node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.js': ['grpc'],
  'node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.umd.js': ['grpc'],
  'node_modules/@kalos-core/kalos-rpc/node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.umd.js':
    ['grpc'],
  'node_modules/@material-ui/utils/node_modules/react-is/index.js': [
    'ForwardRef',
    'Memo',
    'isFragment',
  ],
  'node_modules/@material-ui/core/node_modules/react-is/index.js': [
    'isFragment',
  ],
  'node_modules/@material-ui/lab/node_modules/react-is/index.js': [
    'isFragment',
  ],
  'node_modules/react-redux/node_modules/react-is/index.js': [
    'isValidElementType',
    'isContextConsumer',
  ],
  'node_modules/lodash/lodash.js': ['delay', 'debounce', 'isArray'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/dispatch_pb.js': [
    'DispatchableTechList',
    'DispatchableTech',
    'DispatchCall',
    'DispatchCallBack',
    'DispatchCallTime',
    'DispatchCallCount',
    'DispatchFirstCall',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb.js': [
    'Place',
    'Places',
    'TripData',
    'Coordinates',
    'CoordinatesList',
    'DistanceMatrixElementRow',
    'DistanceMatrixElement',
    'DistanceMatrixResponse',
    'Distance',
    'MatrixRequest',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/email_pb.js': [
    'Email',
    'EmailClient',
    'SQSEmail',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/file_pb.js': [
    'File',
    'FileList',
    'FileClient',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/S3_pb.js': [
    'FileObject',
    'URLObject',
    'BucketObject',
    'S3Files',
    'SUBJECT_TAGS',
    'MoveConfig',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/activity_log_pb.js': [
    'ActivityLog',
    'ActivityLogList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/api_key_pb.js': [
    'ApiKey',
    'ApiKeyList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/auth_pb.js': ['AuthData'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/call_association_pb.js': [
    'CallAssociation',
    'CallAssociationList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/contract_frequency_pb.js':
    ['ContractFrequency', 'ContractFrequencyList'],
  'node_modules/react-to-print/lib/index.js': ['useReactToPrint'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/contract_pb.js': [
    'Contract',
    'ContractList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/default_view_pb.js': [
    'DefaultView',
    'DefaultViewList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/devlog_pb.js': [
    'Devlog',
    'DevlogList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/document_pb.js': [
    'Document',
    'DocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/employee_function_pb.js':
    ['EmployeeFunction', 'EmployeeFunctionList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_pb.js': [
    'Event',
    'EventList',
    'Quotable',
    'QuotableList',
    'CalendarDay',
    'QuotableRead',
    'CostReportInfo',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_assignment_pb.js': [
    'EventAssignment',
    'EventAssignmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_deletion_pb.js': [
    'EventDeletion',
    'EventDeletionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/files_pb.js': [
    'File',
    'FileList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/first_calls_pb.js': [
    'FirstCalls',
    'FirstCallsList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/first_call_pb.js': [
    'FirstCall',
    'FirstCallList',
  ],
  'node_modules/draft-js/lib/Draft.js': [
    'SelectionState',
    'EditorState',
    'ContentBlock',
    'genKey',
    'ContentState',
    'CharacterMetadata',
    'RichUtils',
    'Editor',
  ],
  'node_modules/immutable/dist/immutable.js': [
    'OrderedSet',
    'is',
    'List',
    'Seq',
    'Map',
    'Repeat',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/reports_pb.js': [
    'SpiffReport',
    'SpiffReportLine',
    'PromptPaymentReport',
    'PromptPaymentReportLine',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/internal_document_pb.js':
    [
      'InternalDocument',
      'InternalDocumentList',
      'DocumentKey',
      'DocumentKeyList',
    ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/invoice_pb.js': [
    'Invoice',
    'InvoiceList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/job_type_pb.js': [
    'JobType',
    'JobTypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/job_subtype_pb.js': [
    'JobSubtype',
    'JobSubtypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/job_type_subtype_pb.js': [
    'JobTypeSubtype',
    'JobTypeSubtypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/logger_pb.js': [
    'Logger',
    'LoggerList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/maintenance_question_pb.js':
    ['MaintenanceQuestion', 'MaintenanceQuestionList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/material_pb.js': [
    'Material',
    'MaterialList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/menu_option_pb.js': [
    'MenuOption',
    'MenuOptionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/payment_pb.js': [
    'Payment',
    'PaymentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/phone_call_log_pb.js': [
    'PhoneCallLog',
    'PhoneCallLogList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/phone_call_log_detail_pb.js':
    ['PhoneCallLogDetail', 'PhoneCallLogDetailList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_override_pb.js':
    ['PromptPaymentOverride', 'PromptPaymentOverrideList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_rebate_pb.js':
    ['PromptPaymentRebate', 'PromptPaymentRebateList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prop_link_pb.js': [
    'PropLink',
    'PropLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/property_pb.js': [
    'Property',
    'PropertyList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_pb.js': [
    'Quote',
    'QuoteList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_document_pb.js': [
    'QuoteDocument',
    'QuoteDocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_line_pb.js': [
    'QuoteLine',
    'QuoteLineList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_line_part_pb.js': [
    'QuoteLinePart',
    'QuoteLinePartList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_part_pb.js': [
    'QuotePart',
    'QuotePartList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/quote_used_pb.js': [
    'QuoteUsed',
    'QuoteUsedList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/reading_pb.js': [
    'Reading',
    'ReadingList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/remote_identity_pb.js': [
    'RemoteIdentity',
    'RemoteIdentityList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_pb.js': [
    'ServiceItem',
    'ServiceItemList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_image_pb.js':
    ['ServiceItemImage', 'ServiceItemImageList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_material_pb.js':
    ['ServiceItemMaterial', 'ServiceItemMaterialList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_unit_pb.js':
    ['ServiceItemUnit', 'ServiceItemUnitList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_reading_line_pb.js':
    ['ServiceReadingLine', 'ServiceReadingLineList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/services_rendered_pb.js':
    ['ServicesRendered', 'ServicesRenderedList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/si_link_pb.js': [
    'SiLink',
    'SiLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/spiff_tool_admin_action_pb.js':
    ['SpiffToolAdminAction', 'SpiffToolAdminActionList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/slack_pb.js': [
    'DispatchReq',
    'DMReq',
    'FCReq',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stock_vendor_pb.js': [
    'StockVendor',
    'StockVendorList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stored_quotes_pb.js': [
    'StoredQuotes',
    'StoredQuotesList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_invoice_type_pb.js':
    ['SystemInvoiceType', 'SystemInvoiceTypeList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_readings_type_pb.js':
    ['SystemReadingsType', 'SystemReadingsTypeList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/common_pb.js': [
    'Empty',
    'Int32',
    'IntArray',
    'DateRange',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_pb.js': [
    'Task',
    'TaskList',
    'ToolFund',
    'SpiffList',
    'Spiff',
    'SpiffType',
    'TaskEventData',
    'TaskStatus',
    'SpiffDuplicate',
    'SpiffTypeList',
    'ProjectTask',
    'ProjectTaskList',
    'TaskPriority',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/metrics_pb.js': [
    'MetricsClient',
    'Billable',
    'AvgTicket',
    'Revenue',
    'Callbacks',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_assignment_pb.js': [
    'TaskAssignment',
    'TaskAssignmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/perdiem_pb.js': [
    'PerDiem',
    'PerDiemList',
    'PerDiemRow',
    'PerDiemRowList',
    'PerDiemReportRequest',
    'Trip',
    'TripList',
    'SQLRequest',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/pdf_pb.js': ['HTML'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_event_pb.js': [
    'TaskEvent',
    'TaskEventList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/team_pb.js': [
    'Team',
    'TeamList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/technician_skills_pb.js':
    ['TechnicianSkills', 'TechnicianSkillsList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb.js': [
    'TimeoffRequest',
    'TimeoffRequestList',
    'TimeoffRequestType',
    'TimeoffRequestTypeList',
    'PTO',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_line_pb.js': [
    'TimesheetLine',
    'TimesheetLineList',
    'SubmitApproveReq',
    'TimesheetReq',
    'Timesheet',
    'TimesheetDay',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_classcode_pb.js':
    ['TimesheetClassCode', 'TimesheetClassCodeList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_department_pb.js':
    ['TimesheetDepartment', 'TimesheetDepartmentList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_pb.js': [
    'Transaction',
    'TxnDepartment',
    'TransactionList',
    'RecordPageReq',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_account_pb.js':
    ['TransactionAccount', 'TransactionAccountList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_activity_pb.js':
    ['TransactionActivity', 'TransactionActivityList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_document_pb.js':
    ['TransactionDocument', 'TransactionDocumentList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_status_pb.js':
    ['TransactionStatus', 'TransactionStatusList'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_group_link_pb.js': [
    'UserGroupLink',
    'UserGroupLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_pb.js': [
    'User',
    'UserList',
    'CardDataList',
    'CardData',
    'PermissionGroupUser',
    'PermissionGroup',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/vendor_order_pb.js': [
    'VendorOrder',
    'VendorOrderList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/vendor_pb.js': [
    'Vendor',
    'VendorList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/pending_billing_pb.js': [
    'PendingBilling',
    'PendingBillingList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/group_pb.js': [
    'Group',
    'GroupList',
  ],
  'node_modules/react-is/index.js': [
    'ForwardRef',
    'isFragment',
    'Memo',
    'isValidElementType',
    'isContextConsumer',
  ],
  'node_modules/tslib/tslib.js': ['__awaiter', '__generator', '__extends'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/predict_pb.js': [
    'TransactionData',
    'Prediction',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stored_quote_pb.js': [
    'StoredQuote',
    'StoredQuoteList',
  ],
  'node_modules/pako/index.js': ['inflate', 'deflate', 'gzip', 'ungzip'],
  'node_modules/prop-types/index.js': ['default'],
  'prop-types': [
    'array',
    'bool',
    'func',
    'number',
    'object',
    'string',
    'symbol',
    'any',
    'arrayOf',
    'element',
    'elementType',
    'instanceOf',
    'node',
    'objectOf',
    'oneOf',
    'oneOfType',
    'shape',
    'exact',
  ],
};

const MODULE_MAP = {
  AcceptProposal: ['customer', 'service', 'accept_proposal'],
  AccountInfo: ['admin', 'account', 'editinformation'],
  // AddServiceCallGeneral: ['admin', 'service', 'addservicecallgeneral'], // UNRELEASED
  AddTimeOff: [], // MOVE TO COMPONENTS LIBRARY
  AltGallery: [], // DEPRECATED
  CallsByTech: ['admin', 'service', 'callstech'],
  CreditTransaction: [], // INCOMPLETE
  // CustomerDetails: ['admin', 'customers', 'details'], // UNRELEASED
  CustomerDirectory: [], // CUSTOMER MODULE
  CustomerTasks: [], // CUSTOMER MODULE
  Dashboard: ['admin', 'dashboard', 'index'],
  Dispatch: ['admin', 'dispatch', 'newdash'],
  Documents: ['admin', 'document', 'index'],
  // EditProject: ['admin', 'service', 'edit_project'], // UNRELEASED
  EditTimeOff: [], // MOVE TO COMPONENTS LIBRARY
  EmployeeDirectory: ['admin', 'users', 'employee'],
  EmployeeTasks: [], // ?
  Gallery: [], // MOVE TO COMPONENTS LIBRARY
  List: [], // DEPRECATED
  Loader: [], // MOVE TO COMPONENTS LIBRARY
  Login: [],
  Metrics: [],
  PDFMaker: [], // DEPRECATED
  // PendingBilling: ['admin', 'service', 'callspending'], // UNRELEASED
  PerDiem: ['admin', 'reports', 'perdiem'],
  PerDiemsNeedsAuditing: ['admin', 'reports', 'perdiem_audit'],
  PopoverGallery: [], // DEPRECATED
  PostProposal: ['customer', 'service', 'post_proposal'],
  Projects: [], // ?
  Prompt: [], // ?
  // PropertyInformation: ['admin', 'properties', 'details'], // UNRELEASED
  PropertyTasks: [],
  Proposal: [], // MOVE TO EDIT SERVICE CALL
  // Reports: ['admin', 'reports', 'index'], // UNRELEASED
  SearchIndex: ['admin', 'search', 'index'],
  ServiceCalendar: ['admin', 'service', 'calendar'],
  ServiceCallDetail: [], // UNRELEASED
  ServiceCallEdit: [], // UNRELEASED
  ServiceCallSearch: ['admin', 'service', 'calls'],
  // SideMenu: ['common', 'partials', 'header'], // UNRELEASED
  // SpiffLog: ['admin', 'tasks', 'spiff_tool_logs'], // UNRELEASED
  // SpiffToolLogs: ['admin', 'tasks', 'spiff_tool_logs'],
  Timesheet: ['admin', 'timesheet', 'timesheetview_new'],
  ToolLog: [],
  Transaction: ['admin', 'reports', 'transaction_admin'],
  TransactionAccountsPayable: ['admin', 'reports', 'transactions'],
  TransactionUser: ['admin', 'reports', 'transactions'],
};
