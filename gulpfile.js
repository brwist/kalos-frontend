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
var typescript = require('rollup-plugin-typescript2');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var peerDependencies = require('rollup-plugin-peer-deps-external');
var replace = require('rollup-plugin-replace');
var cleanup = require('rollup-plugin-cleanup');
var terser = require('rollup-plugin-terser').terser;
var constants = require('./constants.ts');
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var modules, entrypoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getModulesList()];
                case 1:
                    modules = _a.sent();
                    entrypoints = modules.map(function (m) { return "modules/" + m + "/index.html"; });
                    return [4 /*yield*/, sh.exec("parcel " + entrypoints.join(' '))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function build() {
    return __awaiter(this, void 0, void 0, function () {
        var target, flags, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    target = titleCase(process.argv[4].replace(/-/g, ''));
                    flags = [
                        '--experimental-scope-hoisting',
                        "--out-dir build/" + target,
                        '--target browser',
                        '--detailed-report',
                        "--global " + target,
                    ];
                    info("Bundling modules/" + target + "/main.html to dist/" + target + ".main.tsx");
                    return [4 /*yield*/, sh.exec("NODE_ENV=production parcel build modules/" + target + "/index.html " + flags.join(' '), { silent: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    error(err_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
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
function parseArgs() {
    var args = process.argv.slice(3);
    if (args.length === 0) {
        return {};
    }
    else {
        try {
            return args.reduce(function (argObject, arg) {
                var _a = arg.split('='), key = _a[0], value = _a[1];
                argObject[key.replace(/-/g, '')] = value || true;
                return argObject;
            }, {});
        }
        catch (err) {
            error(err);
            sh.exit(1);
        }
    }
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
task(build);
task(create);
function htmlTemplate(title) {
    return ("\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>" + title + "</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script src=\"index.tsx\"></script>\n  </body>\n</html>").replace('\n', '');
    // this removes the first instance of a new line from the output string
    // which allows the document to be written cleanly at the correct tab level
}
function mainTemplate(title) {
    title = titleCase(title);
    return ("\nimport React from \"react\";\n\ninterface props {\n  userId: number;\n}\n\ninterface state {}\n\nexport class " + title + " extends React.PureComponent<props, state> {\n  constructor(props: props) {\n    super(props);\n  }\n  render() {\n    return <h1>" + title + "!</h1>;\n  }\n}").replace('\n', '');
}
function indexTemplate(title) {
    title = titleCase(title);
    return ("\nimport React from 'react'\nimport ReactDOM from 'react-dom'\nimport { " + title + " } from './main'\n\nReactDOM.render(<" + title + "/>, document.getElementById('root'))\n").replace('\n', '');
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
function checkBranch() {
    return __awaiter(this, void 0, void 0, function () {
        var branch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBranch()];
                case 1:
                    branch = (_a.sent()).replace(/\n/g, '');
                    if (branch === 'master') {
                        error("Don't make commits to master! Want to make a new branch?");
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function rollupBuild() {
    return __awaiter(this, void 0, void 0, function () {
        var target, modules, bundle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBranch()];
                case 1:
                    target = (_a.sent()).replace(/\n/g, '');
                    return [4 /*yield*/, getModulesList()];
                case 2:
                    modules = (_a.sent()).map(function (s) { return s.toLowerCase(); });
                    if (!modules.includes(target.toLowerCase())) {
                        throw "module " + target + " could not be found";
                    }
                    return [4 /*yield*/, rollup.rollup({
                            input: "modules/" + target + "/main.tsx",
                            plugins: [
                                resolve(),
                                commonjs({
                                    namedExports: constants.NAMED_EXPORTS
                                }),
                                typescript({
                                    tsconfigOverride: {
                                        compilerOptions: {
                                            module: 'ES2015'
                                        }
                                    }
                                }),
                                peerDependencies(),
                                replace({
                                    'process.env.NODE_ENV': JSON.stringify('production')
                                }),
                                cleanup({
                                    comments: 'all',
                                    sourcemap: true
                                }),
                                terser(),
                            ]
                        })];
                case 3:
                    bundle = _a.sent();
                    return [4 /*yield*/, bundle.write({
                            file: "build/modules/" + target + ".js",
                            name: titleCase(target),
                            format: 'umd'
                        })];
                case 4:
                    _a.sent();
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
                        input: "node_modules/google-protobuf/google-protobuf.js",
                        plugins: [resolve(), commonjs()]
                    })];
                case 1:
                    bundle = _a.sent();
                    return [4 /*yield*/, bundle.write({
                            file: "build/common/google-protobuf.js",
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
        var target, modules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rollupBuild()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getBranch()];
                case 2:
                    target = (_a.sent()).replace(/\n/g, '');
                    return [4 /*yield*/, getModulesList()];
                case 3:
                    modules = (_a.sent()).map(function (s) { return s.toLowerCase(); });
                    if (!modules.includes(target.toLowerCase())) {
                        throw "module " + target + " could not be found";
                    }
                    return [4 /*yield*/, sh.exec("scp build/modules/" + target + ".js " + constants.KALOS_ASSETS + "/modules/" + target + ".js")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
task('bundle', rollupBuild);
task('goog', googBuild);
task(release);
