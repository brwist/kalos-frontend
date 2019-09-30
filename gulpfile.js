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
// This file has been composed in TypeScript, but is exposed as a compiled javascript file.
// This file should not be edited directly
var task = require("gulp").task;
var sh = require("shelljs");
var readline = require("readline");
var fs = require("fs");
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var modules, entrypoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getModulesList()];
                case 1:
                    modules = _a.sent();
                    entrypoints = modules.map(function (m) { return "modules/" + m + "/index.html"; });
                    return [4 /*yield*/, sh.exec("parcel " + entrypoints.join(" "))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function create() {
    return __awaiter(this, void 0, void 0, function () {
        var name, html, js;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkBranch();
                    return [4 /*yield*/, textPrompt("module name: ")];
                case 1:
                    name = _a.sent();
                    return [4 /*yield*/, sh.mkdir("modules/" + name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sh.cd("modules/" + name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sh.touch("index.html")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sh.touch("index.tsx")];
                case 5:
                    _a.sent();
                    html = new sh.ShellString(htmlTemplate(name));
                    js = new sh.ShellString(jsTemplate(name));
                    html.to("index.html");
                    js.to("index.tsx");
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
        rl.question(question, function (answer) {
            rl.close();
            resolve(answer);
        });
    });
}
function getModulesList() {
    return __awaiter(this, void 0, void 0, function () {
        var list;
        return __generator(this, function (_a) {
            sh.cd("./modules");
            list = sh.ls().stdout.split("\n");
            sh.cd("..");
            return [2 /*return*/, list.filter(function (l) { return l; })];
        });
    });
}
// parseArgs checks process.argv for passed command line arguments, and reduces them into a javascript
// object. Arguments must be passed as flags e.g. --myFlag. Arguments can be assigned a value using =
// e.g. --myFlag=test. Arguments without values are assumed to have a literal true value. parseArgs
// can allow for any gulp task to accept command line flags, altering their behavior.
function parseArgs() {
    var args = process.argv.slice(3);
    if (args.length === 0) {
        return args;
    }
    else {
        try {
            return args.reduce(function (argObject, arg) {
                var _a = arg.split("="), key = _a[0], value = _a[1];
                argObject[key.replace(/-/g, "")] = value || true;
                return argObject;
            }, {});
        }
        catch (err) {
            console.log(err);
            sh.exit(1);
        }
    }
}
task(start);
task(create);
function htmlTemplate(title) {
    return "<!DOCTYPE html>\n<html>\n  <head>\n    <title>" + title + "</title>\n  </head>\n  <body>\n    <script src=\"index.tsx\"></script>\n  </body>\n</html>";
}
function jsTemplate(title) {
    title = titleCase(title);
    return "import React from \"react\";\n\ninterface props {}\ninterface state {}\n\nexport class " + title + " extends React.PureComponent<props, state> {\n  constructor(props: props) {\n    super(props);\n  }\n  render() {\n    return <h1>" + title + "!</h1>;\n  }\n}";
}
function titleCase(str) {
    return "" + str[0].toUpperCase() + str.slice(1);
}
function getBranch() {
    return new Promise(function (resolve) {
        sh.exec("git rev-parse --abbrev-ref HEAD", function (code, output) {
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
                    branch = _a.sent();
                    console.log(branch);
                    if (branch === "master") {
                        console.log("Checkout a new branch please!");
                        sh.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
