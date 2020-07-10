var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var task = require('gulp').task;
var sh = require('shelljs');
var readline = require('readline');
var fs = require('fs');
var rollup = require('rollup');
var typescript = require('@rollup/plugin-typescript');
var scss = require('rollup-plugin-scss');
var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var peerDependencies = require('rollup-plugin-peer-deps-external');
var replace = require('@rollup/plugin-replace');
var image = require('@rollup/plugin-image');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');
var terser = require('rollup-plugin-terser').terser;
var jsonPlugin = require('@rollup/plugin-json');
/**
 * Serves all modules to localhost:1234 via parcel
 */
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var target, err_1, branch, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 8]);
                    target = titleCase(process.argv[4].replace(/-/g, ''));
                    return [4 /*yield*/, sh.exec("parcel modules/" + target + "/index.html")];
                case 1:
                    _a.sent();
                    console.log("parcel modules/" + target + "/index.html");
                    return [3 /*break*/, 8];
                case 2:
                    err_1 = _a.sent();
                    error(err_1);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, getBranch()];
                case 4:
                    branch = (_a.sent()).replace(/\n/g, '');
                    console.log("awaiting parcel modules/" + branch + "/index.html");
                    return [4 /*yield*/, sh.exec("parcel modules/" + branch + "/index.html")];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    error(err_2);
                    error('Failed to determine target from branch or CLI flags');
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Creates a new local module, module name should be passed as flag
 *
 * e.g. `yarn create --MyModule`
 */
function create() {
    return __awaiter(this, void 0, void 0, function () {
        var name, html, mainJS, indexJS;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = titleCase(process.argv[4].replace(/-/g, ''));
                    if (!!name) return [3 /*break*/, 2];
                    return [4 /*yield*/, textPrompt('Module name: ')];
                case 1:
                    name = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, sh.mkdir("modules/" + name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sh.cd("modules/" + name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sh.touch('index.html')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, sh.touch('index.tsx')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, sh.touch('main.tsx')];
                case 7:
                    _a.sent();
                    html = new sh.ShellString(htmlTemplate(name));
                    mainJS = new sh.ShellString(mainTemplate(name));
                    indexJS = new sh.ShellString(indexTemplate(name));
                    html.to('index.html');
                    indexJS.to('index.tsx');
                    mainJS.to('main.tsx');
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Prints `question` in the console and awaits user input. Returns user input as string
 * @param question
 */
function textPrompt(question) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(function (resolve) {
        rl.question("[\u001B[2m" + timestamp() + "\u001B[0m] " + question, function (answer) {
            rl.close();
            resolve(answer);
        });
    });
}
function getModulesList() {
    return __awaiter(this, void 0, void 0, function () {
        var list;
        return __generator(this, function (_a) {
            sh.cd('./modules');
            list = sh.ls().stdout.split('\n');
            sh.cd('..');
            return [2 /*return*/, list.filter(function (l) { return l; })];
        });
    });
}
function info(msg) {
    log('\x1b[2m')(msg);
}
function warn(msg) {
    log('\x1b[33m')(msg);
}
function error(msg) {
    log('\x1b[31m')(msg);
}
function timestamp() {
    return new Date()
        .toLocaleTimeString('en-US', { hour12: false })
        .replace(/\s\w\w/, '');
}
function log(color) {
    return function (msg) {
        console.log("[" + color + timestamp() + "\u001B[0m] " + msg);
    };
}
task(start);
task(create);
function htmlTemplate(title) {
    return ("\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>" + title + "</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script src=\"index.tsx\"></script>\n  </body>\n</html>").replace('\n', '');
    // this removes the first instance of a new line from the output string
    // which allows the document to be written cleanly at the correct tab level
}
function mainTemplate(title) {
    title = titleCase(title);
    return ("\nimport React from \"react\";\nimport ThemeProvider from '@material-ui/styles/ThemeProvider';\nimport customTheme from '../Theme/main';\n\n// add any prop types here\ninterface props {\n  userID: number;\n}\n\n// map your state here\ninterface state {}\n\nexport class " + title + " extends React.PureComponent<props, state> {\n  constructor(props: props) {\n    super(props);\n  }\n  render() {\n    return (\n      <ThemeProvider theme={customTheme.lightTheme}>\n        <h1>" + title + "!</h1>\n      </ThemeProvider>\n    );\n  }\n}").replace('\n', '');
}
function indexTemplate(title) {
    title = titleCase(title);
    return ("\nimport React from 'react'\nimport ReactDOM from 'react-dom'\nimport { " + title + " } from './main'\n\nReactDOM.render(<" + title + " userID={8418} />, document.getElementById('root'))\n").replace('\n', '');
}
function cfmTemplate(title) {
    title = titleCase(title);
    return ("\n<!DOCTYPE html>\n<html>\n  <body>\n    <div id=\"" + title + "Root\"></div>\n    <script src=\"app/assets/modules/" + title + ".js\"></script>\n    <script>\n      ReactDOM.render(\n        React.createElement(" + title + ", { userID: <cfoutput>#session.user.id#</cfoutput> }),\n        document.getElementById('" + title + "Root'),\n      );\n    </script>\n  </body>\n</html>").replace('\n', '');
}
function cfcTemplate(title) {
    title = title.toLowerCase();
    return "\n  function " + title + "(rc){\n    rc.title = \"" + titleCase(title) + "\";\n  }\n\n}";
}
function patchCFC() {
    return __awaiter(this, void 0, void 0, function () {
        var branch, res, cfcFunc, output, cfmFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBranch()];
                case 1:
                    branch = (_a.sent()).replace(/\n/g, '');
                    res = sh.cat('build/common/module.cfc');
                    cfcFunc = cfcTemplate(branch);
                    if (!!res.stdout.includes(cfcFunc)) return [3 /*break*/, 4];
                    output = sh.ShellString(res.stdout.replace(/}$/, cfcFunc));
                    output.to('build/common/module.cfc');
                    return [4 /*yield*/, sh.exec("scp build/common/module.cfc " + MODULE_CFC)];
                case 2:
                    _a.sent();
                    cfmFile = sh.ShellString(cfmTemplate(branch));
                    cfmFile.to("build/modules/" + branch + ".cfm");
                    return [4 /*yield*/, sh.exec("scp build/modules/" + branch + ".cfm " + MODULE_CFM + "/" + branch.toLowerCase() + ".cfm")];
                case 3:
                    _a.sent();
                    sh.rm("build/modules/" + branch + ".cfm");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function titleCase(str) {
    return "" + str[0].toUpperCase() + str.slice(1);
}
function getBranch() {
    return new Promise(function (resolve) {
        sh.exec('git rev-parse --abbrev-ref HEAD', { silent: true }, function (code, output) {
            resolve(output);
        });
    });
}
function rollupBuild() {
    return __awaiter(this, void 0, void 0, function () {
        var target, err_3, minify, modules, inputStr, bundle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 1, , 3]);
                    target = titleCase(process.argv[4].replace(/-/g, ''));
                    return [3 /*break*/, 3];
                case 1:
                    err_3 = _a.sent();
                    return [4 /*yield*/, getBranch()];
                case 2:
                    target = target = (_a.sent()).replace(/\n/g, '');
                    return [3 /*break*/, 3];
                case 3:
                    minify = process.argv[5];
                    return [4 /*yield*/, getModulesList()];
                case 4:
                    modules = (_a.sent()).map(function (s) { return s.toLowerCase(); });
                    if (!modules.includes(target.toLowerCase())) {
                        throw "module " + target + " could not be found";
                    }
                    inputStr = "modules/" + target + "/main.tsx";
                    if (!fs.existsSync(inputStr)) {
                        inputStr = "modules/" + target + "/main.ts";
                    }
                    return [4 /*yield*/, rollup.rollup({
                            input: inputStr,
                            plugins: [
                                resolve({ browser: true, preferBuiltins: true }),
                                commonjs({
                                    namedExports: NAMED_EXPORTS
                                }),
                                globals(),
                                builtins(),
                                typescript({
                                    module: 'ES2015',
                                    noEmitOnError: false
                                }),
                                scss(),
                                image(),
                                jsonPlugin(),
                                peerDependencies(),
                                replace({
                                    'process.env.NODE_ENV': JSON.stringify('production'),
                                    'core-dev.kalosflorida.com': 'core.kalosflorida.com'
                                }),
                            ]
                        })];
                case 5:
                    bundle = _a.sent();
                    return [4 /*yield*/, bundle.write({
                            file: "build/modules/" + target + ".js",
                            name: titleCase(target),
                            format: 'umd',
                            globals: {
                                react: 'React',
                                'react-dom': 'ReactDOM'
                            },
                            plugins: minify ? [terser()] : []
                        })];
                case 6:
                    _a.sent();
                    sh.sed('-i', 'bufferEs6.hasOwnProperty(key$2)', 'key$2 in bufferEs6', "build/modules/" + target + ".js");
                    sh.sed('-i', '_a = _typeModule(_typeModule)', 'var _a = _typeModule(_typeModule);', "build/modules/" + target + ".js");
                    return [2 /*return*/];
            }
        });
    });
}
function googBuild() {
    return __awaiter(this, void 0, void 0, function () {
        var bundle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rollup.rollup({
                        input: 'node_modules/google-protobuf/google-protobuf.js',
                        plugins: [resolve(), commonjs()]
                    })];
                case 1:
                    bundle = _a.sent();
                    return [4 /*yield*/, bundle.write({
                            file: 'build/common/google-protobuf.js',
                            name: 'googleProtobuf',
                            format: 'umd'
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function release() {
    return __awaiter(this, void 0, void 0, function () {
        var target, err_4, modules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rollupBuild()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 3, , 5]);
                    target = titleCase(process.argv[4].replace(/-/g, ''));
                    return [3 /*break*/, 5];
                case 3:
                    err_4 = _a.sent();
                    return [4 /*yield*/, getBranch()];
                case 4:
                    target = target = (_a.sent()).replace(/\n/g, '');
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, getModulesList()];
                case 6:
                    modules = (_a.sent()).map(function (s) { return s.toLowerCase(); });
                    if (!modules.includes(target.toLowerCase())) {
                        throw "module " + target + " could not be found";
                    }
                    //await patchCFC();
                    return [4 /*yield*/, sh.exec("scp build/modules/" + target + ".js " + KALOS_ASSETS + "/modules/" + target + ".js")];
                case 7:
                    //await patchCFC();
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function upload() {
    return __awaiter(this, void 0, void 0, function () {
        var target, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 1, , 3]);
                    target = titleCase(process.argv[4].replace(/-/g, ''));
                    return [3 /*break*/, 3];
                case 1:
                    err_5 = _a.sent();
                    return [4 /*yield*/, getBranch()];
                case 2:
                    target = target = (_a.sent()).replace(/\n/g, '');
                    return [3 /*break*/, 3];
                case 3: return [4 /*yield*/, sh.exec("scp build/modules/" + target + ".js " + KALOS_ASSETS + "/modules/" + target + ".js")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function bustCache() {
    return __awaiter(this, void 0, void 0, function () {
        var controller, filename, res, versionMatch, version, newVersion, newFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = process.argv[4].replace(/-/g, '');
                    filename = process.argv[5].replace(/-/g, '');
                    return [4 /*yield*/, sh.exec("scp " + KALOS_ROOT + "/app/admin/views/" + controller + "/" + filename + ".cfm tmp/" + filename + ".cfm")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sh.cat("tmp/" + filename + ".cfm")];
                case 2:
                    res = _a.sent();
                    if (!res.stdout.includes('.js?version=')) return [3 /*break*/, 6];
                    versionMatch = res.stdout.match(/\.js\?version=\d{1,}/);
                    if (!versionMatch) return [3 /*break*/, 6];
                    version = parseInt(versionMatch[0].replace(/\.js\?version=/, ''));
                    newVersion = version + 1;
                    newFile = new sh.ShellString(res.stdout.replace(/\.js\?version=\d{1,}/, ".js?version=" + newVersion));
                    return [4 /*yield*/, sh.rm("tmp/" + filename + ".cfm")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, newFile.to("tmp/" + filename + ".cfm")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sh.exec("scp tmp/" + filename + ".cfm " + KALOS_ROOT + "/app/admin/views/" + controller + "/" + filename + ".cfm")];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
task('bundle', rollupBuild);
task('bust', bustCache);
task('goog', googBuild);
task(release);
task('cfpatch', patchCFC);
task(upload);
var KALOS_ROOT = 'kalos-prod:/opt/coldfusion11/cfusion/wwwroot';
var KALOS_ASSETS = KALOS_ROOT + "/app/assets";
var MODULE_CFC = KALOS_ROOT + "/app/admin/controllers/module.cfc";
var MODULE_CFM = KALOS_ROOT + "/app/admin/views/module";
var NAMED_EXPORTS = {
    'node_modules/scheduler/index.js': [
        'unstable_scheduleCallback',
        'unstable_cancelCallback',
    ],
    'node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.js': ['grpc'],
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
    'node_modules/@kalos-core/kalos-rpc/compiled-protos/common_pb.js': ['Empty'],
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
        'PTO',
    ],
    'node_modules/@kalos-core/kalos-rpc/compiled-protos/timesheet_line_pb.js': [
        'TimesheetLine',
        'TimesheetLineList',
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
    ]
};
