"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.customerCheck = exports.forceHTTPS = exports.newBugReportImage = exports.newBugReport = exports.escapeText = exports.loadEventsByJobOrContractNumbers = exports.loadEventByJobOrContractNumber = exports.loadSpiffToolAdminActionsByTaskId = exports.getWeekOptions = exports.roundNumber = exports.loadMetricByUserIds = exports.loadMetricByUserId = exports.loadUsersByDepartmentId = exports.loadTimesheetDepartments = exports.trailingZero = exports.loadQuoteLines = exports.loadQuoteLineParts = exports.loadQuoteParts = exports.loadStoredQuotes = exports.loadServicesRendered = exports.loadEventsByPropertyId = exports.loadTechnicians = exports.loadGeoLocationByAddress = exports.range = exports.loadUsersByIds = exports.loadUserById = exports.loadPropertyById = exports.loadJobTypeSubtypes = exports.loadJobSubtypes = exports.loadJobTypes = exports.padWithZeroes = exports.formatDateTime = exports.getRPCFields = exports.makeFakeRows = exports.formatDateTimeDay = exports.formatDay = exports.formatDate = exports.formatTime = exports.b64toBlob = exports.getURLParams = exports.getEditDistance = exports.slackNotify = exports.getSlackID = exports.getSlackList = exports.timestamp = exports.BASE_URL = exports.cfURL = exports.getDateTimeArgs = exports.getDateArgs = exports.SUBJECT_TAGS = exports.CustomEventsHandler = exports.deleteTaskEvent = exports.upsertTaskEvent = exports.loadTaskEventsByFilter = exports.loadGovPerDiem = exports.loadPerDiemsLodging = exports.loadGovPerDiemByZipCode = exports.getUploadedHTMLUrl = exports.makeMonthsOptions = exports.makeLast12MonthsOptions = exports.setInlineStyles = exports.openFile = exports.getFileS3BucketUrl = exports.deleteDocumentKeyById = exports.saveDocumentKey = exports.loadDocumentKeys = exports.deleteFileById = exports.upsertFile = exports.loadFiles = exports.deleteInternalDocumentById = exports.upsertInternalDocument = exports.loadInternalDocuments = exports.getCurrDate = exports.deletePropertyById = exports.deleteUserById = exports.deleteEventById = exports.upsertEvent = exports.saveUser = exports.saveProperty = exports.loadUserGroupLinksByUserId = exports.loadGroups = exports.getPropertyAddress = exports.getCustomerNameAndBusinessName = exports.getCustomerPhoneWithExt = exports.getCustomerPhone = exports.getBusinessName = exports.getCustomerName = exports.getDepartmentName = exports.makeOptions = exports.deleteFileFromS3Buckets = exports.moveFileBetweenS3Buckets = exports.uploadFileToS3Bucket = exports.loadEventsByFilter = exports.loadContractsByFilter = exports.loadPropertiesByFilter = exports.loadActivityLogsByFilter = exports.loadSpiffReportByFilter = exports.loadPromptPaymentData = exports.loadServiceCallMetricsByFilter = exports.loadWarrantyReport = exports.loadTimeoffSummaryReport = exports.loadCharityReport = exports.loadBillingAuditReport = exports.loadCallbackReportByFilter = exports.loadDeletedServiceCallsByFilter = exports.loadPerformanceMetricsByFilter = exports.loadUsersByFilter = exports.deletePerDiemRowById = exports.upsertPerDiemRow = exports.deletePerDiemById = exports.approvePerDiemById = exports.submitPerDiemById = exports.updatePerDiemNeedsAudit = exports.upsertTrip = exports.getTripDistance = exports.addressStringToPlace = exports.upsertPerDiem = exports.loadPerDiemsReport = exports.loadPerDiemsNeedsAuditing = exports.loadPerDiemByDepartmentIdsAndDateStarted = exports.loadPerDiemByUserIdsAndDateStarted = exports.loadPerDiemByUserIdAndDateStarted = exports.loadPerDiemsByEventId = exports.refreshToken = exports.upsertTimeoffRequest = exports.deleteTimeoffRequestById = exports.getTimeoffRequestByFilter = exports.getTimeoffRequestById = exports.getTimeoffRequestTypes = exports.getPTOInquiryByUserId = exports.loadTransactionsByEventId = exports.downloadCSV = exports.deleteEmployeeFunctionById = exports.upsertEmployeeFunction = exports.loadEmployeeFunctions = exports.upsertEventTask = exports.deleteProjectTaskById = exports.loadProjectTaskBillableTypes = exports.loadProjectTaskPriorities = exports.loadProjectTaskStatuses = exports.loadProjectTasks = exports.loadEventById = exports.loadCreditCard = exports.loadQuotable = exports.loadTasks = exports.loadSpiffToolLogs = exports.deletetSpiffTool = exports.updateSpiffTool = exports.upsertTaskAssignments = exports.loadTaskAssignment = exports.upsertTask = exports.updateDocumentDescription = exports.createTaskDocument = exports.loadSpiffTypes = exports.deletetSpiffToolAdminAction = exports.upsertSpiffToolAdminAction = exports.getDepartmentByManagerID = exports.getMimeType = exports.getFileExt = exports.upsertTransactionDocument = exports.usd = exports.getCFAppUrl = exports.TimeoffRequestClientService = exports.FileClientService = exports.S3ClientService = exports.InternalDocumentClientService = exports.UserGroupLinkClientService = exports.GroupClientService = exports.SpiffToolAdminActionClientService = exports.MetricsClientService = exports.TimesheetDepartmentClientService = exports.QuoteLineClientService = exports.QuoteLinePartClientService = exports.QuotePartClientService = exports.StoredQuoteClientService = exports.ServicesRenderedClientService = exports.MapClientService = exports.PerDiemClientService = exports.EmployeeFunctionClientService = exports.ActivityLogClientService = exports.JobTypeSubtypeClientService = exports.JobSubtypeClientService = exports.JobTypeClientService = exports.EventClientService = exports.ContractClientService = exports.PropertyClientService = exports.UserClientService = exports.PDFClientService = exports.TaskClientService = exports.ReportClientService = exports.DocumentClientService = exports.TransactionClientService = exports.TaskEventClientService = exports.TaskAssignmentClientService = exports.TransactionDocumentClientService = void 0;
var uniq_1 = require("lodash/uniq");
var sortBy_1 = require("lodash/sortBy");
var compact_1 = require("lodash/compact");
var date_fns_1 = require("date-fns");
var S3File_1 = require("@kalos-core/kalos-rpc/S3File");
exports.SUBJECT_TAGS = S3File_1.SUBJECT_TAGS;
var File_1 = require("@kalos-core/kalos-rpc/File");
var ApiKey_1 = require("@kalos-core/kalos-rpc/ApiKey");
var User_1 = require("@kalos-core/kalos-rpc/User");
var Property_1 = require("@kalos-core/kalos-rpc/Property");
var Event_1 = require("@kalos-core/kalos-rpc/Event");
var JobType_1 = require("@kalos-core/kalos-rpc/JobType");
var TimeoffRequest_1 = require("@kalos-core/kalos-rpc/TimeoffRequest");
var Transaction_1 = require("@kalos-core/kalos-rpc/Transaction");
var TaskEvent_1 = require("@kalos-core/kalos-rpc/TaskEvent");
var Task_1 = require("@kalos-core/kalos-rpc/Task");
var TaskAssignment_1 = require("@kalos-core/kalos-rpc/TaskAssignment");
var ActivityLog_1 = require("@kalos-core/kalos-rpc/ActivityLog");
var Report_1 = require("@kalos-core/kalos-rpc/Report");
var EmployeeFunction_1 = require("@kalos-core/kalos-rpc/EmployeeFunction");
var JobSubtype_1 = require("@kalos-core/kalos-rpc/JobSubtype");
var JobTypeSubtype_1 = require("@kalos-core/kalos-rpc/JobTypeSubtype");
var ServicesRendered_1 = require("@kalos-core/kalos-rpc/ServicesRendered");
var StoredQuote_1 = require("@kalos-core/kalos-rpc/StoredQuote");
var QuotePart_1 = require("@kalos-core/kalos-rpc/QuotePart");
var QuoteLinePart_1 = require("@kalos-core/kalos-rpc/QuoteLinePart");
var QuoteLine_1 = require("@kalos-core/kalos-rpc/QuoteLine");
var PerDiem_1 = require("@kalos-core/kalos-rpc/PerDiem");
var Maps_1 = require("@kalos-core/kalos-rpc/Maps");
var perdiem_pb_1 = require("@kalos-core/kalos-rpc/compiled-protos/perdiem_pb");
var TimesheetDepartment_1 = require("@kalos-core/kalos-rpc/TimesheetDepartment");
var Metrics_1 = require("@kalos-core/kalos-rpc/Metrics");
var SpiffToolAdminAction_1 = require("@kalos-core/kalos-rpc/SpiffToolAdminAction");
var Group_1 = require("@kalos-core/kalos-rpc/Group");
var UserGroupLink_1 = require("@kalos-core/kalos-rpc/UserGroupLink");
var TransactionDocument_1 = require("@kalos-core/kalos-rpc/TransactionDocument");
var InternalDocument_1 = require("@kalos-core/kalos-rpc/InternalDocument");
var PDF_1 = require("@kalos-core/kalos-rpc/PDF");
var Document_1 = require("@kalos-core/kalos-rpc/Document");
var internal_document_pb_1 = require("@kalos-core/kalos-rpc/compiled-protos/internal_document_pb");
var constants_1 = require("./constants");
var helpers_1 = require("./modules/ComponentsLibrary/helpers");
var Contract_1 = require("@kalos-core/kalos-rpc/Contract");
exports.TransactionDocumentClientService = new TransactionDocument_1.TransactionDocumentClient(constants_1.ENDPOINT);
exports.TaskAssignmentClientService = new TaskAssignment_1.TaskAssignmentClient(constants_1.ENDPOINT);
exports.TaskEventClientService = new TaskEvent_1.TaskEventClient(constants_1.ENDPOINT);
exports.TransactionClientService = new Transaction_1.TransactionClient(constants_1.ENDPOINT);
exports.DocumentClientService = new Document_1.DocumentClient(constants_1.ENDPOINT);
exports.ReportClientService = new Report_1.ReportClient(constants_1.ENDPOINT);
exports.TaskClientService = new Task_1.TaskClient(constants_1.ENDPOINT);
exports.PDFClientService = new PDF_1.PDFClient(constants_1.ENDPOINT);
exports.UserClientService = new User_1.UserClient(constants_1.ENDPOINT);
exports.PropertyClientService = new Property_1.PropertyClient(constants_1.ENDPOINT);
exports.ContractClientService = new Contract_1.ContractClient(constants_1.ENDPOINT);
exports.EventClientService = new Event_1.EventClient(constants_1.ENDPOINT);
exports.JobTypeClientService = new JobType_1.JobTypeClient(constants_1.ENDPOINT);
exports.JobSubtypeClientService = new JobSubtype_1.JobSubtypeClient(constants_1.ENDPOINT);
exports.JobTypeSubtypeClientService = new JobTypeSubtype_1.JobTypeSubtypeClient(constants_1.ENDPOINT);
exports.ActivityLogClientService = new ActivityLog_1.ActivityLogClient(constants_1.ENDPOINT);
exports.EmployeeFunctionClientService = new EmployeeFunction_1.EmployeeFunctionClient(constants_1.ENDPOINT);
exports.PerDiemClientService = new PerDiem_1.PerDiemClient(constants_1.ENDPOINT);
exports.MapClientService = new Maps_1.MapClient(constants_1.ENDPOINT);
exports.ServicesRenderedClientService = new ServicesRendered_1.ServicesRenderedClient(constants_1.ENDPOINT);
exports.StoredQuoteClientService = new StoredQuote_1.StoredQuoteClient(constants_1.ENDPOINT);
exports.QuotePartClientService = new QuotePart_1.QuotePartClient(constants_1.ENDPOINT);
exports.QuoteLinePartClientService = new QuoteLinePart_1.QuoteLinePartClient(constants_1.ENDPOINT);
exports.QuoteLineClientService = new QuoteLine_1.QuoteLineClient(constants_1.ENDPOINT);
exports.TimesheetDepartmentClientService = new TimesheetDepartment_1.TimesheetDepartmentClient(constants_1.ENDPOINT);
exports.MetricsClientService = new Metrics_1.MetricsClient(constants_1.ENDPOINT);
exports.SpiffToolAdminActionClientService = new SpiffToolAdminAction_1.SpiffToolAdminActionClient(constants_1.ENDPOINT);
exports.GroupClientService = new Group_1.GroupClient(constants_1.ENDPOINT);
exports.UserGroupLinkClientService = new UserGroupLink_1.UserGroupLinkClient(constants_1.ENDPOINT);
exports.InternalDocumentClientService = new InternalDocument_1.InternalDocumentClient(constants_1.ENDPOINT);
exports.S3ClientService = new S3File_1.S3Client(constants_1.ENDPOINT);
exports.FileClientService = new File_1.FileClient(constants_1.ENDPOINT);
exports.TimeoffRequestClientService = new TimeoffRequest_1.TimeoffRequestClient(constants_1.ENDPOINT);
var StateCode = {
    alabama: 'AL',
    alaska: 'AK',
    'american samoa': 'AS',
    arizona: 'AZ',
    arkansas: 'AR',
    california: 'CA',
    colorado: 'CO',
    connecticut: 'CT',
    delaware: 'DE',
    'district of columbia': 'DC',
    'federated states of micronesia': 'FM',
    florida: 'FL',
    georgia: 'GA',
    guam: 'GU',
    hawaii: 'HI',
    idaho: 'ID',
    illinois: 'IL',
    indiana: 'IN',
    iowa: 'IA',
    kansas: 'KS',
    kentucky: 'KY',
    louisiana: 'LA',
    maine: 'ME',
    'marshall islands': 'MH',
    maryland: 'MD',
    massachusetts: 'MA',
    michigan: 'MI',
    minnesota: 'MN',
    mississippi: 'MS',
    missouri: 'MO',
    montana: 'MT',
    nebraska: 'NE',
    nevada: 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    'northern mariana islands': 'MP',
    ohio: 'OH',
    oklahoma: 'OK',
    oregon: 'OR',
    palau: 'PW',
    pennsylvania: 'PA',
    'puerto rico': 'PR',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    tennessee: 'TN',
    texas: 'TX',
    utah: 'UT',
    vermont: 'VT',
    'virgin islands': 'VI',
    virginia: 'VA',
    washington: 'WA',
    'west virginia': 'WV',
    wisconsin: 'WI',
    wyoming: 'WY'
};
var BASE_URL = 'https://app.kalosflorida.com/index.cfm';
exports.BASE_URL = BASE_URL;
var KALOS_BOT = 'xoxb-213169303473-vMbrzzbLN8AThTm4JsXuw4iJ';
exports.getCFAppUrl = function (action) { return BASE_URL + "?action=" + action; };
function cfURL(action, qs) {
    if (qs === void 0) { qs = ''; }
    return BASE_URL + "?action=admin:" + action + qs;
}
exports.cfURL = cfURL;
/**
 *
 * @param number
 * @returns string as number with trailing zero, if number is lett than 10
 */
function trailingZero(val) {
    return "" + (val < 10 ? 0 : '') + val;
}
exports.trailingZero = trailingZero;
/**
 *
 * @param number
 * @returns string as usd amount, example 10.5 -> $10.50;
 */
exports.usd = function (val) { return "$ " + val.toFixed(2); };
/**
 *
 * @param dateOnly if true, returns only the date portion YYYY-MM-DD
 * @returns a timestamp in the format YYYY-MM-DD HH:MM:SS
 */
function timestamp(dateOnly) {
    if (dateOnly === void 0) { dateOnly = false; }
    var dateObj = new Date();
    var month = "" + (dateObj.getMonth() + 1);
    if (month.length === 1) {
        month = "0" + month;
    }
    var day = "" + dateObj.getDate();
    if (day.length === 1) {
        day = "0" + day;
    }
    var hour = "" + dateObj.getHours();
    if (hour.length === 1) {
        hour = "0" + hour;
    }
    var minute = "" + dateObj.getMinutes();
    if (minute.length === 1) {
        minute = "0" + minute;
    }
    var second = "" + dateObj.getSeconds();
    if (second.length === 1) {
        second = "0" + second;
    }
    if (dateOnly) {
        return dateObj.getFullYear() + "-" + month + "-" + day;
    }
    return dateObj.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
exports.timestamp = timestamp;
function slackNotify(id, text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://slack.com/api/chat.postMessage?token=" + KALOS_BOT + "&channel=" + id + "&text=" + text, {
                        method: 'POST'
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.slackNotify = slackNotify;
function getSlackList(skipCache) {
    if (skipCache === void 0) { skipCache = false; }
    return __awaiter(this, void 0, void 0, function () {
        var listStr, cacheList, res, jsonRes, resString, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!skipCache) {
                        listStr = localStorage.getItem('SLACK_USER_CACHE');
                        if (listStr) {
                            cacheList = JSON.parse(listStr);
                            if (cacheList) {
                                return [2 /*return*/, cacheList];
                            }
                        }
                    }
                    return [4 /*yield*/, fetch("https://slack.com/api/users.list?token=" + KALOS_BOT)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    jsonRes = _a.sent();
                    try {
                        resString = JSON.stringify(jsonRes.members);
                        localStorage.setItem('SLACK_USER_CACHE', resString);
                    }
                    catch (err) {
                        console.log('failed to save slack list in local storage', err);
                    }
                    return [2 /*return*/, jsonRes.members];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, getSlackList(true)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getSlackList = getSlackList;
function getSlackID(userName, skipCache, count) {
    if (skipCache === void 0) { skipCache = false; }
    if (count === void 0) { count = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var slackUsers, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(count != 4)) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 8]);
                    return [4 /*yield*/, getSlackList(skipCache)];
                case 2:
                    slackUsers = _a.sent();
                    user = slackUsers.find(function (s) {
                        if (s.real_name === userName) {
                            return true;
                        }
                        if (s.profile.real_name === userName) {
                            return true;
                        }
                        if (s.profile.real_name_normalized === userName) {
                            return true;
                        }
                    });
                    if (!user) return [3 /*break*/, 3];
                    return [2 /*return*/, user.id];
                case 3:
                    count = count + 1;
                    return [4 /*yield*/, getSlackID(userName, true, count)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [3 /*break*/, 8];
                case 6:
                    err_2 = _a.sent();
                    count = count + 1;
                    return [4 /*yield*/, getSlackID(userName, true, count)];
                case 7: return [2 /*return*/, _a.sent()];
                case 8: return [2 /*return*/, '0'];
            }
        });
    });
}
exports.getSlackID = getSlackID;
function getEditDistance(strOne, strTwo) {
    var strOneLen = strOne.length;
    var strTwoLen = strTwo.length;
    var prevRow = [];
    var strTwoChar = [];
    var nextCol = 0;
    var curCol = 0;
    if (strOneLen === 0) {
        return strTwoLen;
    }
    if (strTwoLen === 0) {
        return strOneLen;
    }
    for (var i = 0; i < strTwoLen; ++i) {
        prevRow[i] = i;
        strTwoChar[i] = strTwo.charCodeAt(i);
    }
    prevRow[strTwoLen] = strTwoLen;
    var strComparison;
    var tmp;
    var j;
    for (var i = 0; i < strOneLen; ++i) {
        nextCol = i + 1;
        for (j = 0; j < strTwoLen; ++j) {
            curCol = nextCol;
            strComparison = strOne.charCodeAt(i) === strTwoChar[j];
            nextCol = prevRow[j] + (strComparison ? 0 : 1);
            tmp = curCol + 1;
            if (nextCol > tmp) {
                nextCol = tmp;
            }
            tmp = prevRow[j + 1] + 1;
            if (nextCol > tmp) {
                nextCol = tmp;
            }
            // copy current col value into previous (in preparation for next iteration)
            prevRow[j] = curCol;
        }
        // copy last col value into previous (in preparation for next iteration)
        prevRow[j] = nextCol;
    }
    return nextCol;
}
exports.getEditDistance = getEditDistance;
function getURLParams() {
    var params = new URLSearchParams(window.location.search);
    var res = {};
    params.forEach(function (val, key) {
        res[key] = val;
    });
    return res;
}
exports.getURLParams = getURLParams;
exports.upsertTransactionDocument = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, methodName, upperCaseProp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new TransactionDocument_1.TransactionDocument();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.TransactionDocumentClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
function b64toBlob(b64Data, fileName) {
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    var contentType = exports.getMimeType(fileName);
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}
exports.b64toBlob = b64toBlob;
exports.getFileExt = function (fileName) {
    var arr = fileName.toLowerCase().split('.');
    return arr[arr.length - 1];
};
exports.getMimeType = function (fileName) {
    var ext = exports.getFileExt(fileName);
    if (ext === 'pdf') {
        return 'application/pdf';
    }
    else if (ext === 'doc' || ext === 'docx') {
        return 'application/msword';
    }
    else if (ext === 'png') {
        return 'image/png';
    }
    else if (ext === 'jpg' || ext === 'jpeg') {
        return 'image/jpeg';
    }
};
/**
 *
 * @param time time in format HH:MM (ie. 16:30)
 * @returns format h:MMa (ie. 4:30AM)
 */
function formatTime(time, forceMinutes) {
    if (forceMinutes === void 0) { forceMinutes = true; }
    var str = time.includes(' ') ? time.substr(11) : time;
    var _a = str.split(':'), hourStr = _a[0], minutes = _a[1];
    var hour = +hourStr;
    var minute = +minutes;
    return ((hour > 12 ? hour - 12 : hour || 12) +
        (forceMinutes || minute ? ":" + minutes : '') +
        (hour < 12 ? ' AM' : ' PM'));
}
exports.formatTime = formatTime;
/**
 *
 * @param date date in format YYYY-MM-DD (ie. 2020-06-01)
 * @returns format M/D/YYYY (ie. 6/1/2020)
 */
function formatDate(date) {
    if (!date)
        return '';
    var _a = date.substr(0, 10).split('-'), year = _a[0], month = _a[1], day = _a[2];
    if (+month + +day + +year === 0)
        return '';
    return [+month, +day, +year].join('/');
}
exports.formatDate = formatDate;
/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format Day (ie. Tue)
 */
function formatDay(datetime) {
    return {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat'
    }[new Date(datetime.substr(0, 10)).getDay()];
}
exports.formatDay = formatDay;
/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format M/D/YYYY h:MMa (ie. 6/1/2020 3:28PM)
 */
function formatDateTime(datetime) {
    return formatDate(datetime) + ' ' + formatTime(datetime.substr(11));
}
exports.formatDateTime = formatDateTime;
/**
 *
 * @param num number which needs a zero in front if it is less than 10
 * @returns string of the number with 0 in front if it is less than 10, otherwise just
 * the number
 */
function padWithZeroes(num) {
    return num < 10 ? '0' + num : String(num);
}
exports.padWithZeroes = padWithZeroes;
/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format Day M/D/YYYY h:MMa (ie. Tue 6/1/2020 3:28PM)
 */
function formatDateTimeDay(datetime) {
    return (formatDay(datetime) +
        ', ' +
        formatDate(datetime) +
        ' ' +
        formatTime(datetime.substr(11)));
}
exports.formatDateTimeDay = formatDateTimeDay;
/**
 * Returns array of fake rows for InfoTable component
 * @param columns: number (default 1)
 * @param rows: number (default 3)
 * @returns fake rows with columns being { value: '' }
 */
function makeFakeRows(columns, rows) {
    if (columns === void 0) { columns = 1; }
    if (rows === void 0) { rows = 3; }
    return Array.from(Array(rows)).map(function () {
        return Array.from(Array(columns)).map(function () { return ({ value: '' }); });
    });
}
exports.makeFakeRows = makeFakeRows;
/**
 * Returns rpc fields
 * @param fieldName: field name, ie. jobNumber
 * @returns object { upperCaseProp: string, methodName: string }, ie. { upperCaseProp: 'JobNumber', methodName: 'setJobNumber'}
 */
function getRPCFields(fieldName) {
    var upperCaseProp = "" + fieldName[0].toUpperCase() + fieldName.slice(1);
    return {
        upperCaseProp: upperCaseProp,
        methodName: "set" + upperCaseProp
    };
}
exports.getRPCFields = getRPCFields;
/**
 * Returns loaded JobTypes
 * @returns JobType[]
 */
function loadJobTypes() {
    return __awaiter(this, void 0, void 0, function () {
        var resultsList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.JobTypeClientService.BatchGet(new JobType_1.JobType())];
                case 1:
                    resultsList = (_a.sent()).toObject().resultsList;
                    return [2 /*return*/, resultsList];
            }
        });
    });
}
exports.loadJobTypes = loadJobTypes;
/**
 * Returns loaded JobSubtypes
 * @returns JobSubtype[]
 */
function loadJobSubtypes() {
    return __awaiter(this, void 0, void 0, function () {
        var resultsList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.JobSubtypeClientService.BatchGet(new JobSubtype_1.JobSubtype())];
                case 1:
                    resultsList = (_a.sent()).toObject().resultsList;
                    return [2 /*return*/, resultsList];
            }
        });
    });
}
exports.loadJobSubtypes = loadJobSubtypes;
exports.getDepartmentByManagerID = function (userId) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, exports.TimesheetDepartmentClientService.getDepartmentByManagerID(userId)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
/** Returns loaded TimesheetDepartments
 * @returns TimesheetDepartment[]
 */
function loadTimesheetDepartments() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new TimesheetDepartment_1.TimesheetDepartment();
                    req.setPageNumber(0);
                    req.setIsActive(1);
                    return [4 /*yield*/, exports.TimesheetDepartmentClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.TimesheetDepartmentClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
exports.loadTimesheetDepartments = loadTimesheetDepartments;
/** Returns loaded Technicians
 * @returns User[]
 */
function loadTechnicians() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new User_1.User();
                    req.setPageNumber(0);
                    req.setIsActive(1);
                    req.setIsEmployee(1);
                    return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject().resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results.sort(function (a, b) {
                        var A = (a.firstname + " " + a.lastname).toLocaleLowerCase();
                        var B = (b.firstname + " " + b.lastname).toLocaleLowerCase();
                        if (A < B)
                            return -1;
                        if (A > B)
                            return 1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadTechnicians = loadTechnicians;
/** Returns loaded Users by department id
 * @param departmentId: number
 * @returns User[]
 */
function loadUsersByDepartmentId(departmentId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new User_1.User();
                    req.setPageNumber(0);
                    req.setIsActive(1);
                    req.setEmployeeDepartmentId(departmentId);
                    return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject().resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results.sort(function (a, b) {
                        var A = (a.firstname + " " + a.lastname).toLocaleLowerCase();
                        var B = (b.firstname + " " + b.lastname).toLocaleLowerCase();
                        if (A < B)
                            return -1;
                        if (A > B)
                            return 1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadUsersByDepartmentId = loadUsersByDepartmentId;
exports.upsertSpiffToolAdminAction = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, isNew, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new SpiffToolAdminAction_1.SpiffToolAdminAction();
                fieldMaskList = [];
                isNew = !data.id;
                if (isNew) {
                    req.setCreatedDate(timestamp());
                    fieldMaskList.push('CreatedDate');
                }
                else {
                    req.setId(data.id);
                    fieldMaskList.push('Id');
                }
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    // @ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.SpiffToolAdminActionClientService[isNew ? 'Create' : 'Update'](req)];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deletetSpiffToolAdminAction = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new SpiffToolAdminAction_1.SpiffToolAdminAction();
                req.setId(id);
                return [4 /*yield*/, exports.SpiffToolAdminActionClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/** Returns loaded SpiffToolAdminActions by task id
 * @param taskId: number
 * @returns SpiffToolAdminAction[]
 */
function loadSpiffToolAdminActionsByTaskId(taskId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new SpiffToolAdminAction_1.SpiffToolAdminAction();
                    req.setPageNumber(0);
                    req.setTaskId(taskId);
                    return [4 /*yield*/, exports.SpiffToolAdminActionClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.SpiffToolAdminActionClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject().resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results.sort(function (a, b) {
                        var A = a.id;
                        var B = b.id;
                        if (A < B)
                            return 1;
                        if (A > B)
                            return -1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadSpiffToolAdminActionsByTaskId = loadSpiffToolAdminActionsByTaskId;
/**
 * Returns loaded JobTypeSubtypes
 * @returns JobTypeSubtype[]
 */
function loadJobTypeSubtypes() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new JobTypeSubtype_1.JobTypeSubtype();
                    req.setPageNumber(0);
                    return [4 /*yield*/, exports.JobTypeSubtypeClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.JobTypeSubtypeClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
exports.loadJobTypeSubtypes = loadJobTypeSubtypes;
exports.loadSpiffTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var req, resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Task_1.SpiffType();
                req.setIsActive(true);
                return [4 /*yield*/, exports.TaskClientService.GetSpiffTypes(req)];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList
                        .filter(function (item) { return !!item.ext; })
                        .sort(function (a, b) {
                        if (a.ext < b.ext)
                            return -1;
                        if (a.ext > b.ext)
                            return 1;
                        return 0;
                    })];
        }
    });
}); };
exports.createTaskDocument = function (fileName, taskId, userId, description) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Document_1.Document();
                req.setFilename(fileName);
                req.setDateCreated(timestamp());
                req.setTaskId(taskId);
                req.setUserId(userId);
                req.setDescription(description);
                req.setType(5); // FIXME is 5 correct?
                return [4 /*yield*/, exports.DocumentClientService.Create(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateDocumentDescription = function (id, description) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Document_1.Document();
                req.setId(id);
                req.setDescription(description);
                req.setFieldMaskList(['Description']);
                return [4 /*yield*/, exports.DocumentClientService.Update(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.upsertTask = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new Task_1.Task();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    // @ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.TaskClientService[data.id ? 'Update' : 'Create'](req)];
            case 1:
                id = (_b.sent()).id;
                return [2 /*return*/, id];
        }
    });
}); };
exports.loadTaskAssignment = function (taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, results, _a, resultsList, totalCount, batchesAmount, batchResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new TaskAssignment_1.TaskAssignment();
                req.setIsActive(1);
                req.setTaskId(taskId);
                results = [];
                return [4 /*yield*/, exports.TaskAssignmentClientService.BatchGet(req)];
            case 1:
                _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                results.push.apply(results, resultsList);
                if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    req.setPageNumber(idx + 1);
                                    return [4 /*yield*/, exports.TaskAssignmentClientService.BatchGet(req)];
                                case 1: return [2 /*return*/, (_a.sent()).toObject()
                                        .resultsList];
                            }
                        });
                    }); }))];
            case 2:
                batchResults = _b.sent();
                results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                _b.label = 3;
            case 3: return [2 /*return*/, results];
        }
    });
}); };
exports.upsertTaskAssignments = function (taskId, technicianIds) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new TaskAssignment_1.TaskAssignment();
                req.setTaskId(taskId);
                return [4 /*yield*/, exports.TaskAssignmentClientService.Delete(req)];
            case 1:
                _a.sent(); // FIXME deleting by taskId doesn't work - resolve when task will return TaskAssignment[]
                return [4 /*yield*/, Promise.all(technicianIds.map(function (id) {
                        var req = new TaskAssignment_1.TaskAssignment();
                        req.setTaskId(taskId);
                        req.setUserId(id);
                        exports.TaskAssignmentClientService.Create(req);
                    }))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateSpiffTool = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new Task_1.Task();
                req.setId(data.id);
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    // @ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.TaskClientService.Update(req)];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deletetSpiffTool = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Task_1.Task();
                req.setId(id);
                return [4 /*yield*/, exports.TaskClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loadSpiffToolLogs = function (_a) {
    var page = _a.page, type = _a.type, technician = _a.technician, description = _a.description, datePerformed = _a.datePerformed, beginDate = _a.beginDate, endDate = _a.endDate, jobNumber = _a.jobNumber;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, res, resultsList, count;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    req = new Task_1.Task();
                    req.setPageNumber(page);
                    req.setIsActive(true);
                    req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
                    req.setOrderDir('ASC');
                    if (technician) {
                        req.setExternalId(technician);
                    }
                    req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
                    if (description) {
                        req.setBriefDescription("%" + description + "%");
                    }
                    if (datePerformed) {
                        req.setDatePerformed(datePerformed);
                    }
                    if (beginDate && endDate) {
                        req.setDateRangeList(['>=', beginDate, '<', endDate]);
                        req.setDateTargetList(['date_performed', 'date_performed']);
                    }
                    if (jobNumber) {
                        req.setSpiffJobNumber("%" + jobNumber + "%");
                    }
                    return [4 /*yield*/, exports.TaskClientService.BatchGet(req)];
                case 1:
                    res = _b.sent();
                    resultsList = res.getResultsList().map(function (el) { return el.toObject(); });
                    count = res.getTotalCount();
                    return [2 /*return*/, { resultsList: resultsList, count: count }];
            }
        });
    });
};
exports.loadTasks = function (filter) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldName, value, methodName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Task_1.Task();
                req.setIsActive(true);
                for (fieldName in filter) {
                    value = filter[fieldName];
                    if (value) {
                        methodName = getRPCFields(fieldName).methodName;
                        //@ts-ignore
                        req[methodName](typeof value === 'number' ? value : "%" + value + "%");
                    }
                }
                return [4 /*yield*/, exports.TaskClientService.BatchGet(req)];
            case 1: return [2 /*return*/, (_a.sent()).toObject()];
        }
    });
}); };
exports.loadQuotable = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req, dataList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Event_1.Quotable();
                req.setEventId(id);
                req.setIsActive(true);
                req.setFieldMaskList(['IsActive']);
                return [4 /*yield*/, exports.EventClientService.ReadQuotes(req)];
            case 1:
                dataList = (_a.sent()).toObject().dataList;
                return [2 /*return*/, dataList];
        }
    });
}); };
/**
 * Returns loaded StoredQuotes
 * @returns StoredQuote[]
 */
function loadStoredQuotes() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, page, _a, resultsList, totalCount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new StoredQuote_1.StoredQuote();
                    page = 0;
                    _b.label = 1;
                case 1:
                    req.setPageNumber(page);
                    return [4 /*yield*/, exports.StoredQuoteClientService.BatchGet(req)];
                case 2:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (results.length === totalCount)
                        return [3 /*break*/, 4];
                    _b.label = 3;
                case 3:
                    page += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results.sort(function (_a, _b) {
                        var a = _a.description;
                        var b = _b.description;
                        var A = a.toLocaleLowerCase().trim();
                        var B = b.toLocaleLowerCase().trim();
                        if (A > B)
                            return 1;
                        if (A < B)
                            return -1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadStoredQuotes = loadStoredQuotes;
/**
 * Returns loaded ServicesRendered
 * @returns ServicesRendered[]
 */
function loadServicesRendered(eventId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, page, _a, resultsList, totalCount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new ServicesRendered_1.ServicesRendered();
                    req.setEventId(eventId);
                    req.setIsActive(1);
                    page = 0;
                    _b.label = 1;
                case 1:
                    req.setPageNumber(page);
                    return [4 /*yield*/, exports.ServicesRenderedClientService.BatchGet(req)];
                case 2:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (results.length === totalCount)
                        return [3 /*break*/, 4];
                    _b.label = 3;
                case 3:
                    page += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results.sort(function (_a, _b) {
                        var A = _a.id;
                        var B = _b.id;
                        if (A > B)
                            return -1;
                        if (A < B)
                            return 1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadServicesRendered = loadServicesRendered;
/**
 * Returns loaded QuoteParts
 * @returns QuotePart[]
 */
function loadQuoteParts() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new QuotePart_1.QuotePart();
                    req.setPageNumber(0);
                    return [4 /*yield*/, exports.QuotePartClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.QuotePartClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
exports.loadQuoteParts = loadQuoteParts;
/**
 * Returns loaded QuoteLineParts
 * @returns QuoteLinePart[]
 */
function loadQuoteLineParts() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new QuoteLinePart_1.QuoteLinePart();
                    req.setPageNumber(0);
                    return [4 /*yield*/, exports.QuoteLinePartClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.QuoteLinePartClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
exports.loadQuoteLineParts = loadQuoteLineParts;
/**
 * Returns loaded QuoteLines
 * @returns QuoteLine[]
 */
function loadQuoteLines() {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new QuoteLine_1.QuoteLine();
                    req.setPageNumber(0);
                    return [4 /*yield*/, exports.QuoteLineClientService.BatchGet(req)];
                case 1:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.QuoteLineClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _b.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _b.label = 3;
                case 3: return [2 /*return*/, results];
            }
        });
    });
}
exports.loadQuoteLines = loadQuoteLines;
exports.loadCreditCard = function (account) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new User_1.CardData();
                req.setAccount(account);
                req.setWithUser(true);
                return [4 /*yield*/, exports.UserClientService.GetCardList(req)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.loadEventById = function (serviceCallId) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Event_1.Event();
                req.setId(serviceCallId);
                return [4 /*yield*/, exports.EventClientService.Get(req)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.loadProjectTasks = function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
    var resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.EventClientService.loadTasksByEventID(eventId)];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList.sort(function (a, b) {
                        var A = a.startDate;
                        var B = b.startDate;
                        if (A < B)
                            return -1;
                        if (A > B)
                            return 1;
                        return 0;
                    })];
        }
    });
}); };
exports.loadProjectTaskStatuses = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.TaskClientService.loadTaskStatuses()];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList];
        }
    });
}); };
exports.loadProjectTaskPriorities = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.TaskClientService.loadTaskPriorityList()];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList];
        }
    });
}); };
exports.loadProjectTaskBillableTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // const { resultsList } = (
        //   await TaskClientService.loadTaskBillableTypeList() // FIXME when available in rpc
        // ).toObject();
        return [2 /*return*/, ['Flat Rate', 'Hourly', 'Parts Run', 'Spiff', 'Tool Purchase']];
    });
}); };
exports.deleteProjectTaskById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Task_1.ProjectTask();
                req.setId(id);
                return [4 /*yield*/, exports.TaskClientService.DeleteProjectTask(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.upsertEventTask = function (_a) {
    var id = _a.id, eventId = _a.eventId, externalId = _a.externalId, briefDescription = _a.briefDescription, creatorUserId = _a.creatorUserId, statusId = _a.statusId, startDate = _a.startDate, endDate = _a.endDate, priorityId = _a.priorityId;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, fieldMaskList;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    req = new Task_1.ProjectTask();
                    fieldMaskList = ['ExternalCode', 'ExternalId', 'TimeCreated'];
                    req.setTimeCreated(timestamp());
                    if (eventId) {
                        req.setEventId(eventId);
                        fieldMaskList.push('EventId');
                    }
                    if (id) {
                        req.setId(id);
                        fieldMaskList.push('Id');
                    }
                    if (externalId) {
                        req.setExternalId(externalId);
                        req.setExternalCode('user');
                    }
                    else {
                        req.setExternalId(0);
                        req.setExternalCode('project');
                    }
                    if (briefDescription) {
                        req.setBriefDescription(briefDescription);
                        fieldMaskList.push('BriefDescription');
                    }
                    if (creatorUserId) {
                        req.setCreatorUserId(creatorUserId);
                        fieldMaskList.push('CreatorUserId');
                    }
                    if (statusId) {
                        req.setStatusId(statusId);
                        fieldMaskList.push('StatusId');
                    }
                    if (startDate) {
                        req.setStartDate(startDate);
                        fieldMaskList.push('StartDate');
                    }
                    if (endDate) {
                        req.setEndDate(endDate);
                        fieldMaskList.push('EndDate');
                    }
                    if (priorityId) {
                        req.setPriorityId(priorityId);
                        fieldMaskList.push('PriorityId');
                    }
                    req.setFieldMaskList(fieldMaskList);
                    return [4 /*yield*/, exports.TaskClientService[id ? 'UpdateProjectTask' : 'CreateProjectTask'](req)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
/**
 * Returns loaded Events by property id
 * @param propertyId: property id
 * @returns Event[]
 */
function loadEventsByPropertyId(propertyId) {
    return __awaiter(this, void 0, void 0, function () {
        var results, req, page, _a, resultsList, totalCount;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    results = [];
                    req = new Event_1.Event();
                    req.setIsActive(1);
                    req.setPropertyId(propertyId);
                    page = 0;
                    _b.label = 1;
                case 1:
                    req.setPageNumber(page);
                    return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                case 2:
                    _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    results.push.apply(results, resultsList);
                    if (results.length === totalCount)
                        return [3 /*break*/, 4];
                    _b.label = 3;
                case 3:
                    page += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results.sort(function (a, b) {
                        var A = a.logJobNumber.toLocaleLowerCase();
                        var B = b.logJobNumber.toLocaleLowerCase();
                        if (A < B)
                            return -1;
                        if (A > B)
                            return 1;
                        return 0;
                    })];
            }
        });
    });
}
exports.loadEventsByPropertyId = loadEventsByPropertyId;
/**
 * Returns loaded Property by its ids
 * @param id: property id
 * @returns Property
 */
function loadPropertyById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var req;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = new Property_1.Property();
                    req.setId(id);
                    req.setIsActive(1);
                    return [4 /*yield*/, exports.PropertyClientService.Get(req)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.loadPropertyById = loadPropertyById;
/**
 * Returns loaded User by its ids
 * @param id: user id
 * @returns User
 */
function loadUserById(id, withProperties) {
    return __awaiter(this, void 0, void 0, function () {
        var req, err_3, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    req = new User_1.User();
                    req.setId(id);
                    if (withProperties) {
                        req.setWithProperties(true);
                    }
                    return [4 /*yield*/, exports.UserClientService.Get(req)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_3 = _a.sent();
                    console.log('Failed to fetch user with id', id, err_3);
                    res = new User_1.User();
                    res.setId(id);
                    res.setIsActive(1);
                    res.setIsEmployee(1);
                    return [2 /*return*/, res.toObject()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.loadUserById = loadUserById;
/**
 * Returns loaded Users by their ids
 * @param ids: array of user id
 * @returns object { [userId]: User }
 */
function loadUsersByIds(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var uniqueIds, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uniqueIds = [];
                    ids.forEach(function (id) {
                        if (id > 0 && !uniqueIds.includes(id)) {
                            uniqueIds.push(id);
                        }
                    });
                    return [4 /*yield*/, Promise.all(uniqueIds.map(function (id) { return loadUserById(id); }))];
                case 1:
                    users = _a.sent();
                    return [2 /*return*/, users.reduce(function (aggr, user) {
                            var _a;
                            return (__assign(__assign({}, aggr), (_a = {}, _a[user.id] = user, _a)));
                        }, {})];
            }
        });
    });
}
exports.loadUsersByIds = loadUsersByIds;
/**
 * Returns loaded Metric by user id and metricType
 * @param userId: number
 * @param metricType: MetricType
 * @returns metric
 */
function loadMetricByUserId(userId, metricType) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.MetricsClientService["Get" + metricType](userId)];
                case 1: 
                //@ts-ignore
                return [2 /*return*/, _a.sent()];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, { id: userId, value: 0 }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.loadMetricByUserId = loadMetricByUserId;
/**
 * Returns loaded Metric by user id
 * @param userId: number
 * @returns metric
 */
function loadMetricByUserIds(userIds, metricType) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(userIds.map(function (userId) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, loadMetricByUserId(userId, metricType)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.loadMetricByUserIds = loadMetricByUserIds;
exports.loadEmployeeFunctions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var req, resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new EmployeeFunction_1.EmployeeFunction();
                req.setIsdeleted(0);
                return [4 /*yield*/, exports.EmployeeFunctionClientService.BatchGet(req)];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList.sort(function (a, b) {
                        var A = a.name.toLowerCase();
                        var B = b.name.toLowerCase();
                        if (A < B)
                            return -1;
                        if (A > B)
                            return 1;
                        return 0;
                    })];
        }
    });
}); };
exports.upsertEmployeeFunction = function (data, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new EmployeeFunction_1.EmployeeFunction();
                fieldMaskList = ['Isdeleted'];
                req.setIsdeleted(0);
                if (data.id) {
                    req.setModifydate(timestamp());
                    req.setModifyuserid(userId);
                    fieldMaskList.push('Modifydate', 'Modifyuserid');
                }
                else {
                    req.setAddeddate(timestamp());
                    req.setAddeduserid(userId);
                    fieldMaskList.push('Addeddate', 'Addeduserid');
                }
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.EmployeeFunctionClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteEmployeeFunctionById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new EmployeeFunction_1.EmployeeFunction();
                req.setId(id);
                return [4 /*yield*/, exports.EmployeeFunctionClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.downloadCSV = function (filename, csv) {
    var link = document.createElement('a');
    link.setAttribute('download', filename + ".csv");
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.click();
};
exports.loadTransactionsByEventId = function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
    var results, req, _a, resultsList, totalCount, batchesAmount, batchResults;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                results = [];
                req = new Transaction_1.Transaction();
                req.setJobId(eventId);
                req.setIsActive(1);
                req.setPageNumber(0);
                return [4 /*yield*/, exports.TransactionClientService.BatchGet(req)];
            case 1:
                _a = (_b.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                results.push.apply(results, resultsList);
                if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    req.setPageNumber(idx + 1);
                                    return [4 /*yield*/, exports.TransactionClientService.BatchGet(req)];
                                case 1: return [2 /*return*/, (_a.sent()).toObject()
                                        .resultsList];
                            }
                        });
                    }); }))];
            case 2:
                batchResults = _b.sent();
                results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                _b.label = 3;
            case 3: return [2 /*return*/, results];
        }
    });
}); };
exports.getPTOInquiryByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, exports.TimeoffRequestClientService.PTOInquiry(userId)];
        case 1: return [2 /*return*/, (_a.sent()).toObject()];
    }
}); }); };
exports.getTimeoffRequestTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.TimeoffRequestClientService.GetTimeoffRequestTypes()];
            case 1: return [4 /*yield*/, (_a.sent()).toObject()
                    .dataList];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTimeoffRequestById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new TimeoffRequest_1.TimeoffRequest();
                req.setId(id);
                req.setIsActive(1);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, exports.TimeoffRequestClientService.Get(req)];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                e_2 = _a.sent();
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTimeoffRequestByFilter = function (filter, fieldMaskListInit) {
    if (fieldMaskListInit === void 0) { fieldMaskListInit = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    req = new TimeoffRequest_1.TimeoffRequest();
                    fieldMaskList = fieldMaskListInit;
                    for (fieldName in filter) {
                        _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                        //@ts-ignore
                        req[methodName](filter[fieldName]);
                        fieldMaskList.push(upperCaseProp);
                    }
                    req.setFieldMaskList(fieldMaskList);
                    return [4 /*yield*/, exports.TimeoffRequestClientService.BatchGet(req)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
exports.deleteTimeoffRequestById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new TimeoffRequest_1.TimeoffRequest();
                req.setId(id);
                return [4 /*yield*/, exports.TimeoffRequestClientService.Delete(req)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.upsertTimeoffRequest = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new TimeoffRequest_1.TimeoffRequest();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.TimeoffRequestClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.refreshToken = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, exports.UserClientService.GetToken('test', 'test')];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
exports.loadPerDiemsByEventId = function (eventId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, row;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setWithRows(true);
                req.setIsActive(true);
                req.setPageNumber(0);
                req.setWithoutLimit(true);
                row = new PerDiem_1.PerDiemRow();
                row.setServiceCallId(eventId);
                req.setRowsList([row]); // FIXME it doesn't work in api this way
                return [4 /*yield*/, exports.PerDiemClientService.BatchGet(req)];
            case 1: // FIXME it doesn't work in api this way
            return [2 /*return*/, (_a.sent()).toObject()];
        }
    });
}); };
exports.loadPerDiemByUserIdAndDateStarted = function (userId, dateStarted) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setUserId(userId);
                req.setWithRows(true);
                req.setIsActive(true);
                req.setPageNumber(0);
                req.setDateStarted(dateStarted + "%");
                return [4 /*yield*/, exports.PerDiemClientService.BatchGet(req)];
            case 1: return [2 /*return*/, (_a.sent()).toObject()];
        }
    });
}); };
exports.loadPerDiemByUserIdsAndDateStarted = function (userIds, dateStarted) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(uniq_1["default"](userIds).map(function (userId) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = {
                                    userId: userId
                                };
                                return [4 /*yield*/, exports.loadPerDiemByUserIdAndDateStarted(userId, dateStarted)];
                            case 1: return [2 /*return*/, (_a.data = (_b.sent())
                                    .resultsList,
                                    _a)];
                        }
                    });
                }); }))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.reduce(function (aggr, _a) {
                        var _b;
                        var userId = _a.userId, data = _a.data;
                        return (__assign(__assign({}, aggr), (_b = {}, _b[userId] = data, _b)));
                    }, {})];
        }
    });
}); };
exports.loadPerDiemByDepartmentIdsAndDateStarted = function (departmentIds, dateStarted) { return __awaiter(void 0, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(departmentIds.map(function (departmentId) { return __awaiter(void 0, void 0, void 0, function () {
                    var req;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                req = new PerDiem_1.PerDiem();
                                req.setDepartmentId(departmentId);
                                req.setWithRows(true);
                                req.setIsActive(true);
                                req.setPageNumber(0);
                                req.setDateStarted(dateStarted + "%");
                                return [4 /*yield*/, exports.PerDiemClientService.BatchGet(req)];
                            case 1: return [2 /*return*/, (_a.sent()).toObject().resultsList];
                        }
                    });
                }); }))];
            case 1:
                results = _a.sent();
                return [2 /*return*/, results
                        .reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, [])
                        .sort(function (a, b) {
                        if (exports.getDepartmentName(a.department) < exports.getDepartmentName(b.department))
                            return -1;
                        if (exports.getDepartmentName(a.department) > exports.getDepartmentName(b.department))
                            return 1;
                        return 0;
                    })];
        }
    });
}); };
exports.loadPerDiemsNeedsAuditing = function (page, needsAuditing, departmentId, userId, dateStarted) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setFieldMaskList(['NeedsAuditing', 'WithRows']);
                req.setWithRows(true);
                req.setPageNumber(page);
                req.setNeedsAuditing(needsAuditing);
                if (departmentId) {
                    req.setDepartmentId(departmentId);
                }
                if (userId) {
                    req.setUserId(userId);
                }
                if (dateStarted) {
                    req.setDateStarted(dateStarted + "%");
                }
                req.setIsActive(true);
                return [4 /*yield*/, exports.PerDiemClientService.BatchGet(req)];
            case 1: return [2 /*return*/, (_a.sent()).toObject()];
        }
    });
}); };
exports.loadPerDiemsReport = function (departmentIDs, userIDs, weeks) { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = {
                    departmentIDs: departmentIDs,
                    userIDs: userIDs,
                    weeks: weeks
                };
                return [4 /*yield*/, exports.PerDiemClientService.getPerDiemReportData(config)];
            case 1: return [2 /*return*/, (_a.sent()).toObject()];
        }
    });
}); };
exports.upsertPerDiem = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.PerDiemClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
// Converts a string of an address into a Place
exports.addressStringToPlace = function (addressString) {
    var pl = new Maps_1.Place();
    // Can detect the zip code by the fact it's all numbers in USA and always
    // comes after everything else
    // Can detect the road name because it's always followed by commas
    var split = addressString.split(',');
    var streetAddress = split[0];
    var city = split[1]; // Gotta check on this one, may include the state
    var state = '', zipCode = '';
    var zipAndState = split.length > 2 ? split[2] : null;
    for (var str in city.split(' ')) {
        // If this doesn't work, it probably is next to the zip code
        if (Object.values(StateCode).indexOf(String(str)) > -1 ||
            Object.keys(StateCode).indexOf(String(str)) > -1) {
            // This is a state
            console.log('Setting state as ' + str);
            state = str;
            city = city.replace(str, '');
            break;
        }
    }
    if (zipAndState) {
        zipAndState.split(' ').forEach(function (str) {
            if ((state == '' && Object.values(StateCode).indexOf(String(str)) > -1) ||
                Object.keys(StateCode).indexOf(String(str)) > -1) {
                // This is a state
                state = str;
                console.log('In further down loop setting state as :' + str);
            }
            if (!isNaN(Number(str))) {
                console.log('Setting zip code in zipAndState forEach as :' + str);
                zipCode = str;
            }
        });
    }
    var streetInfo = streetAddress.split(' ');
    var streetNumber = 0; // figuring this out in the loop
    if (!isNaN(Number(streetInfo[0]))) {
        streetNumber = Number(streetInfo[0]);
    }
    if (zipCode === '') {
        // still need to set this, so there must be only split[1]
        split[split.length - 1].split(' ').forEach(function (str) {
            if (!isNaN(Number(str))) {
                console.log('Setting zip code late as: ' + str);
                zipCode = str;
            }
        });
    }
    if (state === '') {
        // We really need to set this, see if anything in the last split has any states in it
        split[split.length - 1].split(' ').forEach(function (str) {
            if ((state == '' && Object.values(StateCode).indexOf(String(str)) > -1) ||
                Object.keys(StateCode).indexOf(String(str)) > -1) {
                // This is a state
                state = str;
                city = city.replace(str, '');
                city = zipCode != '' ? city.replace(zipCode, '') : city;
            }
        });
    }
    streetAddress = streetAddress.replace(String(streetNumber), '');
    console.log('THE ADDRESS: "' + streetAddress + '"');
    streetAddress = streetAddress.trimStart();
    streetAddress = streetAddress.trimEnd();
    console.log('AFTER TRIM: "' + streetAddress + '"');
    city = city.trimStart();
    city = city.trimEnd();
    state = state.trimStart();
    state = state.trimEnd();
    console.log('CITY IS PARSED AS: ' + city);
    console.log('STATE IS PARSED AS: ' + state);
    console.log('ZIP IS PARSED AS: ' + zipCode);
    pl.setStreetNumber(streetNumber);
    pl.setRoadName(streetAddress);
    pl.setCity(city);
    pl.setState(state);
    pl.setZipCode(zipCode);
    return pl;
};
var metersToMiles = function (meters) {
    var conversionFactor = 0.000621;
    return meters * conversionFactor;
};
exports.getTripDistance = function (origin, destination) { return __awaiter(void 0, void 0, void 0, function () {
    var matReq, placeOrigin, placeDestination, coordsOrigin, coordsDestination, tripDistance, status_1, distanceKm_1, distanceMeters_1, distanceMiles, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                matReq = new Maps_1.MatrixRequest();
                placeOrigin = exports.addressStringToPlace(origin), placeDestination = exports.addressStringToPlace(destination);
                return [4 /*yield*/, exports.MapClientService['Geocode'](placeOrigin)];
            case 1:
                coordsOrigin = _a.sent();
                return [4 /*yield*/, exports.MapClientService['Geocode'](placeDestination)];
            case 2:
                coordsDestination = _a.sent();
                matReq.addOrigins(coordsOrigin);
                matReq.setDestination(coordsDestination);
                return [4 /*yield*/, exports.MapClientService['DistanceMatrix'](matReq)];
            case 3:
                tripDistance = _a.sent();
                distanceMeters_1 = 0, distanceMiles = 0;
                tripDistance.getRowsList().forEach(function (row) {
                    console.log(row.toArray()[0][0]);
                    distanceKm_1 = row.toArray()[0][0][3][0];
                    distanceMeters_1 = row.toArray()[0][0][3][1];
                    status_1 = row.toArray()[0][0][0];
                });
                if (status_1 != 'OK') {
                    console.error("Status was not 'OK' on distanceMatrixRequest.");
                    console.error('Status was: ', status_1);
                }
                distanceMiles = metersToMiles(distanceMeters_1);
                console.log('Returning : ' + distanceMiles);
                return [2 /*return*/, distanceMiles];
            case 4:
                err_4 = _a.sent();
                console.error('An error occurred while calculating the trip distance: ' + err_4);
                console.log('Returning 0');
                return [2 /*return*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.upsertTrip = function (data, rowId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, destinationAddress, originAddress, fieldName, _a, upperCaseProp, methodName, _b, _c, err_5;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                req = new perdiem_pb_1.Trip();
                fieldMaskList = [];
                destinationAddress = '', originAddress = '';
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    if (methodName.startsWith('setSet')) {
                        methodName = methodName.replace('setS', 's');
                    }
                    else if (methodName.startsWith('setGet')) {
                        methodName = methodName.replace('setG', 'g');
                    }
                    if (methodName == 'setDestinationAddress') {
                        //@ts-ignore
                        destinationAddress = data[fieldName];
                    }
                    if (methodName == 'setOriginAddress') {
                        //@ts-ignore
                        originAddress = data[fieldName];
                    }
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                req.setPerDiemRowId(rowId);
                _c = (_b = req).setDistanceInMiles;
                return [4 /*yield*/, exports.getTripDistance(originAddress, destinationAddress)];
            case 1:
                _c.apply(_b, [_d.sent()]);
                _d.label = 2;
            case 2:
                _d.trys.push([2, 4, , 5]);
                return [4 /*yield*/, exports.PerDiemClientService[data.id != undefined ? 'UpdateTrip' : 'CreateTrip'](req)];
            case 3: return [2 /*return*/, _d.sent()];
            case 4:
                err_5 = _d.sent();
                console.error('Error occurred trying to save trip: ' + err_5);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updatePerDiemNeedsAudit = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setId(id);
                req.setNeedsAuditing(false);
                req.setFieldMaskList(['Id', 'NeedsAuditing']);
                return [4 /*yield*/, exports.PerDiemClientService.Update(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.submitPerDiemById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setId(id);
                req.setDateSubmitted(timestamp());
                fieldMaskList = ['DateSubmitted'];
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.PerDiemClientService.Update(req)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.approvePerDiemById = function (id, approvedById) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setId(id);
                req.setDateApproved(timestamp());
                req.setApprovedById(approvedById);
                fieldMaskList = ['DateApproved', 'ApprovedById'];
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.PerDiemClientService.Update(req)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deletePerDiemById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new PerDiem_1.PerDiem();
                req.setId(id);
                return [4 /*yield*/, exports.PerDiemClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.upsertPerDiemRow = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new PerDiem_1.PerDiemRow();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.PerDiemClientService[data.id ? 'UpdateRow' : 'CreateRow'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deletePerDiemRowById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.PerDiemClientService.DeleteRow(id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Returns an array of numbers from start to end inclusive
 * @param start
 * @param end
 */
function range(start, end) {
    var length = end - start;
    return Array.from({ length: length }, function (_, i) { return start + i; });
}
exports.range = range;
/**
 * Returns a key given its alias
 * @param keyName
 * @returns ApiKey.AsObject
 */
function getKeyByKeyName(keyName) {
    return __awaiter(this, void 0, void 0, function () {
        var client, req, ans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new ApiKey_1.ApiKeyClient(constants_1.ENDPOINT);
                    req = new ApiKey_1.ApiKey();
                    req.setApiKey(keyName);
                    return [4 /*yield*/, client.Get(req)];
                case 1:
                    ans = _a.sent();
                    return [2 /*return*/, ans];
            }
        });
    });
}
/**
 * Returns geo-coordinates for given address location
 * @param address
 * @returns { geolocationLat: number, geolocationLng: number }
 */
function loadGeoLocationByAddress(address) {
    return __awaiter(this, void 0, void 0, function () {
        var res, response, data, _a, lat, lng, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getKeyByKeyName('google_maps')];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + res)];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _b.sent();
                    console.log(data);
                    _a = data.results[0].geometry.location, lat = _a.lat, lng = _a.lng;
                    return [2 /*return*/, {
                            geolocationLat: +lat.toFixed(7),
                            geolocationLng: +lng.toFixed(7)
                        }];
                case 4:
                    e_3 = _b.sent();
                    console.error('Could not load geolocation by address. The error occurred:  ', e_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.loadGeoLocationByAddress = loadGeoLocationByAddress;
/**
 * Returns nicely formatted rounded number with 2 max fraction digits
 * if needed.
 */
function roundNumber(num) {
    return Math.round(num * 100) / 100;
}
exports.roundNumber = roundNumber;
/**
 * Returns options with weeks (starting Sunday) for the past year period
 */
function getWeekOptions(weeks, offsetWeeks, offsetDays) {
    if (weeks === void 0) { weeks = 52; }
    if (offsetWeeks === void 0) { offsetWeeks = 0; }
    if (offsetDays === void 0) { offsetDays = 0; }
    var d = new Date();
    return Array.from(Array(weeks)).map(function (_, week) {
        var w = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay() - (week + offsetWeeks) * 7 + offsetDays);
        return {
            label: "Week of " + constants_1.MONTHS[w.getMonth()] + " " + w.getDate() + ", " + w.getFullYear(),
            value: w.getFullYear() + "-" + trailingZero(w.getMonth() + 1) + "-" + trailingZero(w.getDate())
        };
    });
}
exports.getWeekOptions = getWeekOptions;
/**
 * Returns Users by filter
 * @param page number
 * @param filter UsersFilter
 * @param sort sort
 * @returns {results: User[], totalCount: number}
 */
exports.loadUsersByFilter = function (_a) {
    var page = _a.page, filter = _a.filter, sort = _a.sort, _b = _a.withProperties, withProperties = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var orderBy, orderDir, orderByField, req, fieldName, value, methodName, results, _c, resultsList, totalCount, batchesAmount, batchResults;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    orderBy = sort.orderBy, orderDir = sort.orderDir, orderByField = sort.orderByField;
                    req = new User_1.User();
                    req.setOrderBy(orderBy);
                    req.setOrderDir(orderDir);
                    req.setIsEmployee(0);
                    req.setIsActive(1);
                    req.setPageNumber(page === -1 ? 0 : page);
                    if (withProperties) {
                        req.setWithProperties(true);
                    }
                    for (fieldName in filter) {
                        value = filter[fieldName];
                        if (value) {
                            methodName = getRPCFields(fieldName).methodName;
                            //@ts-ignore
                            req[methodName](typeof value === 'number' ? value : "%" + value + "%");
                        }
                    }
                    results = [];
                    return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                case 1:
                    _c = (_d.sent()).toObject(), resultsList = _c.resultsList, totalCount = _c.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(page === -1 && totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.UserClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject().resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _d.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _d.label = 3;
                case 3: return [2 /*return*/, {
                        results: results.sort(function (a, b) {
                            var A = (a[orderByField] || '').toString().toLowerCase();
                            var B = (b[orderByField] || '').toString().toLowerCase();
                            if (A < B)
                                return orderDir === 'DESC' ? 1 : -1;
                            if (A > B)
                                return orderDir === 'DESC' ? -1 : 1;
                            return 0;
                        }),
                        totalCount: totalCount
                    }];
            }
        });
    });
};
exports.loadPerformanceMetricsByFilter = function (_a) {
    var page = _a.page, _b = _a.filter, dateStart = _b.dateStart, dateEnd = _b.dateEnd;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_c) {
            console.log({ page: page, dateStart: dateStart, dateEnd: dateEnd });
            return [2 /*return*/, {
                    results: [],
                    totalCount: 0
                }];
        });
    });
};
exports.loadDeletedServiceCallsByFilter = function (_a) {
    var page = _a.page, _b = _a.filter, dateStart = _b.dateStart, dateEnd = _b.dateEnd;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, results, _c, resultsList, totalCount, batchesAmount, batchResults;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    req = new Event_1.Event();
                    req.setPageNumber(page === -1 ? 0 : page);
                    req.setOrderBy('date_started');
                    req.setOrderDir('ASC');
                    req.setIsActive(0);
                    req.setDateRangeList(['>=', dateStart, '<=', dateEnd]);
                    req.setDateTargetList(['date_started', 'date_started']);
                    results = [];
                    return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                case 1:
                    _c = (_d.sent()).toObject(), resultsList = _c.resultsList, totalCount = _c.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(page === -1 && totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.min(constants_1.MAX_PAGES, Math.ceil((totalCount - resultsList.length) / resultsList.length));
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent())
                                            .getResultsList()
                                            .map(function (item) { return item.toObject(); })];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _d.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _d.label = 3;
                case 3: return [2 /*return*/, {
                        results: results,
                        totalCount: totalCount
                    }];
            }
        });
    });
};
exports.loadCallbackReportByFilter = function (_a) {
    var page = _a.page, _b = _a.filter, dateStart = _b.dateStart, dateEnd = _b.dateEnd;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_c) {
            console.log({ page: page, dateStart: dateStart, dateEnd: dateEnd });
            return [2 /*return*/, {
                    results: [],
                    totalCount: 0
                }];
        });
    });
};
exports.loadBillingAuditReport = function (startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month;
    return __generator(this, function (_b) {
        _a = startDate.split('-'), year = _a[0], month = _a[1];
        return [2 /*return*/, __spreadArrays(Array(160)).map(function () { return ({
                date: year + "-" + month + "-" + helpers_1.getRandomNumber(1, 31),
                name: helpers_1.getRandomName(),
                businessname: helpers_1.getRandomDigit() < 4
                    ? helpers_1.getRandomLastName() + " " + helpers_1.randomize(['Co.', 'and Son', 'SA'])
                    : '',
                jobNumber: helpers_1.getRandomDigits(8),
                payable: helpers_1.getRandomDigits(4),
                eventId: 86246,
                userId: 2573,
                propertyId: 6552,
                items: __spreadArrays(Array(helpers_1.getRandomNumber(1, 5))).map(function (_, id) {
                    var payable = helpers_1.getRandomDigits(4);
                    return {
                        id: id,
                        date: "2020-" + trailingZero(helpers_1.getRandomNumber(1, 12)) + "-" + trailingZero(helpers_1.getRandomNumber(1, 30)),
                        payable: payable,
                        payed: helpers_1.getRandomDigit() < 5 ? payable : 0
                    };
                })
            }); })];
    });
}); };
exports.loadCharityReport = function (month) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, {
                residentialServiceTotal: helpers_1.getRandomDigits(6),
                residentialAorTotal: helpers_1.getRandomDigits(6),
                items: __spreadArrays(Array(30)).map(function () { return ({
                    technician: helpers_1.getRandomName(),
                    contribution: helpers_1.getRandomDigits(5),
                    averageHourly: helpers_1.getRandomDigits(5) / 100
                }); })
            }];
    });
}); };
exports.loadTimeoffSummaryReport = function (year) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, __spreadArrays(Array(100)).map(function () { return ({
                employeeName: helpers_1.getRandomName(),
                hireDate: [
                    helpers_1.randomize([2015, 2016, 2017, 2018, 2019]),
                    trailingZero(+helpers_1.randomize([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])),
                    trailingZero(+helpers_1.randomize(__spreadArrays(Array(30)).map(function (_, idx) { return idx + 1; }))),
                ].join('-'),
                annualPtoAllowance: helpers_1.randomize([0, 40]),
                pto: helpers_1.randomize([0, 8, 24, 32, 64]),
                discretionary: helpers_1.randomize([0, 32, 40, 23, 14]),
                mandatory: 0
            }); })];
    });
}); };
exports.loadWarrantyReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, __spreadArrays(Array(130)).map(function () { return ({
                briefDdescription: helpers_1.randomize([
                    'Broken',
                    'Not working',
                    'Noisy',
                    'Loud',
                    'Unpredictable',
                ]),
                externalId: helpers_1.getRandomDigits(7),
                referenceNumber: helpers_1.getRandomDigits(6),
                statusDesc: helpers_1.randomize(['Active', 'Inactive', 'Pending', 'Completed']),
                priorityDesc: helpers_1.randomize(['Blocker', 'Urgent', 'Major', 'Minor']),
                techName: helpers_1.getRandomName()
            }); })];
    });
}); };
exports.loadServiceCallMetricsByFilter = function (_a) {
    var week = _a.filter.week;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            // FIXME
            return [2 /*return*/, {
                    serviceCallInformation: __spreadArrays(Array(5 + helpers_1.getRandomDigit())).map(function () { return ({
                        averageCustomerAnnualValue: helpers_1.getRandomAge(),
                        averageCustomerLifeTime: helpers_1.getRandomAge(),
                        phoneCalls: helpers_1.getRandomAge(),
                        serviceCalls: helpers_1.getRandomAge(),
                        serviceCallDate: week
                    }); }),
                    userInformation: __spreadArrays(Array(helpers_1.getRandomAge())).map(function () { return ({
                        activeCustomers: helpers_1.getRandomAge(),
                        contracts: helpers_1.getRandomAge(),
                        installationTypeCalls: helpers_1.getRandomAge(),
                        totalCustomers: helpers_1.getRandomAge(),
                        users: helpers_1.getRandomAge(),
                        serviceCallDate: week
                    }); })
                }];
        });
    });
};
exports.loadPromptPaymentData = function (month) { return __awaiter(void 0, void 0, void 0, function () {
    var req, date, startDate, endDate, dataList, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Report_1.PromptPaymentReportLine();
                date = month.replace('%', '01') + " 00:00:00";
                startDate = date_fns_1.format(date_fns_1.addDays(new Date(date), -1), 'yyyy-MM-dd');
                endDate = date_fns_1.format(date_fns_1.addMonths(new Date(date), 1), 'yyyy-MM-dd');
                req.setDateRangeList(['>', startDate, '<', endDate]);
                req.setDateTargetList(['log_billingDate', 'reportUntil']);
                return [4 /*yield*/, exports.ReportClientService.GetPromptPaymentData(req)];
            case 1:
                dataList = (_a.sent()).toObject().dataList;
                data = {};
                dataList.forEach(function (entry) {
                    var userId = entry.userId, userBusinessName = entry.userBusinessName, paymentTerms = entry.paymentTerms, daysToPay = entry.daysToPay, payable = entry.payable, payed = entry.payed, dueDate = entry.dueDate, paymentDate = entry.paymentDate, possibleAward = entry.possibleAward;
                    if (!data[userBusinessName]) {
                        data[userBusinessName] = {
                            customerId: userId,
                            customerName: userBusinessName,
                            payableAward: 0,
                            forfeitedAward: 0,
                            pendingAward: 0,
                            averageDaysToPay: 0,
                            daysToPay: paymentTerms,
                            paidInvoices: 0,
                            allInvoices: 0,
                            payableTotal: 0,
                            paidOnTime: 0,
                            possibleAwardTotal: 0,
                            entries: []
                        };
                    }
                    data[userBusinessName].entries.push(entry);
                    data[userBusinessName].averageDaysToPay += daysToPay;
                    data[userBusinessName].allInvoices += 1;
                    data[userBusinessName].payableTotal += payable;
                    data[userBusinessName].paidInvoices += payable >= payed ? 1 : 0;
                    data[userBusinessName].paidOnTime +=
                        payable >= payed && dueDate >= paymentDate ? 1 : 0;
                    data[userBusinessName].possibleAwardTotal += possibleAward;
                    // TODO calculate:
                    // payableAward
                    // forfeitedAward
                    // pendingAward
                });
                return [2 /*return*/, sortBy_1["default"](Object.values(data), function (_a) {
                        var customerName = _a.customerName;
                        return customerName.toLowerCase().trim();
                    }).map(function (_a) {
                        var averageDaysToPay = _a.averageDaysToPay, item = __rest(_a, ["averageDaysToPay"]);
                        return (__assign(__assign({}, item), { averageDaysToPay: item.paidInvoices === 0
                                ? 0
                                : Math.round(averageDaysToPay / item.paidInvoices) }));
                    })];
        }
    });
}); };
exports.loadSpiffReportByFilter = function (_a) {
    var date = _a.date, type = _a.type, users = _a.users;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, startDate, endDate, startDate, endDate, dataList, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    req = new Report_1.SpiffReportLine();
                    req.setIsActive(true);
                    req.setOrderBy('timestamp');
                    if (type === 'Monthly') {
                        startDate = date.replace('%', '01');
                        endDate = date_fns_1.format(date_fns_1.addMonths(new Date(startDate), 1), 'yyyy-MM-dd');
                        req.setDateRangeList(['>=', startDate, '<', endDate]);
                        req.setDateTargetList(['timestamp', 'timestamp']);
                    }
                    else {
                        startDate = date;
                        endDate = date_fns_1.format(date_fns_1.addDays(new Date(startDate), 7), 'yyyy-MM-dd');
                        req.setDateRangeList(['>=', startDate, '<', endDate]);
                        req.setDateTargetList(['timestamp', 'timestamp']);
                    }
                    return [4 /*yield*/, exports.ReportClientService.GetSpiffReportData(req)];
                case 1:
                    dataList = (_b.sent()).toObject().dataList;
                    data = {};
                    dataList.forEach(function (item) {
                        var employeeName = item.employeeName;
                        if (!data[employeeName]) {
                            data[employeeName] = {
                                spiffBonusTotal: 0,
                                items: []
                            };
                        }
                        data[employeeName].items.push(item);
                        data[employeeName].spiffBonusTotal += item.amount;
                    });
                    return [2 /*return*/, data];
            }
        });
    });
};
/**
 * Returns Activity Logs by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: ActivityLog[], totalCount: number}
 */
exports.loadActivityLogsByFilter = function (_a) {
    var page = _a.page, _b = _a.filter, activityDateStart = _b.activityDateStart, activityDateEnd = _b.activityDateEnd, activityName = _b.activityName, withUser = _b.withUser, sort = _a.sort;
    return __awaiter(void 0, void 0, void 0, function () {
        var orderBy, orderDir, orderByField, req, u, results, _c, resultsList, totalCount, batchesAmount, batchResults;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    orderBy = sort.orderBy, orderDir = sort.orderDir, orderByField = sort.orderByField;
                    req = new ActivityLog_1.ActivityLog();
                    u = new User_1.User();
                    req.setUser(u);
                    req.setOrderBy(orderBy);
                    req.setOrderDir(orderDir);
                    req.setPageNumber(page === -1 ? 0 : page);
                    if (activityDateStart && activityDateEnd) {
                        req.setDateRangeList(['>=', activityDateStart, '<=', activityDateEnd]);
                    }
                    if (activityName) {
                        req.setActivityName("%" + activityName + "%");
                    }
                    if (withUser) {
                        req.setWithUser(true);
                    }
                    results = [];
                    return [4 /*yield*/, exports.ActivityLogClientService.BatchGet(req)];
                case 1:
                    _c = (_d.sent()).toObject(), resultsList = _c.resultsList, totalCount = _c.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(page === -1 && totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.min(constants_1.MAX_PAGES, Math.ceil((totalCount - resultsList.length) / resultsList.length));
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.ActivityLogClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent())
                                            .getResultsList()
                                            .map(function (item) { return item.toObject(); })];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _d.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _d.label = 3;
                case 3: return [2 /*return*/, { results: results, totalCount: totalCount }];
            }
        });
    });
};
/**
 * Returns Properties by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: Property[], totalCount: number}
 */
exports.loadPropertiesByFilter = function (_a) {
    var page = _a.page, filter = _a.filter, sort = _a.sort;
    return __awaiter(void 0, void 0, void 0, function () {
        var orderBy, orderDir, orderByField, req, fieldName, value, methodName, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    orderBy = sort.orderBy, orderDir = sort.orderDir, orderByField = sort.orderByField;
                    req = new Property_1.Property();
                    req.setIsActive(1);
                    req.setPageNumber(page);
                    // req.setOrderBy(orderBy);
                    // req.setOrderDir(orderDir);
                    for (fieldName in filter) {
                        value = filter[fieldName];
                        if (value) {
                            methodName = getRPCFields(fieldName).methodName;
                            //@ts-ignore
                            req[methodName](typeof value === 'string' ? "%" + value + "%" : value);
                        }
                    }
                    return [4 /*yield*/, exports.PropertyClientService.BatchGet(req)];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, {
                            results: response
                                .getResultsList()
                                .map(function (item) { return item.toObject(); })
                                .sort(function (a, b) {
                                var A = (a[orderByField] || '').toString().toLowerCase();
                                var B = (b[orderByField] || '').toString().toLowerCase();
                                if (A < B)
                                    return orderDir === 'DESC' ? 1 : -1;
                                if (A > B)
                                    return orderDir === 'DESC' ? -1 : 1;
                                return 0;
                            }),
                            totalCount: response.getTotalCount()
                        }];
            }
        });
    });
};
/**
 * Returns Contracts by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: Property[], totalCount: number}
 */
exports.loadContractsByFilter = function (_a) {
    var page = _a.page, filter = _a.filter, sort = _a.sort;
    return __awaiter(void 0, void 0, void 0, function () {
        var orderBy, orderDir, orderByField, req, fieldName, value, methodName, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    orderBy = sort.orderBy, orderDir = sort.orderDir, orderByField = sort.orderByField;
                    req = new Contract_1.Contract();
                    req.setIsActive(1);
                    req.setPageNumber(page);
                    for (fieldName in filter) {
                        value = filter[fieldName];
                        if (value) {
                            methodName = getRPCFields(fieldName).methodName;
                            //@ts-ignore
                            req[methodName](typeof value === 'string' ? "%" + value + "%" : value);
                        }
                    }
                    return [4 /*yield*/, exports.ContractClientService.BatchGet(req)];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, {
                            results: response
                                .getResultsList()
                                .map(function (item) { return item.toObject(); })
                                .sort(function (a, b) {
                                var A = (a[orderByField] || '').toString().toLowerCase();
                                var B = (b[orderByField] || '').toString().toLowerCase();
                                if (A < B)
                                    return orderDir === 'DESC' ? 1 : -1;
                                if (A > B)
                                    return orderDir === 'DESC' ? -1 : 1;
                                return 0;
                            }),
                            totalCount: response.getTotalCount()
                        }];
            }
        });
    });
};
/**
 * Returns Events by filter
 * @param page number
 * @param filter EventsFilter
 * @param sort Sort
 * @returns {results: Event[], totalCount: number}
 */
exports.loadEventsByFilter = function (_a) {
    var page = _a.page, filter = _a.filter, sort = _a.sort, _b = _a.pendingBilling, pendingBilling = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var logJobNumber, dateStarted, dateStartedFrom, dateStartedTo, dateEnded, address, zip, logDateCompleted, city, firstname, lastname, businessname, jobTypeId, jobSubtypeId, logJobStatus, logPaymentStatus, departmentId, logTechnicianAssigned, logPo, orderBy, orderDir, orderByField, req, p, u, results, response, totalCount, resultsList, batchesAmount, batchResults;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logJobNumber = filter.logJobNumber, dateStarted = filter.dateStarted, dateStartedFrom = filter.dateStartedFrom, dateStartedTo = filter.dateStartedTo, dateEnded = filter.dateEnded, address = filter.address, zip = filter.zip, logDateCompleted = filter.logDateCompleted, city = filter.city, firstname = filter.firstname, lastname = filter.lastname, businessname = filter.businessname, jobTypeId = filter.jobTypeId, jobSubtypeId = filter.jobSubtypeId, logJobStatus = filter.logJobStatus, logPaymentStatus = filter.logPaymentStatus, departmentId = filter.departmentId, logTechnicianAssigned = filter.logTechnicianAssigned, logPo = filter.logPo;
                    orderBy = sort.orderBy, orderDir = sort.orderDir, orderByField = sort.orderByField;
                    req = new Event_1.Event();
                    p = new Property_1.Property();
                    u = new User_1.User();
                    if (orderByField === 'lastname') {
                        u.setOrderBy(orderBy);
                        u.setOrderDir(orderDir);
                    }
                    else if (orderByField === 'address') {
                        // FIXME - missing setOrderBy/setOrderDir in Property RPC
                        // p.setOrderBy(orderBy);
                        // p.setOrderDir(orderDir)
                    }
                    else {
                        req.setOrderBy(orderBy);
                        req.setOrderDir(orderDir);
                    }
                    req.setIsActive(1);
                    req.setPageNumber(page === -1 ? 0 : page);
                    p.setIsActive(1);
                    if (pendingBilling) {
                        req.setLogJobStatus('Completed');
                        req.setLogPaymentStatus('Pending');
                    }
                    if (logJobNumber) {
                        req.setLogJobNumber("%" + logJobNumber + "%");
                    }
                    if (jobTypeId) {
                        req.setJobTypeId(jobTypeId);
                    }
                    if (logPo) {
                        req.setLogPo(logPo);
                    }
                    if (jobSubtypeId) {
                        req.setJobSubtypeId(jobSubtypeId);
                    }
                    if (logJobStatus) {
                        req.setLogJobStatus(logJobStatus);
                    }
                    if (logPaymentStatus) {
                        req.setLogPaymentStatus(logPaymentStatus);
                    }
                    if (departmentId) {
                        req.setDepartmentId(departmentId);
                    }
                    if (logTechnicianAssigned) {
                        req.setLogTechnicianAssigned(logTechnicianAssigned);
                    }
                    if (dateStarted && dateEnded) {
                        req.setDateRangeList(['>=', dateStarted, '<=', dateEnded]);
                        req.setDateTargetList(['date_started', 'date_ended']);
                    }
                    else {
                        if (dateStarted) {
                            req.setDateStarted("%" + dateStarted + "%");
                        }
                        if (dateEnded) {
                            req.setDateEnded("%" + dateEnded + "%");
                        }
                    }
                    if (dateStartedFrom || dateStartedTo) {
                        if (dateStartedFrom && dateStartedTo) {
                            req.setDateRangeList(['>=', dateStartedFrom, '<=', dateStartedTo]);
                            req.setDateTargetList(['date_started', 'date_started']);
                        }
                        else if (dateStartedFrom) {
                            req.setDateRangeList(['>=', dateStartedFrom]);
                            req.setDateTargetList(['date_started']);
                        }
                        else if (dateStartedTo) {
                            req.setDateRangeList(['<=', dateStartedTo]);
                            req.setDateTargetList(['date_started']);
                        }
                    }
                    if (address) {
                        p.setAddress("%" + address + "%");
                    }
                    if (zip) {
                        p.setZip("%" + zip + "%");
                    }
                    if (logDateCompleted) {
                        req.setLogDateCompleted(logDateCompleted + "%");
                    }
                    if (city) {
                        p.setCity("%" + city + "%");
                    }
                    if (firstname) {
                        u.setFirstname("%" + firstname + "%");
                    }
                    if (lastname) {
                        u.setLastname("%" + lastname + "%");
                    }
                    if (businessname) {
                        u.setBusinessname("%" + businessname + "%");
                    }
                    req.setProperty(p);
                    req.setCustomer(u);
                    results = [];
                    return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                case 1:
                    response = _c.sent();
                    totalCount = response.getTotalCount();
                    resultsList = response.getResultsList().map(function (item) { return item.toObject(); });
                    results.push.apply(results, resultsList);
                    if (!(page === -1 && totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.min(constants_1.MAX_PAGES, Math.ceil((totalCount - resultsList.length) / resultsList.length));
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent())
                                            .getResultsList()
                                            .map(function (item) { return item.toObject(); })];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _c.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _c.label = 3;
                case 3: return [2 /*return*/, {
                        results: results,
                        totalCount: totalCount
                    }];
            }
        });
    });
};
/**
 * Returns Event by job number or contract number
 * @param referenceNumber job number or contract number
 * @returns Event?
 */
function loadEventByJobOrContractNumber(referenceNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var req, _a, resultsList, totalCount, _b, resultsList2, totalCount2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    req = new Event_1.Event();
                    req.setIsActive(1);
                    req.setLogJobNumber(referenceNumber + "%");
                    return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                case 1:
                    _a = (_c.sent()).toObject(), resultsList = _a.resultsList, totalCount = _a.totalCount;
                    if (totalCount > 0)
                        return [2 /*return*/, resultsList[0]];
                    req.setLogJobNumber('');
                    req.setContractNumber(referenceNumber);
                    return [4 /*yield*/, exports.EventClientService.BatchGet(req)];
                case 2:
                    _b = (_c.sent()).toObject(), resultsList2 = _b.resultsList, totalCount2 = _b.totalCount;
                    if (totalCount2 > 0)
                        return [2 /*return*/, resultsList2[0]];
                    return [2 /*return*/, undefined];
            }
        });
    });
}
exports.loadEventByJobOrContractNumber = loadEventByJobOrContractNumber;
/**
 * Returns Events by job number or contract numbers
 * @param referenceNumbers job number or contract number
 * @returns {[key: referenceNumber]: Event}
 */
function loadEventsByJobOrContractNumbers(referenceNumbers) {
    return __awaiter(this, void 0, void 0, function () {
        var refNumbers;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    refNumbers = uniq_1["default"](referenceNumbers.map(function (el) { return (el || '').trim(); }).filter(function (el) { return el !== ''; }));
                    return [4 /*yield*/, Promise.all(refNumbers.map(function (referenceNumber) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = {
                                            referenceNumber: referenceNumber
                                        };
                                        return [4 /*yield*/, loadEventByJobOrContractNumber(referenceNumber)];
                                    case 1: return [2 /*return*/, (_a.data = _b.sent(),
                                            _a)];
                                }
                            });
                        }); }))];
                case 1: return [2 /*return*/, (_a.sent()).reduce(function (aggr, _a) {
                        var _b;
                        var referenceNumber = _a.referenceNumber, data = _a.data;
                        return (__assign(__assign({}, aggr), (_b = {}, _b[referenceNumber] = data, _b)));
                    }, {})];
            }
        });
    });
}
exports.loadEventsByJobOrContractNumbers = loadEventsByJobOrContractNumbers;
/**
 * Returns escaped text with special characters, ie. &#x2f; -> /
 * @param encodedStr string
 * @returns string
 */
function escapeText(encodedStr) {
    var parser = new DOMParser();
    var dom = parser.parseFromString('<!doctype html><body>' + encodedStr, 'text/html');
    return dom.body.textContent || '';
}
exports.escapeText = escapeText;
/**
 * Upload file to S3 bucket
 * @param fileName string
 * @param fileData string (starting with ie. `data:image/png;base64,`)
 * @param bucketName string
 * @returns status string: "ok" | "nok"
 */
exports.uploadFileToS3Bucket = function (fileName, fileData, bucketName, tagString) { return __awaiter(void 0, void 0, void 0, function () {
    var urlObj, type, urlRes, uploadRes, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                urlObj = new S3File_1.URLObject();
                urlObj.setKey(fileName);
                urlObj.setBucket(bucketName);
                type = exports.getMimeType(fileName);
                urlObj.setContentType(type || '');
                if (tagString) {
                    urlObj.setTagString(tagString);
                }
                return [4 /*yield*/, exports.S3ClientService.GetUploadURL(urlObj)];
            case 1:
                urlRes = _a.sent();
                return [4 /*yield*/, fetch(urlRes.url, {
                        body: b64toBlob(fileData.split(';base64,')[1], fileName),
                        method: 'PUT',
                        headers: tagString
                            ? {
                                'x-amz-tagging': tagString
                            }
                            : {}
                    })];
            case 2:
                uploadRes = _a.sent();
                if (uploadRes.status === 200) {
                    return [2 /*return*/, 'ok'];
                }
                return [2 /*return*/, 'nok'];
            case 3:
                e_4 = _a.sent();
                return [2 /*return*/, 'nok'];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.moveFileBetweenS3Buckets = function (from, to, preserveSource) {
    if (preserveSource === void 0) { preserveSource = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var res, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, exports.S3ClientService.Move(from, to, preserveSource)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res ? 'ok' : 'nok'];
                case 2:
                    e_5 = _a.sent();
                    return [2 /*return*/, 'nok'];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.deleteFileFromS3Buckets = function (key, bucket) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new S3File_1.FileObject();
                req.setKey(key);
                req.setBucket(bucket);
                return [4 /*yield*/, exports.S3ClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.makeOptions = function (options, withAllOption) {
    if (withAllOption === void 0) { withAllOption = false; }
    return __spreadArrays((withAllOption ? [{ label: constants_1.OPTION_ALL, value: constants_1.OPTION_ALL }] : []), options.map(function (label) { return ({ label: label, value: label }); }));
};
exports.getDepartmentName = function (d) {
    return d ? d.value + " - " + d.description : '';
};
exports.getCustomerName = function (c, firstLastName) {
    if (firstLastName === void 0) { firstLastName = false; }
    return c
        ? (firstLastName
            ? c.lastname + ", " + c.firstname
            : c.firstname + " " + c.lastname).trim()
        : '';
};
exports.getBusinessName = function (c) {
    return c ? c.businessname.trim() : '';
};
exports.getCustomerPhone = function (c) {
    return c ? c.phone.trim() : '';
};
exports.getCustomerPhoneWithExt = function (c) {
    return c ? "" + c.phone.trim() + (c.ext ? ", " + c.ext : '') : '';
};
exports.getCustomerNameAndBusinessName = function (c) {
    var name = exports.getCustomerName(c);
    var businessname = exports.getBusinessName(c);
    return ("" + name + (businessname ? ' - ' : '') + businessname).trim();
};
exports.getPropertyAddress = function (p) {
    return p ? p.address + ", " + p.city + ", " + p.state + " " + p.zip : '';
};
exports.loadGroups = function () { return __awaiter(void 0, void 0, void 0, function () {
    var group, resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                group = new Group_1.Group();
                return [4 /*yield*/, exports.GroupClientService.BatchGet(group)];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList];
        }
    });
}); };
exports.loadUserGroupLinksByUserId = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var groupLink, resultsList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                groupLink = new UserGroupLink_1.UserGroupLink();
                groupLink.setUserId(userId);
                return [4 /*yield*/, exports.UserGroupLinkClientService.BatchGet(groupLink)];
            case 1:
                resultsList = (_a.sent()).toObject().resultsList;
                return [2 /*return*/, resultsList];
        }
    });
}); };
exports.saveProperty = function (data, userId, propertyId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new Property_1.Property();
                fieldMaskList = ['UserId'];
                req.setUserId(userId);
                if (propertyId) {
                    req.setId(propertyId);
                }
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.PropertyClientService[propertyId ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.saveUser = function (data, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new User_1.User();
                if (userId) {
                    req.setId(userId);
                }
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    // @ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.UserClientService[userId ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.upsertEvent = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, upperCaseProp, methodName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new Event_1.Event();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), upperCaseProp = _a.upperCaseProp, methodName = _a.methodName;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.EventClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteEventById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Event_1.Event();
                req.setId(id);
                return [4 /*yield*/, exports.EventClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new User_1.User();
                req.setId(id);
                return [4 /*yield*/, exports.UserClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deletePropertyById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new Property_1.Property();
                req.setId(id);
                return [4 /*yield*/, exports.PropertyClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getCurrDate = function () {
    return formatDate(new Date().toISOString()).replace(/\//g, '-');
};
exports.loadInternalDocuments = function (_a) {
    var page = _a.page, _b = _a.filter, tag = _b.tag, description = _b.description, _c = _a.sort, orderBy = _c.orderBy, orderDir = _c.orderDir;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, keys, dk;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    req = new InternalDocument_1.InternalDocument();
                    keys = Object.keys(req.toObject());
                    req.setOrderBy(orderBy);
                    if (!keys.includes(orderBy)) {
                        dk = new internal_document_pb_1.DocumentKey();
                        dk.setIsActive(true);
                        req.setTagData(dk);
                    }
                    req.setOrderDir(orderDir);
                    req.setPageNumber(page);
                    if (tag && tag > 0) {
                        req.setTag(tag);
                    }
                    if (description) {
                        req.setDescription("%" + description + "%");
                    }
                    return [4 /*yield*/, exports.InternalDocumentClientService.BatchGet(req)];
                case 1: return [2 /*return*/, (_d.sent()).toObject()];
            }
        });
    });
};
exports.upsertInternalDocument = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var id, req, fieldMaskList, fieldName, _a, methodName, upperCaseProp, reqFile, file;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = data.id;
                req = new InternalDocument_1.InternalDocument();
                fieldMaskList = [];
                req.setDateModified(timestamp());
                fieldMaskList.push('DateModified');
                for (fieldName in data) {
                    if (data[fieldName] === undefined)
                        continue;
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                reqFile = new File_1.File();
                reqFile.setBucket(constants_1.INTERNAL_DOCUMENTS_BUCKET);
                reqFile.setName(data.filename);
                if (data.fileId) {
                    reqFile.setId(data.fileId);
                }
                return [4 /*yield*/, exports.upsertFile(reqFile.toObject())];
            case 1:
                file = _b.sent();
                if (!id) {
                    req.setDateCreated(timestamp());
                    req.setFileId(file.id);
                    fieldMaskList.push('DateCreated', 'FileId');
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.InternalDocumentClientService[id ? 'Update' : 'Create'](req)];
            case 2: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteInternalDocumentById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new InternalDocument_1.InternalDocument();
                req.setId(id);
                return [4 /*yield*/, exports.InternalDocumentClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loadFiles = function (filter) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, methodName, upperCaseProp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new File_1.File();
                fieldMaskList = [];
                for (fieldName in filter) {
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](filter[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.FileClientService.BatchGet(req)];
            case 1: return [2 /*return*/, (_b.sent()).toObject()];
        }
    });
}); };
exports.upsertFile = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, methodName, upperCaseProp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new File_1.File();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.FileClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteFileById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new File_1.File();
                req.setId(id);
                return [4 /*yield*/, exports.FileClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.loadDocumentKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var req, dataList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new internal_document_pb_1.DocumentKey();
                req.setIsActive(true);
                return [4 /*yield*/, exports.InternalDocumentClientService.GetDocumentKeys(req)];
            case 1:
                dataList = (_a.sent()).toObject().dataList;
                return [2 /*return*/, dataList];
        }
    });
}); };
exports.saveDocumentKey = function (data, id) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, methodName, upperCaseProp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new internal_document_pb_1.DocumentKey();
                fieldMaskList = [];
                if (id) {
                    req.setId(id);
                }
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.InternalDocumentClientService.WriteDocumentKey(req)];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteDocumentKeyById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new internal_document_pb_1.DocumentKey();
                req.setId(id);
                return [4 /*yield*/, exports.InternalDocumentClientService.DeleteDocumentKey(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getFileS3BucketUrl = function (filename, bucket) { return __awaiter(void 0, void 0, void 0, function () {
    var url, dlURL;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = new S3File_1.URLObject();
                url.setKey(filename);
                url.setBucket(bucket);
                return [4 /*yield*/, exports.S3ClientService.GetDownloadURL(url)];
            case 1:
                dlURL = _a.sent();
                return [2 /*return*/, dlURL.url];
        }
    });
}); };
exports.openFile = function (filename, bucket) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getFileS3BucketUrl(filename, bucket)];
            case 1:
                url = _a.sent();
                window.open(url, '_blank');
                return [2 /*return*/];
        }
    });
}); };
var getComputedStyleCssText = function (element) {
    var style = window.getComputedStyle(element, null), cssText;
    if (style.cssText != '') {
        return style.cssText;
    }
    cssText = '';
    for (var i = 0; i < style.length; i++) {
        cssText += style[i] + ': ' + style.getPropertyValue(style[i]) + '; ';
    }
    return cssText;
};
exports.setInlineStyles = function (theElement) {
    var els = theElement.children;
    for (var i = 0, maxi = els.length; i < maxi; i++) {
        exports.setInlineStyles(els[i]);
        var defaultElem = document.createElement(els[i].nodeName);
        var child = document.body.appendChild(defaultElem);
        var defaultsStyles = window.getComputedStyle(defaultElem, null);
        var computed = getComputedStyleCssText(els[i]);
        for (var j = 0, maxj = defaultsStyles.length; j < maxj; j++) {
            var defaultStyle = defaultsStyles[j] +
                ': ' +
                defaultsStyles.getPropertyValue('' + defaultsStyles[j]) +
                ';';
            if (computed.startsWith(defaultStyle)) {
                computed = computed.substring(defaultStyle.length);
            }
            else {
                computed = computed.replace(' ' + defaultStyle, '');
            }
        }
        child.remove();
        els[i].setAttribute('style', computed);
    }
};
exports.makeLast12MonthsOptions = function (withAllOption, monthOffset) {
    if (monthOffset === void 0) { monthOffset = 0; }
    var today = new Date();
    var currMonth = today.getMonth() + 1 + monthOffset;
    return __spreadArrays((withAllOption ? [{ label: constants_1.OPTION_ALL, value: constants_1.OPTION_ALL }] : []), constants_1.MONTHS.slice(currMonth).map(function (month, idx) { return ({
        label: month + ", " + (today.getFullYear() - 1),
        value: today.getFullYear() - 1 + "-" + trailingZero(currMonth + idx + 1) + "-%"
    }); }), constants_1.MONTHS.slice(0, currMonth).map(function (month, idx) { return ({
        label: month + ", " + today.getFullYear(),
        value: today.getFullYear() + "-" + trailingZero(idx + 1) + "-%"
    }); })).reverse();
};
exports.makeMonthsOptions = function (withAllOption) {
    return __spreadArrays((withAllOption ? [{ label: constants_1.OPTION_ALL, value: '0' }] : []), constants_1.MONTHS.map(function (month, idx) { return ({
        label: month,
        value: trailingZero(idx + 1)
    }); }));
};
exports.getUploadedHTMLUrl = function (HTMLString, filename, bucketName) {
    if (bucketName === void 0) { bucketName = 'testbuckethelios'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var client, req, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new PDF_1.PDFClient(constants_1.ENDPOINT);
                    req = new PDF_1.HTML();
                    req.setData(HTMLString);
                    req.setKey(filename);
                    req.setBucket(bucketName);
                    return [4 /*yield*/, client.Create(req)];
                case 1:
                    url = _a.sent();
                    return [2 /*return*/, url];
            }
        });
    });
};
var loadGovPerDiemData = function (apiEndpoint, apiKey, zipCode, year, month) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, _a, meals, months, e_6;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                endpoint = "" + apiEndpoint.replace('{ZIP}', zipCode) + year + "?api_key=" + apiKey;
                return [4 /*yield*/, fetch(endpoint)];
            case 1: return [4 /*yield*/, (_d.sent()).json()];
            case 2:
                _a = (_d.sent()).rates[0].rate[0], meals = _a.meals, months = _a.months;
                return [2 /*return*/, (_b = {},
                        _b[zipCode] = { meals: constants_1.MEALS_RATE, lodging: months.month[month - 1].value },
                        _b)];
            case 3:
                e_6 = _d.sent();
                return [2 /*return*/, (_c = {}, _c[zipCode] = { meals: constants_1.MEALS_RATE, lodging: 0 }, _c)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loadGovPerDiemByZipCode = function (zipCode, year) { return __awaiter(void 0, void 0, void 0, function () {
    var client, req, _a, apiEndpoint, apiKey, endpoint, response, _b, _c, city, county, month, state;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                client = new ApiKey_1.ApiKeyClient(constants_1.ENDPOINT);
                req = new ApiKey_1.ApiKey();
                req.setTextId('per_diem_key');
                return [4 /*yield*/, client.Get(req)];
            case 1:
                _a = _d.sent(), apiEndpoint = _a.apiEndpoint, apiKey = _a.apiKey;
                endpoint = "" + apiEndpoint.replace('{ZIP}', zipCode.toString()) + year + "?api_key=" + apiKey;
                return [4 /*yield*/, fetch(endpoint)];
            case 2: return [4 /*yield*/, (_d.sent()).json()];
            case 3:
                response = _d.sent();
                if (response.rates.length === 0)
                    return [2 /*return*/, false];
                _b = response.rates[0], _c = _b.rate[0], city = _c.city, county = _c.county, month = _c.months.month, state = _b.state;
                return [2 /*return*/, { state: state, city: city, county: county, month: month }];
        }
    });
}); };
exports.loadPerDiemsLodging = function (perDiems) { return __awaiter(void 0, void 0, void 0, function () {
    var zipCodesByYearMonth, zipCodesArr, govPerDiems, govPerDiemsByYearMonth;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                zipCodesByYearMonth = {};
                perDiems.forEach(function (_a) {
                    var rowsList = _a.rowsList;
                    return rowsList
                        .filter(function (_a) {
                        var mealsOnly = _a.mealsOnly;
                        return !mealsOnly;
                    })
                        .forEach(function (_a) {
                        var dateString = _a.dateString, zipCode = _a.zipCode;
                        var _b = dateString.split('-'), y = _b[0], m = _b[1];
                        var year = +y;
                        var month = +m;
                        if (!zipCodesByYearMonth[year]) {
                            zipCodesByYearMonth[year] = {};
                        }
                        if (!zipCodesByYearMonth[year][month]) {
                            zipCodesByYearMonth[year][month] = [];
                        }
                        if (!zipCodesByYearMonth[year][month].includes(zipCode)) {
                            zipCodesByYearMonth[year][month].push(zipCode);
                        }
                    });
                });
                zipCodesArr = [];
                Object.keys(zipCodesByYearMonth).forEach(function (year) {
                    return Object.keys(zipCodesByYearMonth[+year]).forEach(function (month) {
                        zipCodesArr.push({
                            year: +year,
                            month: +month,
                            zipCodes: zipCodesByYearMonth[+year][+month]
                        });
                    });
                });
                return [4 /*yield*/, Promise.all(zipCodesArr.map(function (_a) {
                        var year = _a.year, month = _a.month, zipCodes = _a.zipCodes;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = {
                                            year: year,
                                            month: month
                                        };
                                        return [4 /*yield*/, exports.loadGovPerDiem(zipCodes, year, month)];
                                    case 1: return [2 /*return*/, (_b.data = _c.sent(),
                                            _b)];
                                }
                            });
                        });
                    }))];
            case 1:
                govPerDiems = _a.sent();
                govPerDiemsByYearMonth = {};
                govPerDiems.forEach(function (_a) {
                    var year = _a.year, month = _a.month, data = _a.data;
                    if (!govPerDiemsByYearMonth[year]) {
                        govPerDiemsByYearMonth[year] = {};
                    }
                    govPerDiemsByYearMonth[year][month] = data;
                });
                return [2 /*return*/, perDiems
                        .reduce(function (aggr, _a) {
                        var rowsList = _a.rowsList;
                        return __spreadArrays(aggr, rowsList);
                    }, [])
                        .filter(function (_a) {
                        var mealsOnly = _a.mealsOnly;
                        return !mealsOnly;
                    })
                        .reduce(function (aggr, _a) {
                        var _b;
                        var id = _a.id, dateString = _a.dateString, zipCode = _a.zipCode;
                        var _c = dateString.split('-'), y = _c[0], m = _c[1];
                        var year = +y;
                        var month = +m;
                        return __assign(__assign({}, aggr), (_b = {}, _b[id] = govPerDiemsByYearMonth[year][month][zipCode].lodging, _b));
                    }, {})];
        }
    });
}); };
exports.loadGovPerDiem = function (zipCodes, year, month) { return __awaiter(void 0, void 0, void 0, function () {
    var client, req, _a, apiEndpoint, apiKey, results;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                client = new ApiKey_1.ApiKeyClient(constants_1.ENDPOINT);
                req = new ApiKey_1.ApiKey();
                req.setTextId('per_diem_key');
                return [4 /*yield*/, client.Get(req)];
            case 1:
                _a = _b.sent(), apiEndpoint = _a.apiEndpoint, apiKey = _a.apiKey;
                return [4 /*yield*/, Promise.all(uniq_1["default"](zipCodes).map(function (zipCode) {
                        return loadGovPerDiemData(apiEndpoint, apiKey, zipCode, year, month);
                    }))];
            case 2:
                results = _b.sent();
                return [2 /*return*/, results.reduce(function (aggr, item) { return (__assign(__assign({}, aggr), item)); }, {})];
        }
    });
}); };
exports.loadTaskEventsByFilter = function (_a) {
    var id = _a.id, technicianUserId = _a.technicianUserId, _b = _a.withTechnicianNames, withTechnicianNames = _b === void 0 ? false : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var req, results, _c, resultsList, totalCount, batchesAmount, batchResults, technicianIds, technicianNames_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    req = new TaskEvent_1.TaskEvent();
                    req.setTaskId(id);
                    if (technicianUserId) {
                        req.setTechnicianUserId(technicianUserId);
                    }
                    req.setIsActive(true);
                    req.setPageNumber(0);
                    results = [];
                    return [4 /*yield*/, exports.TaskEventClientService.BatchGet(req)];
                case 1:
                    _c = (_d.sent()).toObject(), resultsList = _c.resultsList, totalCount = _c.totalCount;
                    results.push.apply(results, resultsList);
                    if (!(totalCount > resultsList.length)) return [3 /*break*/, 3];
                    batchesAmount = Math.ceil((totalCount - resultsList.length) / resultsList.length);
                    return [4 /*yield*/, Promise.all(Array.from(Array(batchesAmount)).map(function (_, idx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        req.setPageNumber(idx + 1);
                                        return [4 /*yield*/, exports.TaskEventClientService.BatchGet(req)];
                                    case 1: return [2 /*return*/, (_a.sent()).toObject()
                                            .resultsList];
                                }
                            });
                        }); }))];
                case 2:
                    batchResults = _d.sent();
                    results.push.apply(results, batchResults.reduce(function (aggr, item) { return __spreadArrays(aggr, item); }, []));
                    _d.label = 3;
                case 3:
                    if (!withTechnicianNames) return [3 /*break*/, 5];
                    technicianIds = uniq_1["default"](compact_1["default"](results.map(function (_a) {
                        var technicianUserId = _a.technicianUserId;
                        return technicianUserId;
                    })));
                    return [4 /*yield*/, loadUsersByIds(technicianIds)];
                case 4:
                    technicianNames_1 = _d.sent();
                    results.forEach(function (result) {
                        result.technicianName = technicianNames_1[result.technicianUserId]
                            ? exports.getCustomerName(technicianNames_1[result.technicianUserId])
                            : '';
                    });
                    _d.label = 5;
                case 5: return [2 /*return*/, results.sort(function (a, b) {
                        var A = a.timeStarted;
                        var B = b.timeStarted;
                        if (A < B)
                            return 1;
                        if (A > B)
                            return -1;
                        return 0;
                    })];
            }
        });
    });
};
exports.upsertTaskEvent = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var req, fieldMaskList, fieldName, _a, methodName, upperCaseProp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                req = new TaskEvent_1.TaskEvent();
                fieldMaskList = [];
                for (fieldName in data) {
                    _a = getRPCFields(fieldName), methodName = _a.methodName, upperCaseProp = _a.upperCaseProp;
                    //@ts-ignore
                    req[methodName](data[fieldName]);
                    fieldMaskList.push(upperCaseProp);
                }
                req.setFieldMaskList(fieldMaskList);
                return [4 /*yield*/, exports.TaskEventClientService[data.id ? 'Update' : 'Create'](req)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteTaskEvent = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                req = new TaskEvent_1.TaskEvent();
                req.setId(id);
                return [4 /*yield*/, exports.TaskEventClientService.Delete(req)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var BUG_REPORT_LABEL = 'user submitted bug report';
function newBugReport(data) {
    return __awaiter(this, void 0, void 0, function () {
        var client, req, key, authString, postData, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    client = new ApiKey_1.ApiKeyClient(constants_1.ENDPOINT);
                    req = new ApiKey_1.ApiKey();
                    req.setTextId('github_key');
                    return [4 /*yield*/, client.Get(req)];
                case 1:
                    key = _a.sent();
                    data.labels = [BUG_REPORT_LABEL];
                    authString = "token " + key.apiKey;
                    postData = {
                        method: 'POST',
                        headers: {
                            Authorization: authString,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    };
                    return [4 /*yield*/, fetch(key.apiEndpoint, postData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    console.log('error generating bug report', err_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.newBugReport = newBugReport;
function newBugReportImage(user, images) {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp_1, client, req, key, common, authString, result, _i, images_1, img, data, putData, e_7, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    timestamp_1 = new Date().getTime();
                    client = new ApiKey_1.ApiKeyClient(constants_1.ENDPOINT);
                    req = new ApiKey_1.ApiKey();
                    req.setTextId('github_file_key');
                    return [4 /*yield*/, client.Get(req)];
                case 1:
                    key = _a.sent();
                    common = {
                        message: 'bug report image',
                        committer: {
                            name: user.firstname + " " + user.lastname,
                            email: user.email
                        }
                    };
                    authString = "token " + key.apiKey;
                    result = [];
                    _i = 0, images_1 = images;
                    _a.label = 2;
                case 2:
                    if (!(_i < images_1.length)) return [3 /*break*/, 7];
                    img = images_1[_i];
                    data = __assign(__assign({}, common), { content: img.data });
                    putData = {
                        method: 'PUT',
                        headers: {
                            Authorization: authString,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    };
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fetch(key.apiEndpoint + "/images/" + timestamp_1 + "/" + img.label, putData)];
                case 4:
                    _a.sent();
                    result.push({
                        filename: img.label,
                        url: encodeURI("https://github.com/rmilejcz/kalos-frontend-issues/raw/master/images/" + timestamp_1 + "/" + img.label)
                    });
                    return [3 /*break*/, 6];
                case 5:
                    e_7 = _a.sent();
                    console.log('error uploading image', e_7);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, result];
                case 8:
                    err_7 = _a.sent();
                    console.log('error uploading image', err_7);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.newBugReportImage = newBugReportImage;
exports.CustomEventsHandler = (function () {
    var customEvents = {
        AddProperty: false,
        AddServiceCall: false,
        ShowDocuments: false,
        EditCustomer: false
    };
    return {
        listen: function (eventName, callback) {
            if (customEvents[eventName])
                return;
            customEvents[eventName] = true;
            window.addEventListener(eventName, callback);
        },
        emit: function (eventName) {
            return window.dispatchEvent(new CustomEvent(eventName));
        }
    };
})();
/**
 * Checks URL for http, and redirects to https appropriately
 */
function forceHTTPS() {
    if (window.location.hostname === 'localhost' ||
        window.location.hostname.startsWith('192.168.'))
        return;
    if (window.location.href.includes('http://')) {
        window.location.href = window.location.href.replace('http://', 'https://');
    }
}
exports.forceHTTPS = forceHTTPS;
/**
 * A redundant hardening feature that redirects non-employees from admin views
 * @param user
 */
function customerCheck(user) {
    if (window.location.href.includes('admin') && user.isEmployee === 0) {
        window.location.href =
            'https://app.kalosflorida.com/index.cfm?action=customer:account.dashboard';
    }
}
exports.customerCheck = customerCheck;
/**
 *
 * @param str A date string in the format YYYY-MM-DD
 */
function getDateArgs(str) {
    var splitTarget = str.includes('T') ? 'T' : ' ';
    var arr = str.split(splitTarget);
    var dateParts = arr[0].split('-');
    return [
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
    ];
}
exports.getDateArgs = getDateArgs;
/**
 *
 * @param str A date string in the format YYYY-MM-DD HH:MM:SS
 */
function getDateTimeArgs(str) {
    var splitTarget = str.includes('T') ? 'T' : ' ';
    var arr = str.split(splitTarget);
    var dateParts = arr[0].split('-');
    var timeParts = arr[1].split(':');
    return [
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2]),
    ];
}
exports.getDateTimeArgs = getDateTimeArgs;
