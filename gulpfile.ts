const { task } = require('gulp');
const sh = require('shelljs');
const readline = require('readline');
const fs = require('fs');
const rollup = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const scss = require('rollup-plugin-scss');
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

let minify = process.argv[5];
/**
 * Serves all modules to localhost:1234 via parcel
 */
async function start() {
  try {
    const target = titleCase(process.argv[4].replace(/-/g, ''));
    await sh.exec(`parcel modules/${target}/index.html`);
    console.log(`parcel modules/${target}/index.html`);
  } catch (err) {
    error(err);
    try {
      const branch = (await getBranch()).replace(/\n/g, '');
      console.log(`awaiting parcel modules/${branch}/index.html`);
      await sh.exec(`parcel modules/${branch}/index.html`);
    } catch (err) {
      error(err);
      error('Failed to determine target from branch or CLI flags');
    }
  }
}

async function clean() {
  try {
    await sh.exec('echo Cleaning cache...');
    await sh.exec(`rm -r .cache`);
    if (process.argv[4] === '--Modules') {
      await sh.exec('echo Reinstalling node modules...');
      await sh.exec(`yarn install`);
    }
  } catch (err) {
    error(err);
  }
}

/**
 * Creates a new local module, module name should be passed as flag
 *
 * e.g. `yarn create --MyModule`
 */
async function create() {
  let name = titleCase(process.argv[4].replace(/-/g, ''));
  if (!name) {
    name = await textPrompt('Module name: ');
  }
  await sh.mkdir(`modules/${name}`);
  await sh.cd(`modules/${name}`);
  await sh.touch('index.html');
  await sh.touch('index.tsx');
  await sh.touch('main.tsx');
  const html = new sh.ShellString(htmlTemplate(name));
  const mainJS = new sh.ShellString(mainTemplate(name));
  const indexJS = new sh.ShellString(indexTemplate(name));
  html.to('index.html');
  indexJS.to('index.tsx');
  mainJS.to('main.tsx');

  // TODO: Add prompt for updating MODULE_MAP in constants
}

/**
 * Prints `question` in the console and awaits user input. Returns user input as string
 * @param question
 */
function textPrompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(
      `[\x1b[2m${timestamp()}\x1b[0m] ${question}`,
      (answer: string) => {
        rl.close();
        resolve(answer);
      },
    );
  });
}

async function getModulesList(): Promise<string[]> {
  sh.cd('./modules');
  const list = sh.ls().stdout.split('\n');
  sh.cd('..');
  return list.filter((l: string) => l);
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

function info(...msgs: (string | number)[]) {
  log('\x1b[2m')(msgs);
}

function warn(...msgs: (string | number)[]) {
  log('\x1b[33m')(msgs);
}

function error(...msgs: (string | number)[]) {
  log('\x1b[31m')(msgs);
}

function timestamp() {
  return new Date()
    .toLocaleTimeString('en-US', { hour12: false })
    .replace(/\s\w\w/, '');
}

function log(color: string) {
  return (msgs: (string | number)[]) => {
    console.log(`[${color}${timestamp()}\x1b[0m] ${msgs.join(' ')}`);
  };
}

task(start);

task(clean);

task(create);

type ArgObject = {
  [key: string]: string | boolean;
};

function htmlTemplate(title: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="index.tsx"></script>
  </body>
</html>`.replace('\n', '');
  // this removes the first instance of a new line from the output string
  // which allows the document to be written cleanly at the correct tab level
}

function mainTemplate(title: string) {
  title = titleCase(title);

  return `
import React from "react";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';

// add any prop types here
interface props {
  userID: number;
}

// map your state here
interface state {}

export class ${title} extends React.PureComponent<props, state> {
  constructor(props: props) {
    super(props);
  }
  render() {
    return (
      <ThemeProvider theme={customTheme.lightTheme}>
        <h1>${title}!</h1>
      </ThemeProvider>
    );
  }
}`.replace('\n', '');
}

function indexTemplate(title: string) {
  title = titleCase(title);

  return `
import React from 'react'
import ReactDOM from 'react-dom'
import { ${title} } from './main'
import { UserClient } from '@kalos-core/kalos-rpc/User'
import { ENDPOINT } from '../../constants'

const u = new UserClient(ENDPOINT)

u.GetToken('test','test').then(() => {
  ReactDOM.render(<${title} userID={8418} />, document.getElementById('root'))
})
`.replace('\n', '');
}

function cfmTemplate(title: string) {
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

function cfcTemplate(title: string) {
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
    await sh.exec(`scp build/common/module.cfc ${MODULE_CFC}`);
    const cfmFile = sh.ShellString(cfmTemplate(branch));
    cfmFile.to(`build/modules/${branch}.cfm`);
    await sh.exec(
      `scp build/modules/${branch}.cfm ${MODULE_CFM}/${branch.toLowerCase()}.cfm`,
    );
    sh.rm(`build/modules/${branch}.cfm`);
  }
}

function titleCase(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function getBranch(): Promise<string> {
  return new Promise(resolve => {
    sh.exec(
      'git rev-parse --abbrev-ref HEAD',
      { silent: true },
      (code: number, output: string) => {
        resolve(output);
      },
    );
  });
}

async function buildRelease() {
  const modules = await getModulesList();
  await sh.exec(
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

async function releaseBuild(target: string) {
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
        scss(),
        less({
          output: `build/modules/${target}Less.css`,
        }),
        image(),
        jsonPlugin(),
        peerDependencies(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'core-dev.kalosflorida.com': 'core.kalosflorida.com',
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
        scss(),
        image(),
        jsonPlugin(),
        peerDependencies(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'core-dev.kalosflorida.com': 'core.kalosflorida.com',
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
}

async function rollupBuild(target = '') {
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
      scss(),
      less({
        output: `build/modules/${target}Less.css`,
      }),
      image(),
      jsonPlugin(),
      peerDependencies(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'core-dev.kalosflorida.com': 'core.kalosflorida.com',
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

async function runTests(target: string) {
  if ((await sh.exec(`jest /modules/${target}/index.test.* -u`).code) != 0) {
    error('Please ensure all unit tests are passing before release.');
    sh.exit(1);
  }
}

function checkTests() {
  if (
    sh.exec(`test -n "$(find ./modules/${target}/ -name '*.test.*')"`).code != 0
  ) {
    error(
      `No unit tests are written for the module ${target}. Please write some and retry your release.`,
    );
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

  //checkTests();
  //await runTests(target);

  info('Rolling up build. This may take a moment...');

  await rollupBuild(target);

  info('Build rolled up.');

  await sh.exec(
    `scp build/modules/${target}.js ${KALOS_ASSETS}/modules/${target}.js`,
  );

  if (sh.test('-f', `build/modules/${target}.css`)) {
    await sh.exec(
      `scp build/modules/${target}.css ${KALOS_ASSETS}/css/${target}.css`,
    );
  }

  if (sh.test('-f', `build/modules/${target}Less.css`)) {
    await sh.exec(
      `scp build/modules/${target}Less.css ${KALOS_ASSETS}/css/${target}Less.css`,
    );
  }
}

async function upload(target = '') {
  if (target === '' || typeof target !== 'string') {
    target = titleCase(process.argv[4].replace(/-/g, ''));
  }
  await sh.exec(
    `scp build/modules/${target}.js ${KALOS_ASSETS}/modules/${target}.js`,
  );
}

async function cloneModule() {
  let target;
  try {
    target = titleCase(process.argv[4].replace(/-/g, ''));
  } catch (err) {
    target = (await getBranch()).replace(/\n/g, '');
  }
  sh.cp(`modules`);
}

async function bustCache(controller = '', filename = '') {
  if (typeof controller !== 'string' || controller === '') {
    controller = process.argv[4].replace(/-/g, '');
  }

  if (typeof filename !== 'string' || filename === '') {
    filename = process.argv[5].replace(/-/g, '');
  }

  await sh.exec(
    `scp ${KALOS_ROOT}/app/admin/views/${controller}/${filename}.cfm tmp/${filename}.cfm`,
  );
  const res = await sh.cat(`tmp/${filename}.cfm`);
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
      await sh.rm(`tmp/${filename}.cfm`);
      await newFile.to(`tmp/${filename}.cfm`);
      await sh.exec(
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/contract_frequency_pb.js': [
    'ContractFrequency',
    'ContractFrequencyList',
  ],
  'node_modules/react-to-print/lib/index.js': ['useReactToPrint'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/contract_pb.js': [
    'Contract',
    'ContractList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/default_view_pb.js': [
    'DefaultView',
    'DefaultViewList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/document_pb.js': [
    'Document',
    'DocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/employee_function_pb.js': [
    'EmployeeFunction',
    'EmployeeFunctionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/event_pb.js': [
    'Event',
    'EventList',
    'Quotable',
    'QuotableList',
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/internal_document_pb.js': [
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/maintenance_question_pb.js': [
    'MaintenanceQuestion',
    'MaintenanceQuestionList',
  ],
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/phone_call_log_detail_pb.js': [
    'PhoneCallLogDetail',
    'PhoneCallLogDetailList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_override_pb.js': [
    'PromptPaymentOverride',
    'PromptPaymentOverrideList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/prompt_payment_rebate_pb.js': [
    'PromptPaymentRebate',
    'PromptPaymentRebateList',
  ],
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_image_pb.js': [
    'ServiceItemImage',
    'ServiceItemImageList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_material_pb.js': [
    'ServiceItemMaterial',
    'ServiceItemMaterialList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_item_unit_pb.js': [
    'ServiceItemUnit',
    'ServiceItemUnitList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/service_reading_line_pb.js': [
    'ServiceReadingLine',
    'ServiceReadingLineList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/services_rendered_pb.js': [
    'ServicesRendered',
    'ServicesRenderedList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/si_link_pb.js': [
    'SiLink',
    'SiLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/spiff_tool_admin_action_pb.js': [
    'SpiffToolAdminAction',
    'SpiffToolAdminActionList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stock_vendor_pb.js': [
    'StockVendor',
    'StockVendorList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/stored_quotes_pb.js': [
    'StoredQuotes',
    'StoredQuotesList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_invoice_type_pb.js': [
    'SystemInvoiceType',
    'SystemInvoiceTypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/system_readings_type_pb.js': [
    'SystemReadingsType',
    'SystemReadingsTypeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/common_pb.js': [
    'Empty',
    'Int32',
    'IntArray',
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
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/pdf_pb.js': ['HTML'],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/task_event_pb.js': [
    'TaskEvent',
    'TaskEventList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/technician_skills_pb.js': [
    'TechnicianSkills',
    'TechnicianSkillsList',
  ],
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
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_classcode_pb.js': [
    'TimesheetClassCode',
    'TimesheetClassCodeList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_department_pb.js': [
    'TimesheetDepartment',
    'TimesheetDepartmentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_pb.js': [
    'Transaction',
    'TransactionList',
    'RecordPageReq',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_account_pb.js': [
    'TransactionAccount',
    'TransactionAccountList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_activity_pb.js': [
    'TransactionActivity',
    'TransactionActivityList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_document_pb.js': [
    'TransactionDocument',
    'TransactionDocumentList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/transaction_status_pb.js': [
    'TransactionStatus',
    'TransactionStatusList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_group_link_pb.js': [
    'UserGroupLink',
    'UserGroupLinkList',
  ],
  'node_modules/@kalos-core/kalos-rpc/compiled-protos/user_pb.js': [
    'User',
    'UserList',
    'CardDataList',
    'CardData',
    'IntArray',
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
  'node_modules/react-is/index.js': ['ForwardRef', 'isFragment', 'Memo'],
  'node_modules/tslib/tslib.js': ['__awaiter', '__generator', '__extends'],
  'node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.umd.js': ['grpc'],
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

interface IModuleMap {
  [key: string]: [string, string, string] | [];
}

export const MODULE_MAP: IModuleMap = {
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
  TransactionUser: ['admin', 'reports', 'transactions'],
};
