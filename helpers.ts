import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import { startOfWeek, format, addMonths, addDays } from 'date-fns';
import {
  S3Client,
  URLObject,
  FileObject,
  SUBJECT_TAGS,
} from '@kalos-core/kalos-rpc/S3File';
import { File, FileClient } from '@kalos-core/kalos-rpc/File';
import { ApiKeyClient, ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { UserClient, User, CardData } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { EventClient, Event, Quotable } from '@kalos-core/kalos-rpc/Event';
import { JobTypeClient, JobType } from '@kalos-core/kalos-rpc/JobType';
import {
  TimeoffRequest,
  TimeoffRequestClient,
  PTO,
} from '@kalos-core/kalos-rpc/TimeoffRequest';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { TaskEvent, TaskEventClient } from '@kalos-core/kalos-rpc/TaskEvent';
import {
  SpiffType,
  TaskClient,
  Task,
  TaskEventData,
  ProjectTask,
  TaskStatus,
  TaskPriority,
} from '@kalos-core/kalos-rpc/Task';
import {
  TaskAssignment,
  TaskAssignmentClient,
} from '@kalos-core/kalos-rpc/TaskAssignment';
import {
  ActivityLog,
  ActivityLogClient,
} from '@kalos-core/kalos-rpc/ActivityLog';
import {
  ReportClient,
  PromptPaymentReport,
  PromptPaymentReportLine,
  SpiffReportLine,
} from '@kalos-core/kalos-rpc/Report';
import {
  EmployeeFunctionClient,
  EmployeeFunction,
} from '@kalos-core/kalos-rpc/EmployeeFunction';
import { JobSubtypeClient, JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import {
  JobTypeSubtypeClient,
  JobTypeSubtype,
} from '@kalos-core/kalos-rpc/JobTypeSubtype';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  StoredQuoteClient,
  StoredQuote,
} from '@kalos-core/kalos-rpc/StoredQuote';
import { QuotePartClient, QuotePart } from '@kalos-core/kalos-rpc/QuotePart';
import {
  QuoteLinePartClient,
  QuoteLinePart,
} from '@kalos-core/kalos-rpc/QuoteLinePart';
import { QuoteLineClient, QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import {
  PerDiemClient,
  PerDiem,
  PerDiemRow,
  PerDiemReportConfig,
} from '@kalos-core/kalos-rpc/PerDiem';
import { MapClient, MatrixRequest, Place } from '@kalos-core/kalos-rpc/Maps';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Coordinates, MapClient as KalosMap } from '@kalos-core/kalos-rpc/Maps';
import {
  TimesheetDepartmentClient,
  TimesheetDepartment,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { MetricsClient } from '@kalos-core/kalos-rpc/Metrics';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionClient,
} from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { Group, GroupClient } from '@kalos-core/kalos-rpc/Group';
import {
  UserGroupLink,
  UserGroupLinkClient,
} from '@kalos-core/kalos-rpc/UserGroupLink';
import {
  TransactionDocumentClient,
  TransactionDocument,
} from '@kalos-core/kalos-rpc/TransactionDocument';
import {
  InternalDocument,
  InternalDocumentClient,
} from '@kalos-core/kalos-rpc/InternalDocument';
import { PDFClient, HTML } from '@kalos-core/kalos-rpc/PDF';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import { DocumentKey } from '@kalos-core/kalos-rpc/compiled-protos/internal_document_pb';
import {
  ENDPOINT,
  MONTHS,
  INTERNAL_DOCUMENTS_BUCKET,
  OPTION_ALL,
  MAX_PAGES,
  MEALS_RATE,
} from './constants';
import { Option } from './modules/ComponentsLibrary/Field';
import {
  getRandomAge,
  getRandomDigit,
  getRandomName,
  getRandomLastName,
  getRandomJobTitle,
  getRandomPhone,
  getRandomDigits,
  getRandomNumber,
  randomize,
} from './modules/ComponentsLibrary/helpers';
import { Contract, ContractClient } from '@kalos-core/kalos-rpc/Contract';
import { MapServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/kalosmaps_pb_service';

export type UserType = User.AsObject;
export type PropertyType = Property.AsObject;
export type ContractType = Contract.AsObject;
export type GroupType = Group.AsObject;
export type UserGroupLinkType = UserGroupLink.AsObject;
export type EventType = Event.AsObject;
export type JobTypeType = JobType.AsObject;
export type JobSubtypeType = JobSubtype.AsObject;
export type InternalDocumentType = InternalDocument.AsObject;
export type FileType = File.AsObject;
export type DocumentKeyType = DocumentKey.AsObject;
export type PerDiemType = PerDiem.AsObject;
export type TripType = Trip.AsObject;
export type PerDiemRowType = PerDiemRow.AsObject;
export type KalosMapType = Trip.AsObject;
export type TimesheetDepartmentType = TimesheetDepartment.AsObject;
export type EmployeeFunctionType = EmployeeFunction.AsObject;
export type ActivityLogType = ActivityLog.AsObject;
export type SpiffTypeType = SpiffType.AsObject;
export type SpiffReportLineType = SpiffReportLine.AsObject;
export type PromptPaymentReportLineType = PromptPaymentReportLine.AsObject;
export type TaskType = Task.AsObject;
export type SpiffToolAdminActionType = SpiffToolAdminAction.AsObject;
export type DocumentType = Document.AsObject;
export type TaskEventDataType = TaskEventData.AsObject;
export type QuotableType = Quotable.AsObject;
export type ProjectTaskType = ProjectTask.AsObject;
export type TaskStatusType = TaskStatus.AsObject;
export type TaskPriorityType = TaskPriority.AsObject;
export type TransactionType = Transaction.AsObject;
export type TaskEventType = TaskEvent.AsObject & { technicianName?: string };
export type TaskAssignmentType = TaskAssignment.AsObject;
export type CardDataType = CardData.AsObject;
export type TransactionDocumentType = TransactionDocument.AsObject;
export type TimeoffRequestType = TimeoffRequest.AsObject;
export type PTOType = PTO.AsObject;
export type SimpleFile = {
  key: string;
  bucket: string;
};
export type TimeoffRequestTypes = {
  [key: number]: string;
};

export const TransactionDocumentClientService = new TransactionDocumentClient(
  ENDPOINT,
);
export const TaskAssignmentClientService = new TaskAssignmentClient(ENDPOINT);
export const TaskEventClientService = new TaskEventClient(ENDPOINT);
export const TransactionClientService = new TransactionClient(ENDPOINT);
export const DocumentClientService = new DocumentClient(ENDPOINT);
export const ReportClientService = new ReportClient(ENDPOINT);
export const TaskClientService = new TaskClient(ENDPOINT);
export const PDFClientService = new PDFClient(ENDPOINT);
export const UserClientService = new UserClient(ENDPOINT);
export const PropertyClientService = new PropertyClient(ENDPOINT);
export const ContractClientService = new ContractClient(ENDPOINT);
export const EventClientService = new EventClient(ENDPOINT);
export const JobTypeClientService = new JobTypeClient(ENDPOINT);
export const JobSubtypeClientService = new JobSubtypeClient(ENDPOINT);
export const JobTypeSubtypeClientService = new JobTypeSubtypeClient(ENDPOINT);
export const ActivityLogClientService = new ActivityLogClient(ENDPOINT);
export const EmployeeFunctionClientService = new EmployeeFunctionClient(
  ENDPOINT,
);
export const PerDiemClientService = new PerDiemClient(ENDPOINT);
export const MapClientService = new MapClient(ENDPOINT);
export const ServicesRenderedClientService = new ServicesRenderedClient(
  ENDPOINT,
);
export const StoredQuoteClientService = new StoredQuoteClient(ENDPOINT);
export const QuotePartClientService = new QuotePartClient(ENDPOINT);
export const QuoteLinePartClientService = new QuoteLinePartClient(ENDPOINT);
export const QuoteLineClientService = new QuoteLineClient(ENDPOINT);
export const TimesheetDepartmentClientService = new TimesheetDepartmentClient(
  ENDPOINT,
);
export const MetricsClientService = new MetricsClient(ENDPOINT);
export const SpiffToolAdminActionClientService = new SpiffToolAdminActionClient(
  ENDPOINT,
);
export const GroupClientService = new GroupClient(ENDPOINT);
export const UserGroupLinkClientService = new UserGroupLinkClient(ENDPOINT);
export const InternalDocumentClientService = new InternalDocumentClient(
  ENDPOINT,
);
export const S3ClientService = new S3Client(ENDPOINT);
export const FileClientService = new FileClient(ENDPOINT);
export const TimeoffRequestClientService = new TimeoffRequestClient(ENDPOINT);

const StateCode = {
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
  wyoming: 'WY',
};

const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
const KALOS_BOT = getKeyByKeyName('kalos_bot');

export const getCFAppUrl = (action: string) => `${BASE_URL}?action=${action}`;

export type MetricType = 'Billable' | 'Callbacks' | 'Revenue';

function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
}

/**
 *
 * @param number
 * @returns string as number with trailing zero, if number is lett than 10
 */
function trailingZero(val: number) {
  return `${val < 10 ? 0 : ''}${val}`;
}

/**
 *
 * @param number
 * @returns string as usd amount, example 10.5 -> $10.50;
 */
export const usd = (val: number) => `$ ${val.toFixed(2)}`;

/**
 *
 * @param dateOnly if true, returns only the date portion YYYY-MM-DD
 * @returns a timestamp in the format YYYY-MM-DD HH:MM:SS
 */
function timestamp(dateOnly = false) {
  const dateObj = new Date();
  let month = `${dateObj.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }
  let day = `${dateObj.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }
  let hour = `${dateObj.getHours()}`;
  if (hour.length === 1) {
    hour = `0${hour}`;
  }
  let minute = `${dateObj.getMinutes()}`;
  if (minute.length === 1) {
    minute = `0${minute}`;
  }
  let second = `${dateObj.getSeconds()}`;
  if (second.length === 1) {
    second = `0${second}`;
  }

  if (dateOnly) {
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }
  return `${dateObj.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`;
}

async function slackNotify(id: string, text: string) {
  await fetch(
    `https://slack.com/api/chat.postMessage?token=${KALOS_BOT}&channel=${id}&text=${text}`,
    {
      method: 'POST',
    },
  );
}

async function getSlackList(skipCache = false): Promise<SlackUser[]> {
  try {
    if (!skipCache) {
      const listStr = localStorage.getItem('SLACK_USER_CACHE');
      if (listStr) {
        const cacheList = JSON.parse(listStr);
        if (cacheList) {
          return cacheList;
        }
      }
    }
    const res = await fetch(
      `https://slack.com/api/users.list?token=${KALOS_BOT}`,
    );
    const jsonRes = await res.json();
    try {
      const resString = JSON.stringify(jsonRes.members);
      localStorage.setItem('SLACK_USER_CACHE', resString);
    } catch (err) {
      console.log('failed to save slack list in local storage', err);
    }
    return jsonRes.members;
  } catch (err) {
    return getSlackList(true);
  }
}

async function getSlackID(
  userName: string,
  skipCache = false,
  count = 0,
): Promise<string> {
  if (count != 4) {
    try {
      let slackUsers = await getSlackList(skipCache);
      let user = slackUsers.find(s => {
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
      if (user) {
        return user.id;
      } else {
        count = count + 1;
        return await getSlackID(userName, true, count);
      }
    } catch (err) {
      count = count + 1;
      return await getSlackID(userName, true, count);
    }
  }
  return '0';
}

interface SlackUser {
  id: string;
  real_name: string;
  profile: {
    phone: string;
    real_name: string;
    real_name_normalized: string;
    email: string;
  };
}

function getEditDistance(strOne: string, strTwo: string): number {
  const strOneLen = strOne.length;
  const strTwoLen = strTwo.length;
  const prevRow = [];
  const strTwoChar = [];
  let nextCol = 0;
  let curCol = 0;

  if (strOneLen === 0) {
    return strTwoLen;
  }
  if (strTwoLen === 0) {
    return strOneLen;
  }
  for (let i = 0; i < strTwoLen; ++i) {
    prevRow[i] = i;
    strTwoChar[i] = strTwo.charCodeAt(i);
  }
  prevRow[strTwoLen] = strTwoLen;

  let strComparison: boolean;
  let tmp: number;
  let j: number;
  for (let i = 0; i < strOneLen; ++i) {
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

function getURLParams() {
  const params = new URLSearchParams(window.location.search);
  const res: { [key: string]: string } = {};
  params.forEach((val: string, key: string) => {
    res[key] = val;
  });
  return res;
}

export const upsertTransactionDocument = async (
  data: Partial<TransactionDocumentType>,
) => {
  const req = new TransactionDocument();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await TransactionDocumentClientService[data.id ? 'Update' : 'Create'](
    req,
  );
};

function b64toBlob(b64Data: string, fileName: string) {
  const sliceSize = 512;
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  const contentType = getMimeType(fileName);

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export const getFileExt = (fileName: string) => {
  const arr = fileName.toLowerCase().split('.');
  return arr[arr.length - 1];
};

export const getMimeType = (fileName: string) => {
  const ext = getFileExt(fileName);
  if (ext === 'pdf') {
    return 'application/pdf';
  } else if (ext === 'doc' || ext === 'docx') {
    return 'application/msword';
  } else if (ext === 'png') {
    return 'image/png';
  } else if (ext === 'jpg' || ext === 'jpeg') {
    return 'image/jpeg';
  }
};

/**
 *
 * @param time time in format HH:MM (ie. 16:30)
 * @returns format h:MMa (ie. 4:30AM)
 */
function formatTime(time: string, forceMinutes: boolean = true) {
  const str = time.includes(' ') ? time.substr(11) : time;
  const [hourStr, minutes] = str.split(':');
  const hour = +hourStr;
  const minute = +minutes;
  return (
    (hour > 12 ? hour - 12 : hour || 12) +
    (forceMinutes || minute ? `:${minutes}` : '') +
    (hour < 12 ? ' AM' : ' PM')
  );
}

/**
 *
 * @param date date in format YYYY-MM-DD (ie. 2020-06-01)
 * @returns format M/D/YYYY (ie. 6/1/2020)
 */
function formatDate(date: string) {
  if (!date) return '';
  const [year, month, day] = date.substr(0, 10).split('-');
  if (+month + +day + +year === 0) return '';
  return [+month, +day, +year].join('/');
}

/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format Day (ie. Tue)
 */
function formatDay(datetime: string) {
  return ({
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  } as { [key: number]: string })[new Date(datetime.substr(0, 10)).getDay()];
}

/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format M/D/YYYY h:MMa (ie. 6/1/2020 3:28PM)
 */
function formatDateTime(datetime: string) {
  return formatDate(datetime) + ' ' + formatTime(datetime.substr(11));
}

/**
 *
 * @param num number which needs a zero in front if it is less than 10
 * @returns string of the number with 0 in front if it is less than 10, otherwise just
 * the number
 */
function padWithZeroes(num: number): string {
  return num < 10 ? '0' + num : String(num);
}

/**
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format Day M/D/YYYY h:MMa (ie. Tue 6/1/2020 3:28PM)
 */
function formatDateTimeDay(datetime: string) {
  return (
    formatDay(datetime) +
    ', ' +
    formatDate(datetime) +
    ' ' +
    formatTime(datetime.substr(11))
  );
}

/**
 * Returns array of fake rows for InfoTable component
 * @param columns: number (default 1)
 * @param rows: number (default 3)
 * @returns fake rows with columns being { value: '' }
 */
function makeFakeRows(columns: number = 1, rows: number = 3) {
  return Array.from(Array(rows)).map(() =>
    Array.from(Array(columns)).map(() => ({ value: '' })),
  );
}

/**
 * Returns rpc fields
 * @param fieldName: field name, ie. jobNumber
 * @returns object { upperCaseProp: string, methodName: string }, ie. { upperCaseProp: 'JobNumber', methodName: 'setJobNumber'}
 */
function getRPCFields(fieldName: string) {
  const upperCaseProp = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}`;
  return {
    upperCaseProp,
    methodName: `set${upperCaseProp}`,
  };
}

/**
 * Returns loaded JobTypes
 * @returns JobType[]
 */
async function loadJobTypes() {
  const { resultsList } = (
    await JobTypeClientService.BatchGet(new JobType())
  ).toObject();
  return resultsList;
}

/**
 * Returns loaded JobSubtypes
 * @returns JobSubtype[]
 */
async function loadJobSubtypes() {
  const { resultsList } = (
    await JobSubtypeClientService.BatchGet(new JobSubtype())
  ).toObject();
  return resultsList;
}

export const getDepartmentByManagerID = async (userId: number) =>
  await TimesheetDepartmentClientService.getDepartmentByManagerID(userId);

/** Returns loaded TimesheetDepartments
 * @returns TimesheetDepartment[]
 */
async function loadTimesheetDepartments() {
  const results: TimesheetDepartmentType[] = [];
  const req = new TimesheetDepartment();
  req.setPageNumber(0);
  req.setIsActive(1);
  const { resultsList, totalCount } = (
    await TimesheetDepartmentClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await TimesheetDepartmentClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
}

/** Returns loaded Technicians
 * @returns User[]
 */
async function loadTechnicians() {
  const results: UserType[] = [];
  const req = new User();
  req.setPageNumber(0);
  req.setIsActive(1);
  req.setIsEmployee(1);
  const { resultsList, totalCount } = (
    await UserClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await UserClientService.BatchGet(req)).toObject().resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results.sort((a, b) => {
    const A = `${a.firstname} ${a.lastname}`.toLocaleLowerCase();
    const B = `${b.firstname} ${b.lastname}`.toLocaleLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

/** Returns loaded Users by department id
 * @param departmentId: number
 * @returns User[]
 */
async function loadUsersByDepartmentId(departmentId: number) {
  const results: UserType[] = [];
  const req = new User();
  req.setPageNumber(0);
  req.setIsActive(1);
  req.setEmployeeDepartmentId(departmentId);
  const { resultsList, totalCount } = (
    await UserClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await UserClientService.BatchGet(req)).toObject().resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results.sort((a, b) => {
    const A = `${a.firstname} ${a.lastname}`.toLocaleLowerCase();
    const B = `${b.firstname} ${b.lastname}`.toLocaleLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

export const upsertSpiffToolAdminAction = async (
  data: SpiffToolAdminActionType,
) => {
  const req = new SpiffToolAdminAction();
  const fieldMaskList = [];
  const isNew = !data.id;
  if (isNew) {
    req.setCreatedDate(timestamp());
    fieldMaskList.push('CreatedDate');
  } else {
    req.setId(data.id);
    fieldMaskList.push('Id');
  }
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    // @ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  await SpiffToolAdminActionClientService[isNew ? 'Create' : 'Update'](req);
};

export const deletetSpiffToolAdminAction = async (id: number) => {
  const req = new SpiffToolAdminAction();
  req.setId(id);
  await SpiffToolAdminActionClientService.Delete(req);
};

/** Returns loaded SpiffToolAdminActions by task id
 * @param taskId: number
 * @returns SpiffToolAdminAction[]
 */
async function loadSpiffToolAdminActionsByTaskId(taskId: number) {
  const results: SpiffToolAdminAction.AsObject[] = [];
  const req = new SpiffToolAdminAction();
  req.setPageNumber(0);
  req.setTaskId(taskId);
  const { resultsList, totalCount } = (
    await SpiffToolAdminActionClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (
          await SpiffToolAdminActionClientService.BatchGet(req)
        ).toObject().resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results.sort((a, b) => {
    const A = a.id;
    const B = b.id;
    if (A < B) return 1;
    if (A > B) return -1;
    return 0;
  });
}

/**
 * Returns loaded JobTypeSubtypes
 * @returns JobTypeSubtype[]
 */
async function loadJobTypeSubtypes() {
  const results: JobTypeSubtype.AsObject[] = [];
  const req = new JobTypeSubtype();
  req.setPageNumber(0);
  const { resultsList, totalCount } = (
    await JobTypeSubtypeClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await JobTypeSubtypeClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
}

export const loadSpiffTypes = async () => {
  const req = new SpiffType();
  req.setIsActive(true);
  const { resultsList } = (
    await TaskClientService.GetSpiffTypes(req)
  ).toObject();
  return resultsList
    .filter(item => !!item.ext)
    .sort((a, b) => {
      if (a.ext < b.ext) return -1;
      if (a.ext > b.ext) return 1;
      return 0;
    });
};

export const createTaskDocument = async (
  fileName: string,
  taskId: number,
  userId: number,
  description: string,
) => {
  const req = new Document();
  req.setFilename(fileName);
  req.setDateCreated(timestamp());
  req.setTaskId(taskId);
  req.setUserId(userId);
  req.setDescription(description);
  req.setType(5); // FIXME is 5 correct?
  await DocumentClientService.Create(req);
};

export const updateDocumentDescription = async (
  id: number,
  description: string,
) => {
  const req = new Document();
  req.setId(id);
  req.setDescription(description);
  req.setFieldMaskList(['Description']);
  await DocumentClientService.Update(req);
};

export const upsertTask = async (data: Partial<TaskType>) => {
  const req = new Task();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    // @ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  const { id } = await TaskClientService[data.id ? 'Update' : 'Create'](req);
  return id;
};

export const loadTaskAssignment = async (taskId: number) => {
  const req = new TaskAssignment();
  req.setIsActive(1);
  req.setTaskId(taskId);
  const results: TaskAssignmentType[] = [];
  const { resultsList, totalCount } = (
    await TaskAssignmentClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await TaskAssignmentClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
};

export const upsertTaskAssignments = async (
  taskId: number,
  technicianIds: number[],
) => {
  const req = new TaskAssignment();
  req.setTaskId(taskId);
  await TaskAssignmentClientService.Delete(req); // FIXME deleting by taskId doesn't work - resolve when task will return TaskAssignment[]
  await Promise.all(
    technicianIds.map(id => {
      const req = new TaskAssignment();
      req.setTaskId(taskId);
      req.setUserId(id);
      TaskAssignmentClientService.Create(req);
    }),
  );
};

export const updateSpiffTool = async (data: TaskType) => {
  const req = new Task();
  req.setId(data.id);
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    // @ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  await TaskClientService.Update(req);
};

export const deletetSpiffTool = async (id: number) => {
  const req = new Task();
  req.setId(id);
  await TaskClientService.Delete(req);
};

export const loadSpiffToolLogs = async ({
  page,
  type,
  technician,
  description,
  datePerformed,
  beginDate,
  endDate,
  jobNumber,
}: {
  page: number;
  type: 'Spiff' | 'Tool';
  technician?: number;
  description?: string;
  datePerformed?: string;
  beginDate?: string;
  endDate?: string;
  jobNumber?: string;
}) => {
  const req = new Task();
  req.setPageNumber(page);
  req.setIsActive(true);
  req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
  req.setOrderDir('ASC');
  if (technician) {
    req.setExternalId(technician);
  }
  req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
  if (description) {
    req.setBriefDescription(`%${description}%`);
  }
  if (datePerformed) {
    req.setDatePerformed(datePerformed);
  }
  if (beginDate && endDate) {
    req.setDateRangeList(['>=', beginDate, '<', endDate]);
    req.setDateTargetList(['date_performed', 'date_performed']);
  }
  if (jobNumber) {
    req.setSpiffJobNumber(`%${jobNumber}%`);
  }
  const res = await TaskClientService.BatchGet(req);
  const resultsList = res.getResultsList().map(el => el.toObject());
  const count = res.getTotalCount();
  return { resultsList, count };
};

export const loadTasks = async (filter: Partial<TaskType>) => {
  const req = new Task();
  req.setIsActive(true);
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof TaskType];
    if (value) {
      const { methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](typeof value === 'number' ? value : `%${value}%`);
    }
  }
  return (await TaskClientService.BatchGet(req)).toObject();
};

export const loadQuotable = async (id: number) => {
  const req = new Quotable();
  req.setEventId(id);
  req.setIsActive(true);
  req.setFieldMaskList(['IsActive']);
  const { dataList } = (await EventClientService.ReadQuotes(req)).toObject();
  return dataList;
};

/**
 * Returns loaded StoredQuotes
 * @returns StoredQuote[]
 */
async function loadStoredQuotes() {
  const results: StoredQuote.AsObject[] = [];
  const req = new StoredQuote();
  for (let page = 0; ; page += 1) {
    req.setPageNumber(page);
    const { resultsList, totalCount } = (
      await StoredQuoteClientService.BatchGet(req)
    ).toObject();
    results.push(...resultsList);
    if (results.length === totalCount) break;
  }
  return results.sort(({ description: a }, { description: b }) => {
    const A = a.toLocaleLowerCase().trim();
    const B = b.toLocaleLowerCase().trim();
    if (A > B) return 1;
    if (A < B) return -1;
    return 0;
  });
}

/**
 * Returns loaded ServicesRendered
 * @returns ServicesRendered[]
 */
async function loadServicesRendered(eventId: number) {
  const results: ServicesRendered.AsObject[] = [];
  const req = new ServicesRendered();
  req.setEventId(eventId);
  req.setIsActive(1);
  for (let page = 0; ; page += 1) {
    req.setPageNumber(page);
    const { resultsList, totalCount } = (
      await ServicesRenderedClientService.BatchGet(req)
    ).toObject();
    results.push(...resultsList);
    if (results.length === totalCount) break;
  }
  return results.sort(({ id: A }, { id: B }) => {
    if (A > B) return -1;
    if (A < B) return 1;
    return 0;
  });
}

/**
 * Returns loaded QuoteParts
 * @returns QuotePart[]
 */
async function loadQuoteParts() {
  const results: QuotePart.AsObject[] = [];
  const req = new QuotePart();
  req.setPageNumber(0);
  const { resultsList, totalCount } = (
    await QuotePartClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await QuotePartClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
}

/**
 * Returns loaded QuoteLineParts
 * @returns QuoteLinePart[]
 */
async function loadQuoteLineParts() {
  const results: QuoteLinePart.AsObject[] = [];
  const req = new QuoteLinePart();
  req.setPageNumber(0);
  const { resultsList, totalCount } = (
    await QuoteLinePartClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await QuoteLinePartClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
}

/**
 * Returns loaded QuoteLines
 * @returns QuoteLine[]
 */
async function loadQuoteLines() {
  const results: QuoteLine.AsObject[] = [];
  const req = new QuoteLine();
  req.setPageNumber(0);
  const { resultsList, totalCount } = (
    await QuoteLineClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await QuoteLineClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
}

export const loadCreditCard = async (account: string) => {
  const req = new CardData();
  req.setAccount(account);
  req.setWithUser(true);
  return await UserClientService.GetCardList(req);
};

export const loadEventById = async (serviceCallId: number) => {
  const req = new Event();
  req.setId(serviceCallId);
  return await EventClientService.Get(req);
};

export const loadProjectTasks = async (eventId: number) => {
  const { resultsList } = (
    await EventClientService.loadTasksByEventID(eventId)
  ).toObject();
  return resultsList.sort((a, b) => {
    const A = a.startDate;
    const B = b.startDate;
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
};

export const loadProjectTaskStatuses = async () => {
  const { resultsList } = (
    await TaskClientService.loadTaskStatuses()
  ).toObject();
  return resultsList;
};

export const loadProjectTaskPriorities = async () => {
  const { resultsList } = (
    await TaskClientService.loadTaskPriorityList()
  ).toObject();
  return resultsList;
};

export const loadProjectTaskBillableTypes = async () => {
  // const { resultsList } = (
  //   await TaskClientService.loadTaskBillableTypeList() // FIXME when available in rpc
  // ).toObject();
  return ['Flat Rate', 'Hourly', 'Parts Run', 'Spiff', 'Tool Purchase'];
};

export const deleteProjectTaskById = async (id: number) => {
  const req = new ProjectTask();
  req.setId(id);
  await TaskClientService.DeleteProjectTask(req);
};

export const upsertEventTask = async ({
  id,
  eventId,
  externalId,
  briefDescription,
  creatorUserId,
  statusId,
  startDate,
  endDate,
  priorityId,
}: Partial<ProjectTaskType>) => {
  const req = new ProjectTask();
  const fieldMaskList: string[] = ['ExternalCode', 'ExternalId', 'TimeCreated'];
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
  } else {
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
  await TaskClientService[id ? 'UpdateProjectTask' : 'CreateProjectTask'](req);
};

/**
 * Returns loaded Events by property id
 * @param propertyId: property id
 * @returns Event[]
 */
async function loadEventsByPropertyId(propertyId: number) {
  const results: EventType[] = [];
  const req = new Event();
  req.setIsActive(1);
  req.setPropertyId(propertyId);
  for (let page = 0; ; page += 1) {
    req.setPageNumber(page);
    const { resultsList, totalCount } = (
      await EventClientService.BatchGet(req)
    ).toObject();
    results.push(...resultsList);
    if (results.length === totalCount) break;
  }
  return results.sort((a, b) => {
    const A = a.logJobNumber.toLocaleLowerCase();
    const B = b.logJobNumber.toLocaleLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

/**
 * Returns loaded Property by its ids
 * @param id: property id
 * @returns Property
 */
async function loadPropertyById(id: number) {
  const req = new Property();
  req.setId(id);
  req.setIsActive(1);
  return await PropertyClientService.Get(req);
}

/**
 * Returns loaded User by its ids
 * @param id: user id
 * @returns User
 */
async function loadUserById(id: number, withProperties?: boolean) {
  try {
    const req = new User();
    req.setId(id);
    if (withProperties) {
      req.setWithProperties(true);
    }
    return await UserClientService.Get(req);
  } catch (err) {
    console.log('Failed to fetch user with id', id, err);
    const res = new User();
    res.setId(id);
    res.setIsActive(1);
    res.setIsEmployee(1);
    return res.toObject();
  }
}

/**
 * Returns loaded Users by their ids
 * @param ids: array of user id
 * @returns object { [userId]: User }
 */
async function loadUsersByIds(ids: number[]) {
  const uniqueIds: number[] = [];
  ids.forEach(id => {
    if (id > 0 && !uniqueIds.includes(id)) {
      uniqueIds.push(id);
    }
  });
  const users = await Promise.all(uniqueIds.map(id => loadUserById(id)));
  return users.reduce((aggr, user) => ({ ...aggr, [user.id]: user }), {}) as {
    [key: number]: UserType;
  };
}

/**
 * Returns loaded Metric by user id and metricType
 * @param userId: number
 * @param metricType: MetricType
 * @returns metric
 */
async function loadMetricByUserId(userId: number, metricType: MetricType) {
  try {
    //@ts-ignore
    return await MetricsClientService[`Get${metricType}`](userId);
  } catch (e) {
    return { id: userId, value: 0 };
  }
}

/**
 * Returns loaded Metric by user id
 * @param userId: number
 * @returns metric
 */
async function loadMetricByUserIds(userIds: number[], metricType: MetricType) {
  return await Promise.all(
    userIds.map(async userId => await loadMetricByUserId(userId, metricType)),
  );
}

export const loadEmployeeFunctions = async () => {
  const req = new EmployeeFunction();
  req.setIsdeleted(0);
  const { resultsList } = (
    await EmployeeFunctionClientService.BatchGet(req)
  ).toObject();
  return resultsList.sort((a, b) => {
    const A = a.name.toLowerCase();
    const B = b.name.toLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
};

export const upsertEmployeeFunction = async (
  data: EmployeeFunctionType,
  userId: number,
) => {
  const req = new EmployeeFunction();
  const fieldMaskList = ['Isdeleted'];
  req.setIsdeleted(0);
  if (data.id) {
    req.setModifydate(timestamp());
    req.setModifyuserid(userId);
    fieldMaskList.push('Modifydate', 'Modifyuserid');
  } else {
    req.setAddeddate(timestamp());
    req.setAddeduserid(userId);
    fieldMaskList.push('Addeddate', 'Addeduserid');
  }
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await EmployeeFunctionClientService[data.id ? 'Update' : 'Create'](
    req,
  );
};

export const deleteEmployeeFunctionById = async (id: number) => {
  const req = new EmployeeFunction();
  req.setId(id);
  await EmployeeFunctionClientService.Delete(req);
};

export const downloadCSV = (filename: string, csv: string) => {
  const link = document.createElement('a');
  link.setAttribute('download', `${filename}.csv`);
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csv),
  );
  link.click();
};

export const loadTransactionsByEventId = async (eventId: number) => {
  const results = [];
  const req = new Transaction();
  req.setJobId(eventId);
  req.setIsActive(1);
  req.setPageNumber(0);
  const { resultsList, totalCount } = (
    await TransactionClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await TransactionClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return results;
};

export const getPTOInquiryByUserId = async (userId: number) =>
  (await TimeoffRequestClientService.PTOInquiry(userId)).toObject();

export const getTimeoffRequestTypes = async () =>
  await (await TimeoffRequestClientService.GetTimeoffRequestTypes()).toObject()
    .dataList;

export const getTimeoffRequestById = async (id: number) => {
  const req = new TimeoffRequest();
  req.setId(id);
  req.setIsActive(1);
  try {
    return await TimeoffRequestClientService.Get(req);
  } catch (e) {
    return null;
  }
};

export const getTimeoffRequestByFilter = async (
  filter: Partial<TimeoffRequestType>,
  fieldMaskListInit: string[] = [],
) => {
  const req = new TimeoffRequest();
  const fieldMaskList = fieldMaskListInit;
  for (const fieldName in filter) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](filter[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await TimeoffRequestClientService.BatchGet(req);
};

export const deleteTimeoffRequestById = async (id: number) => {
  const req = new TimeoffRequest();
  req.setId(id);
  return await TimeoffRequestClientService.Delete(req);
};

export const upsertTimeoffRequest = async (
  data: Partial<TimeoffRequestType>,
) => {
  const req = new TimeoffRequest();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await TimeoffRequestClientService[data.id ? 'Update' : 'Create'](req);
};

export const refreshToken = async () =>
  await UserClientService.GetToken('test', 'test');

export const loadPerDiemsByEventId = async (eventId: number) => {
  const req = new PerDiem();
  req.setWithRows(true);
  req.setIsActive(true);
  req.setPageNumber(0);
  req.setWithoutLimit(true);
  const row = new PerDiemRow();
  row.setServiceCallId(eventId);
  req.setRowsList([row]); // FIXME it doesn't work in api this way
  return (await PerDiemClientService.BatchGet(req)).toObject();
};

export const loadPerDiemByUserIdAndDateStarted = async (
  userId: number,
  dateStarted: string,
) => {
  const req = new PerDiem();
  req.setUserId(userId);
  req.setWithRows(true);
  req.setIsActive(true);
  req.setPageNumber(0);
  req.setDateStarted(`${dateStarted}%`);
  return (await PerDiemClientService.BatchGet(req)).toObject();
};

export const loadPerDiemByUserIdsAndDateStarted = async (
  userIds: number[],
  dateStarted: string,
) => {
  const response = await Promise.all(
    uniq(userIds).map(async userId => ({
      userId,
      data: (await loadPerDiemByUserIdAndDateStarted(userId, dateStarted))
        .resultsList,
    })),
  );
  return response.reduce(
    (aggr, { userId, data }) => ({ ...aggr, [userId]: data }),
    {},
  );
};

export const loadPerDiemByDepartmentIdsAndDateStarted = async (
  departmentIds: number[],
  dateStarted: string,
) => {
  const results = await Promise.all(
    departmentIds.map(async departmentId => {
      const req = new PerDiem();
      req.setDepartmentId(departmentId);
      req.setWithRows(true);
      req.setIsActive(true);
      req.setPageNumber(0);
      req.setDateStarted(`${dateStarted}%`);
      return (await PerDiemClientService.BatchGet(req)).toObject().resultsList;
    }),
  );
  return results
    .reduce((aggr, item) => [...aggr, ...item], [])
    .sort((a, b) => {
      if (getDepartmentName(a.department) < getDepartmentName(b.department))
        return -1;
      if (getDepartmentName(a.department) > getDepartmentName(b.department))
        return 1;
      return 0;
    });
};

export const loadPerDiemsNeedsAuditing = async (
  page: number,
  needsAuditing: boolean,
  departmentId?: number,
  userId?: number,
  dateStarted?: string,
) => {
  const req = new PerDiem();
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
    req.setDateStarted(`${dateStarted}%`);
  }
  req.setIsActive(true);
  return (await PerDiemClientService.BatchGet(req)).toObject();
};

export const loadPerDiemsReport = async (
  departmentIDs: number[],
  userIDs: number[],
  weeks: string[],
) => {
  const config: PerDiemReportConfig = {
    departmentIDs,
    userIDs,
    weeks,
  };
  return (await PerDiemClientService.getPerDiemReportData(config)).toObject();
};

export const upsertPerDiem = async (data: PerDiemType) => {
  const req = new PerDiem();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await PerDiemClientService[data.id ? 'Update' : 'Create'](req);
};

// Converts a string of an address into a Place
export const addressStringToPlace = (addressString: string): Place => {
  let pl = new Place();
  // Can detect the zip code by the fact it's all numbers in USA and always
  // comes after everything else
  // Can detect the road name because it's always followed by commas
  const split = addressString.split(',');
  let streetAddress = split[0];
  let city = split[1]; // Gotta check on this one, may include the state
  let state = '',
    zipCode = '';
  let zipAndState = split.length > 2 ? split[2] : null;
  for (let str in city.split(' ')) {
    // If this doesn't work, it probably is next to the zip code
    if (
      Object.values(StateCode).indexOf(String(str)) > -1 ||
      Object.keys(StateCode).indexOf(String(str)) > -1
    ) {
      // This is a state
      console.log('Setting state as ' + str);
      state = str;
      city = city.replace(str, '');
      break;
    }
  }

  if (zipAndState) {
    zipAndState.split(' ').forEach(str => {
      if (
        (state == '' && Object.values(StateCode).indexOf(String(str)) > -1) ||
        Object.keys(StateCode).indexOf(String(str)) > -1
      ) {
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
  const streetInfo = streetAddress.split(' ');
  let streetNumber = 0; // figuring this out in the loop
  if (!isNaN(Number(streetInfo[0]))) {
    streetNumber = Number(streetInfo[0]);
  }

  if (zipCode === '') {
    // still need to set this, so there must be only split[1]
    split[split.length - 1].split(' ').forEach(str => {
      if (!isNaN(Number(str))) {
        console.log('Setting zip code late as: ' + str);
        zipCode = str;
      }
    });
  }

  if (state === '') {
    // We really need to set this, see if anything in the last split has any states in it
    split[split.length - 1].split(' ').forEach(str => {
      if (
        (state == '' && Object.values(StateCode).indexOf(String(str)) > -1) ||
        Object.keys(StateCode).indexOf(String(str)) > -1
      ) {
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

const metersToMiles = (meters: number): number => {
  const conversionFactor = 0.000621;
  return meters * conversionFactor;
};

export const getTripDistance = async (origin: string, destination: string) => {
  try {
    const matReq = new MatrixRequest();
    const placeOrigin = addressStringToPlace(origin),
      placeDestination = addressStringToPlace(destination);

    const coordsOrigin = await MapClientService['Geocode'](placeOrigin),
      coordsDestination = await MapClientService['Geocode'](placeDestination);
    matReq.addOrigins(coordsOrigin);
    matReq.setDestination(coordsDestination);
    const tripDistance = await MapClientService['DistanceMatrix'](matReq);
    let status,
      distanceKm,
      distanceMeters: number = 0,
      distanceMiles: number = 0;
    tripDistance.getRowsList().forEach(row => {
      console.log(row.toArray()[0][0]);
      distanceKm = row.toArray()[0][0][3][0];
      distanceMeters = row.toArray()[0][0][3][1];
      status = row.toArray()[0][0][0];
    });

    if (status != 'OK') {
      console.error("Status was not 'OK' on distanceMatrixRequest.");
      console.error('Status was: ', status);
    }

    distanceMiles = metersToMiles(distanceMeters);

    console.log('Returning : ' + distanceMiles);

    return distanceMiles;
  } catch (err: any) {
    console.error(
      'An error occurred while calculating the trip distance: ' + err,
    );
    console.log('Returning 0');
    return 0;
  }
};

export const upsertTrip = async (data: Trip.AsObject, rowId: number) => {
  const req = new Trip();
  const fieldMaskList = [];
  let destinationAddress = '',
    originAddress = '';
  for (const fieldName in data) {
    let { upperCaseProp, methodName } = getRPCFields(fieldName);

    if (methodName.startsWith('setSet')) {
      methodName = methodName.replace('setS', 's');
    } else if (methodName.startsWith('setGet')) {
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
  req.setDistanceInMiles(
    await getTripDistance(originAddress, destinationAddress),
  );

  try {
    return await PerDiemClientService[
      data.id != undefined ? 'UpdateTrip' : 'CreateTrip'
    ](req);
  } catch (err: any) {
    console.error('Error occurred trying to save trip: ' + err);
  }
};

export const updatePerDiemNeedsAudit = async (id: number) => {
  const req = new PerDiem();
  req.setId(id);
  req.setNeedsAuditing(false);
  req.setFieldMaskList(['Id', 'NeedsAuditing']);
  await PerDiemClientService.Update(req);
};

export const submitPerDiemById = async (id: number) => {
  const req = new PerDiem();
  req.setId(id);
  req.setDateSubmitted(timestamp());
  const fieldMaskList = ['DateSubmitted'];
  req.setFieldMaskList(fieldMaskList);
  return await PerDiemClientService.Update(req);
};

export const approvePerDiemById = async (id: number, approvedById: number) => {
  const req = new PerDiem();
  req.setId(id);
  req.setDateApproved(timestamp());
  req.setApprovedById(approvedById);
  const fieldMaskList = ['DateApproved', 'ApprovedById'];
  req.setFieldMaskList(fieldMaskList);
  return await PerDiemClientService.Update(req);
};

export const deletePerDiemById = async (id: number) => {
  const req = new PerDiem();
  req.setId(id);
  await PerDiemClientService.Delete(req);
};

export const upsertPerDiemRow = async (data: PerDiemRowType) => {
  const req = new PerDiemRow();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await PerDiemClientService[data.id ? 'UpdateRow' : 'CreateRow'](req);
};

export const deletePerDiemRowById = async (id: number) => {
  await PerDiemClientService.DeleteRow(id);
};

/**
 * Returns an array of numbers from start to end inclusive
 * @param start
 * @param end
 */
function range(start: number, end: number) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}

/**
 * Returns a key given its alias
 * @param keyName
 * @returns ApiKey.AsObject
 */
async function getKeyByKeyName(keyName: string) {
  const client = new ApiKeyClient(ENDPOINT);
  const req = new ApiKey();
  req.setApiKey(keyName);
  const ans = await client.Get(req);
  return ans;
}

/**
 * Returns geo-coordinates for given address location
 * @param address
 * @returns { geolocationLat: number, geolocationLng: number }
 */
async function loadGeoLocationByAddress(address: string) {
  try {
    console.log('Just trying something out');
    const res = await getKeyByKeyName('google_maps');
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${res}`,
    );
    const data = await response.json();
    console.log(data);
    const {
      results: [
        {
          geometry: {
            location: { lat, lng },
          },
        },
      ],
    } = data;
    return {
      geolocationLat: +lat.toFixed(7),
      geolocationLng: +lng.toFixed(7),
    };
  } catch (e) {
    console.error(
      'Could not load geolocation by address. This error occurred:  ',
      e,
    );
  }
}

/**
 * Returns nicely formatted rounded number with 2 max fraction digits
 * if needed.
 */

function roundNumber(num: number) {
  return Math.round(num * 100) / 100;
}

/**
 * Returns options with weeks (starting Sunday) for the past year period
 */
function getWeekOptions(weeks = 52, offsetWeeks = 0, offsetDays = 0): Option[] {
  const d = new Date();
  return Array.from(Array(weeks)).map((_, week) => {
    const w = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate() - d.getDay() - (week + offsetWeeks) * 7 + offsetDays,
    );
    return {
      label: `Week of ${
        MONTHS[w.getMonth()]
      } ${w.getDate()}, ${w.getFullYear()}`,
      value: `${w.getFullYear()}-${trailingZero(
        w.getMonth() + 1,
      )}-${trailingZero(w.getDate())}`,
    };
  });
}

export type OrderDir = 'ASC' | 'DESC';
export type UsersSort = {
  orderByField: keyof UserType;
  orderBy: string;
  orderDir: OrderDir;
};
export type LoadUsersByFilter = {
  page: number;
  filter: UsersFilter;
  sort: UsersSort;
  withProperties?: boolean;
};
export type UsersFilter = {
  firstname?: string;
  lastname?: string;
  businessname?: string;
  phone?: string;
  email?: string;
  isEmployee?: number;
  empTitle?: string;
  employeeDepartmentId?: number;
  ext?: string;
  cellphone?: string;
};

/**
 * Returns Users by filter
 * @param page number
 * @param filter UsersFilter
 * @param sort sort
 * @returns {results: User[], totalCount: number}
 */
export const loadUsersByFilter = async ({
  page,
  filter,
  sort,
  withProperties = false,
}: LoadUsersByFilter) => {
  const { orderBy, orderDir, orderByField } = sort;
  const req = new User();
  req.setOrderBy(orderBy);
  req.setOrderDir(orderDir);
  req.setIsEmployee(0);
  req.setIsActive(1);
  req.setPageNumber(page === -1 ? 0 : page);
  if (withProperties) {
    req.setWithProperties(true);
  }
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof UsersFilter];
    if (value) {
      const { methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](typeof value === 'number' ? value : `%${value}%`);
    }
  }
  const results = [];
  const { resultsList, totalCount } = (
    await UserClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (page === -1 && totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await UserClientService.BatchGet(req)).toObject().resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return {
    results: results.sort((a, b) => {
      const A = (a[orderByField] || '').toString().toLowerCase();
      const B = (b[orderByField] || '').toString().toLowerCase();
      if (A < B) return orderDir === 'DESC' ? 1 : -1;
      if (A > B) return orderDir === 'DESC' ? -1 : 1;
      return 0;
    }),
    totalCount,
  };
};

export type DateStartEndFilter = {
  dateStart: string;
  dateEnd: string;
};

export type LoadMetricsByFilter = {
  page: number;
  filter: DateStartEndFilter;
};

export const loadPerformanceMetricsByFilter = async ({
  page,
  filter: { dateStart, dateEnd },
}: LoadMetricsByFilter) => {
  console.log({ page, dateStart, dateEnd });
  return {
    results: [],
    totalCount: 0,
  };
};

export const loadDeletedServiceCallsByFilter = async ({
  page,
  filter: { dateStart, dateEnd },
}: LoadMetricsByFilter) => {
  const req = new Event();
  req.setPageNumber(page === -1 ? 0 : page);
  req.setOrderBy('date_started');
  req.setOrderDir('ASC');
  req.setIsActive(0);
  req.setDateRangeList(['>=', dateStart, '<=', dateEnd]);
  req.setDateTargetList(['date_started', 'date_started']);
  const results: EventType[] = [];
  const { resultsList, totalCount } = (
    await EventClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (page === -1 && totalCount > resultsList.length) {
    const batchesAmount = Math.min(
      MAX_PAGES,
      Math.ceil((totalCount - resultsList.length) / resultsList.length),
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await EventClientService.BatchGet(req))
          .getResultsList()
          .map(item => item.toObject());
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return {
    results,
    totalCount,
  };
};

export const loadCallbackReportByFilter = async ({
  page,
  filter: { dateStart, dateEnd },
}: LoadMetricsByFilter) => {
  console.log({ page, dateStart, dateEnd });
  return {
    results: [],
    totalCount: 0,
  };
};

export type BillingAuditType = {
  date: string;
  name: string;
  businessname: string;
  jobNumber: number;
  payable: number;
  eventId: number;
  userId: number;
  propertyId: number;
  items: {
    id: number;
    date: string;
    payable: number;
    payed: number;
  }[];
};

export const loadBillingAuditReport = async (
  startDate: string,
  endDate: string,
) => {
  const [year, month] = startDate.split('-');
  return [...Array(160)].map(() => ({
    date: `${year}-${month}-${getRandomNumber(1, 31)}`,
    name: getRandomName(),
    businessname:
      getRandomDigit() < 4
        ? `${getRandomLastName()} ${randomize(['Co.', 'and Son', 'SA'])}`
        : '',
    jobNumber: getRandomDigits(8),
    payable: getRandomDigits(4),
    eventId: 86246,
    userId: 2573,
    propertyId: 6552,
    items: [...Array(getRandomNumber(1, 5))].map((_, id) => {
      const payable = getRandomDigits(4);
      return {
        id,
        date: `2020-${trailingZero(getRandomNumber(1, 12))}-${trailingZero(
          getRandomNumber(1, 30),
        )}`,
        payable,
        payed: getRandomDigit() < 5 ? payable : 0,
      };
    }),
  }));
};

export const loadCharityReport = async (month: string) => {
  return {
    residentialServiceTotal: getRandomDigits(6),
    residentialAorTotal: getRandomDigits(6),
    items: [...Array(30)].map(() => ({
      technician: getRandomName(),
      contribution: getRandomDigits(5),
      averageHourly: getRandomDigits(5) / 100,
    })),
  };
};

export const loadTimeoffSummaryReport = async (year: number) => {
  return [...Array(100)].map(() => ({
    employeeName: getRandomName(),
    hireDate: [
      randomize([2015, 2016, 2017, 2018, 2019]),
      trailingZero(+randomize([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])),
      trailingZero(+randomize([...Array(30)].map((_, idx) => idx + 1))),
    ].join('-'),
    annualPtoAllowance: randomize([0, 40]),
    pto: randomize([0, 8, 24, 32, 64]),
    discretionary: randomize([0, 32, 40, 23, 14]),
    mandatory: 0,
  }));
};

export const loadWarrantyReport = async () => {
  return [...Array(130)].map(() => ({
    briefDdescription: randomize([
      'Broken',
      'Not working',
      'Noisy',
      'Loud',
      'Unpredictable',
    ]),
    externalId: getRandomDigits(7),
    referenceNumber: getRandomDigits(6),
    statusDesc: randomize(['Active', 'Inactive', 'Pending', 'Completed']),
    priorityDesc: randomize(['Blocker', 'Urgent', 'Major', 'Minor']),
    techName: getRandomName(),
  }));
};

export type LoadMetricsByWeekFilter = {
  filter: {
    week: string;
  };
};

export const loadServiceCallMetricsByFilter = async ({
  filter: { week },
}: LoadMetricsByWeekFilter) => {
  // FIXME
  return {
    serviceCallInformation: [...Array(5 + getRandomDigit())].map(() => ({
      averageCustomerAnnualValue: getRandomAge(),
      averageCustomerLifeTime: getRandomAge(),
      phoneCalls: getRandomAge(),
      serviceCalls: getRandomAge(),
      serviceCallDate: week,
    })),
    userInformation: [...Array(getRandomAge())].map(() => ({
      activeCustomers: getRandomAge(),
      contracts: getRandomAge(),
      installationTypeCalls: getRandomAge(),
      totalCustomers: getRandomAge(),
      users: getRandomAge(),
      serviceCallDate: week,
    })),
  };
};

export type PromptPaymentData = {
  customerId: number;
  customerName: string;
  payableAward: number;
  forfeitedAward: number;
  pendingAward: number;
  averageDaysToPay: number;
  daysToPay: number;
  paidInvoices: number;
  allInvoices: number;
  payableTotal: number;
  paidOnTime: number;
  possibleAwardTotal: number;
  entries: PromptPaymentReportLineType[];
};

export const loadPromptPaymentData = async (month: string) => {
  const req = new PromptPaymentReportLine();
  const date = `${month.replace('%', '01')} 00:00:00`;
  const startDate = format(addDays(new Date(date), -1), 'yyyy-MM-dd');
  const endDate = format(addMonths(new Date(date), 1), 'yyyy-MM-dd');
  req.setDateRangeList(['>', startDate, '<', endDate]);
  req.setDateTargetList(['log_billingDate', 'reportUntil']);
  const { dataList } = (
    await ReportClientService.GetPromptPaymentData(req)
  ).toObject();
  const data: {
    [key: string]: PromptPaymentData;
  } = {};
  dataList.forEach(entry => {
    const {
      userId,
      userBusinessName,
      paymentTerms,
      daysToPay,
      payable,
      payed,
      dueDate,
      paymentDate,
      possibleAward,
    } = entry;
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
        entries: [],
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

  return sortBy(Object.values(data), ({ customerName }) =>
    customerName.toLowerCase().trim(),
  ).map(({ averageDaysToPay, ...item }) => ({
    ...item,
    averageDaysToPay:
      item.paidInvoices === 0
        ? 0
        : Math.round(averageDaysToPay / item.paidInvoices),
  }));
};

export type LoadSpiffReportByFilter = {
  date: string;
  type: string;
  users: number[];
};
export const loadSpiffReportByFilter = async ({
  date,
  type,
  users,
}: LoadSpiffReportByFilter) => {
  const req = new SpiffReportLine();
  req.setIsActive(true);
  req.setOrderBy('timestamp');
  if (type === 'Monthly') {
    const startDate = date.replace('%', '01');
    const endDate = format(addMonths(new Date(startDate), 1), 'yyyy-MM-dd');
    req.setDateRangeList(['>=', startDate, '<', endDate]);
    req.setDateTargetList(['timestamp', 'timestamp']);
  } else {
    const startDate = date;
    const endDate = format(addDays(new Date(startDate), 7), 'yyyy-MM-dd');
    req.setDateRangeList(['>=', startDate, '<', endDate]);
    req.setDateTargetList(['timestamp', 'timestamp']);
  }
  const { dataList } = (
    await ReportClientService.GetSpiffReportData(req)
  ).toObject();
  const data: {
    [key: string]: {
      spiffBonusTotal: number;
      items: SpiffReportLineType[];
    };
  } = {};
  dataList.forEach(item => {
    const { employeeName } = item;
    if (!data[employeeName]) {
      data[employeeName] = {
        spiffBonusTotal: 0,
        items: [],
      };
    }
    data[employeeName].items.push(item);
    data[employeeName].spiffBonusTotal += item.amount;
  });
  return data;
};

export type ActivityLogsSort = {
  orderByField: keyof ActivityLogType | keyof UserType;
  orderBy: string;
  orderDir: OrderDir;
};
export type LoadActivityLogsByFilter = {
  page: number;
  filter: ActivityLogsFilter;
  sort: ActivityLogsSort;
};
export type ActivityLogsFilter = {
  activityDateStart?: string;
  activityDateEnd?: string;
  activityName?: string;
  withUser?: boolean;
};
/**
 * Returns Activity Logs by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: ActivityLog[], totalCount: number}
 */
export const loadActivityLogsByFilter = async ({
  page,
  filter: { activityDateStart, activityDateEnd, activityName, withUser },
  sort,
}: LoadActivityLogsByFilter) => {
  const { orderBy, orderDir, orderByField } = sort;
  const req = new ActivityLog();
  const u = new User();
  req.setUser(u);
  req.setOrderBy(orderBy);
  req.setOrderDir(orderDir);
  req.setPageNumber(page === -1 ? 0 : page);
  if (activityDateStart && activityDateEnd) {
    req.setDateRangeList(['>=', activityDateStart, '<=', activityDateEnd]);
  }
  if (activityName) {
    req.setActivityName(`%${activityName}%`);
  }
  if (withUser) {
    req.setWithUser(true);
  }
  const results: ActivityLogType[] = [];
  const { resultsList, totalCount } = (
    await ActivityLogClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (page === -1 && totalCount > resultsList.length) {
    const batchesAmount = Math.min(
      MAX_PAGES,
      Math.ceil((totalCount - resultsList.length) / resultsList.length),
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await ActivityLogClientService.BatchGet(req))
          .getResultsList()
          .map(item => item.toObject());
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return { results, totalCount };
};

export type PropertiesSort = {
  orderByField: keyof PropertyType;
  orderBy: string;
  orderDir: OrderDir;
};
export type ContractsSort = {
  orderByField: keyof ContractType;
  orderBy: string;
  orderDir: OrderDir;
};
export type LoadPropertiesByFilter = {
  page: number;
  filter: PropertiesFilter;
  sort: PropertiesSort;
};
export type LoadContractsByFilter = {
  page: number;
  filter: ContractsFilter;
  sort: ContractsSort;
};
export type PropertiesFilter = {
  subdivision?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  userId?: number;
};
export type ContractsFilter = {
  number?: string;
  lastName?: string;
  businessName?: string;
  dateStarted?: string;
  dateEnded?: number;
};
/**
 * Returns Properties by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: Property[], totalCount: number}
 */
export const loadPropertiesByFilter = async ({
  page,
  filter,
  sort,
}: LoadPropertiesByFilter) => {
  const { orderBy, orderDir, orderByField } = sort;
  const req = new Property();
  req.setIsActive(1);
  req.setPageNumber(page);
  // req.setOrderBy(orderBy);
  // req.setOrderDir(orderDir);
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof PropertiesFilter];
    if (value) {
      const { methodName } = getRPCFields(fieldName);
      //@ts-ignore
      req[methodName](typeof value === 'string' ? `%${value}%` : value);
    }
  }
  const response = await PropertyClientService.BatchGet(req);
  return {
    results: response
      .getResultsList()
      .map(item => item.toObject())
      .sort((a, b) => {
        const A = (a[orderByField] || '').toString().toLowerCase();
        const B = (b[orderByField] || '').toString().toLowerCase();
        if (A < B) return orderDir === 'DESC' ? 1 : -1;
        if (A > B) return orderDir === 'DESC' ? -1 : 1;
        return 0;
      }),
    totalCount: response.getTotalCount(),
  };
};

/**
 * Returns Contracts by filter
 * @param page number
 * @param searchBy string
 * @param searchPhrase string
 * @returns {results: Property[], totalCount: number}
 */

export const loadContractsByFilter = async ({
  page,
  filter,
  sort,
}: LoadContractsByFilter) => {
  const { orderBy, orderDir, orderByField } = sort;
  const req = new Contract();
  req.setIsActive(1);
  req.setPageNumber(page);
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof ContractsFilter];

    if (value) {
      const { methodName } = getRPCFields(fieldName);

      //@ts-ignore
      req[methodName](typeof value === 'string' ? `%${value}%` : value);
    }
  }
  const response = await ContractClientService.BatchGet(req);
  return {
    results: response
      .getResultsList()
      .map(item => item.toObject())
      .sort((a, b) => {
        const A = (a[orderByField] || '').toString().toLowerCase();
        const B = (b[orderByField] || '').toString().toLowerCase();
        if (A < B) return orderDir === 'DESC' ? 1 : -1;
        if (A > B) return orderDir === 'DESC' ? -1 : 1;
        return 0;
      }),
    totalCount: response.getTotalCount(),
  };
};

export type EventsSort = {
  orderByField: keyof EventType | keyof PropertyType | keyof UserType;
  orderBy: string;
  orderDir: OrderDir;
};
export type EventsFilter = {
  firstname?: string;
  lastname?: string;
  businessname?: string;
  logJobNumber?: string;
  logPo?: string;
  dateStarted?: string;
  dateStartedFrom?: string;
  dateStartedTo?: string;
  dateEnded?: string;
  address?: string;
  city?: string;
  zip?: string;
  logDateCompleted?: string;
  jobTypeId?: number;
  jobSubtypeId?: number;
  logJobStatus?: string;
  logPaymentStatus?: string;
  departmentId?: number;
  logTechnicianAssigned?: string;
};
export type LoadEventsByFilter = {
  page: number;
  filter: EventsFilter;
  sort: EventsSort;
  pendingBilling?: boolean;
};

/**
 * Returns Events by filter
 * @param page number
 * @param filter EventsFilter
 * @param sort Sort
 * @returns {results: Event[], totalCount: number}
 */
export const loadEventsByFilter = async ({
  page,
  filter,
  sort,
  pendingBilling = false,
}: LoadEventsByFilter) => {
  const {
    logJobNumber,
    dateStarted,
    dateStartedFrom,
    dateStartedTo,
    dateEnded,
    address,
    zip,
    logDateCompleted,
    city,
    firstname,
    lastname,
    businessname,
    jobTypeId,
    jobSubtypeId,
    logJobStatus,
    logPaymentStatus,
    departmentId,
    logTechnicianAssigned,
    logPo,
  } = filter;
  const { orderBy, orderDir, orderByField } = sort;
  const req = new Event();
  const p = new Property();
  const u = new User();
  if (orderByField === 'lastname') {
    u.setOrderBy(orderBy);
    u.setOrderDir(orderDir);
  } else if (orderByField === 'address') {
    // FIXME - missing setOrderBy/setOrderDir in Property RPC
    // p.setOrderBy(orderBy);
    // p.setOrderDir(orderDir)
  } else {
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
    req.setLogJobNumber(`%${logJobNumber}%`);
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
  } else {
    if (dateStarted) {
      req.setDateStarted(`%${dateStarted}%`);
    }
    if (dateEnded) {
      req.setDateEnded(`%${dateEnded}%`);
    }
  }
  if (dateStartedFrom || dateStartedTo) {
    if (dateStartedFrom && dateStartedTo) {
      req.setDateRangeList(['>=', dateStartedFrom, '<=', dateStartedTo]);
      req.setDateTargetList(['date_started', 'date_started']);
    } else if (dateStartedFrom) {
      req.setDateRangeList(['>=', dateStartedFrom]);
      req.setDateTargetList(['date_started']);
    } else if (dateStartedTo) {
      req.setDateRangeList(['<=', dateStartedTo]);
      req.setDateTargetList(['date_started']);
    }
  }
  if (address) {
    p.setAddress(`%${address}%`);
  }
  if (zip) {
    p.setZip(`%${zip}%`);
  }
  if (logDateCompleted) {
    req.setLogDateCompleted(`${logDateCompleted}%`);
  }
  if (city) {
    p.setCity(`%${city}%`);
  }
  if (firstname) {
    u.setFirstname(`%${firstname}%`);
  }
  if (lastname) {
    u.setLastname(`%${lastname}%`);
  }
  if (businessname) {
    u.setBusinessname(`%${businessname}%`);
  }
  req.setProperty(p);
  req.setCustomer(u);
  const results = [];
  const response = await EventClientService.BatchGet(req);
  const totalCount = response.getTotalCount();
  const resultsList = response.getResultsList().map(item => item.toObject());
  results.push(...resultsList);
  if (page === -1 && totalCount > resultsList.length) {
    const batchesAmount = Math.min(
      MAX_PAGES,
      Math.ceil((totalCount - resultsList.length) / resultsList.length),
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await EventClientService.BatchGet(req))
          .getResultsList()
          .map(item => item.toObject());
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return {
    results,
    totalCount,
  };
};

/**
 * Returns Event by job number or contract number
 * @param referenceNumber job number or contract number
 * @returns Event?
 */
async function loadEventByJobOrContractNumber(referenceNumber: string) {
  const req = new Event();
  req.setIsActive(1);
  req.setLogJobNumber(`${referenceNumber}%`);
  const { resultsList, totalCount } = (
    await EventClientService.BatchGet(req)
  ).toObject();
  if (totalCount > 0) return resultsList[0];
  req.setLogJobNumber('');
  req.setContractNumber(referenceNumber);
  const { resultsList: resultsList2, totalCount: totalCount2 } = (
    await EventClientService.BatchGet(req)
  ).toObject();
  if (totalCount2 > 0) return resultsList2[0];
  return undefined;
}

/**
 * Returns Events by job number or contract numbers
 * @param referenceNumbers job number or contract number
 * @returns {[key: referenceNumber]: Event}
 */
async function loadEventsByJobOrContractNumbers(referenceNumbers: string[]) {
  const refNumbers = uniq(
    referenceNumbers.map(el => (el || '').trim()).filter(el => el !== ''),
  );
  return (
    await Promise.all(
      refNumbers.map(async referenceNumber => ({
        referenceNumber,
        data: await loadEventByJobOrContractNumber(referenceNumber),
      })),
    )
  ).reduce(
    (aggr, { referenceNumber, data }) => ({ ...aggr, [referenceNumber]: data }),
    {},
  );
}

/**
 * Returns escaped text with special characters, ie. &#x2f; -> /
 * @param encodedStr string
 * @returns string
 */

function escapeText(encodedStr: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(
    '<!doctype html><body>' + encodedStr,
    'text/html',
  );
  return dom.body.textContent || '';
}

/**
 * Upload file to S3 bucket
 * @param fileName string
 * @param fileData string (starting with ie. `data:image/png;base64,`)
 * @param bucketName string
 * @returns status string: "ok" | "nok"
 */
export const uploadFileToS3Bucket = async (
  fileName: string,
  fileData: string,
  bucketName: string,
  tagString?: string,
) => {
  try {
    const urlObj = new URLObject();
    urlObj.setKey(fileName);
    urlObj.setBucket(bucketName);
    const type = getMimeType(fileName);
    urlObj.setContentType(type || '');
    if (tagString) {
      urlObj.setTagString(tagString);
    }
    const urlRes = await S3ClientService.GetUploadURL(urlObj);
    const uploadRes = await fetch(urlRes.url, {
      body: b64toBlob(fileData.split(';base64,')[1], fileName),
      method: 'PUT',
      headers: tagString
        ? {
            'x-amz-tagging': tagString,
          }
        : {},
    });
    if (uploadRes.status === 200) {
      return 'ok';
    }
    return 'nok';
  } catch (e) {
    return 'nok';
  }
};

export const moveFileBetweenS3Buckets = async (
  from: SimpleFile,
  to: SimpleFile,
  preserveSource: boolean = false,
) => {
  try {
    const res = await S3ClientService.Move(from, to, preserveSource);
    return res ? 'ok' : 'nok';
  } catch (e) {
    return 'nok';
  }
};

export const deleteFileFromS3Buckets = async (key: string, bucket: string) => {
  const req = new FileObject();
  req.setKey(key);
  req.setBucket(bucket);
  await S3ClientService.Delete(req);
};

export const makeOptions = (
  options: string[],
  withAllOption = false,
): Option[] => [
  ...(withAllOption ? [{ label: OPTION_ALL, value: OPTION_ALL }] : []),
  ...options.map(label => ({ label, value: label })),
];

export const getDepartmentName = (d?: TimesheetDepartmentType): string =>
  d ? `${d.value} - ${d.description}` : '';

export const getCustomerName = (
  c?: UserType,
  firstLastName: boolean = false,
): string =>
  c
    ? (firstLastName
        ? `${c.lastname}, ${c.firstname}`
        : `${c.firstname} ${c.lastname}`
      ).trim()
    : '';

export const getBusinessName = (c?: UserType): string =>
  c ? c.businessname.trim() : '';

export const getCustomerPhone = (c?: UserType): string =>
  c ? c.phone.trim() : '';

export const getCustomerPhoneWithExt = (c?: UserType): string =>
  c ? `${c.phone.trim()}${c.ext ? `, ${c.ext}` : ''}` : '';

export const getCustomerNameAndBusinessName = (c?: UserType): string => {
  const name = getCustomerName(c);
  const businessname = getBusinessName(c);
  return `${name}${businessname ? ' - ' : ''}${businessname}`.trim();
};

export const getPropertyAddress = (p?: PropertyType): string =>
  p ? `${p.address}, ${p.city}, ${p.state} ${p.zip}` : '';

export const loadGroups = async () => {
  const group = new Group();
  const { resultsList } = (await GroupClientService.BatchGet(group)).toObject();
  return resultsList;
};

export const loadUserGroupLinksByUserId = async (userId: number) => {
  const groupLink = new UserGroupLink();
  groupLink.setUserId(userId);
  const { resultsList } = (
    await UserGroupLinkClientService.BatchGet(groupLink)
  ).toObject();
  return resultsList;
};

export const saveProperty = async (
  data: PropertyType,
  userId: number,
  propertyId?: number,
) => {
  const req = new Property();
  const fieldMaskList = ['UserId'];
  req.setUserId(userId);
  if (propertyId) {
    req.setId(propertyId);
  }
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await PropertyClientService[propertyId ? 'Update' : 'Create'](req);
};

export const saveUser = async (data: Partial<UserType>, userId?: number) => {
  const req = new User();
  if (userId) {
    req.setId(userId);
  }
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    // @ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await UserClientService[userId ? 'Update' : 'Create'](req);
};

export const upsertEvent = async (data: Partial<EventType>) => {
  const req = new Event();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { upperCaseProp, methodName } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await EventClientService[data.id ? 'Update' : 'Create'](req);
};

export const deleteEventById = async (id: number) => {
  const req = new Event();
  req.setId(id);
  await EventClientService.Delete(req);
};

export const deleteUserById = async (id: number) => {
  const req = new User();
  req.setId(id);
  await UserClientService.Delete(req);
};

export const deletePropertyById = async (id: number) => {
  const req = new Property();
  req.setId(id);
  await PropertyClientService.Delete(req);
};

export const getCurrDate = () =>
  formatDate(new Date().toISOString()).replace(/\//g, '-');

export type InternalDocumentsFilter = {
  tag?: number;
  description?: string;
};

export type InternalDocumentsSort = {
  orderByField: keyof InternalDocumentType | keyof DocumentKeyType;
  orderBy: string;
  orderDir: OrderDir;
};

export type LoadInternalDocuments = {
  page: number;
  filter: InternalDocumentsFilter;
  sort: InternalDocumentsSort;
};
export const loadInternalDocuments = async ({
  page,
  filter: { tag, description },
  sort: { orderBy, orderDir },
}: LoadInternalDocuments) => {
  const req = new InternalDocument();
  const keys = Object.keys(req.toObject());
  req.setOrderBy(orderBy);
  if (!keys.includes(orderBy)) {
    const dk = new DocumentKey();
    dk.setIsActive(true);
    req.setTagData(dk);
  }
  req.setOrderDir(orderDir);
  req.setPageNumber(page);
  if (tag && tag > 0) {
    req.setTag(tag);
  }
  if (description) {
    req.setDescription(`%${description}%`);
  }
  return (await InternalDocumentClientService.BatchGet(req)).toObject();
};

export const upsertInternalDocument = async (data: InternalDocumentType) => {
  const { id } = data;
  const req = new InternalDocument();
  const fieldMaskList = [];
  req.setDateModified(timestamp());
  fieldMaskList.push('DateModified');
  for (const fieldName in data) {
    if (data[fieldName as keyof InternalDocumentType] === undefined) continue;
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  const reqFile = new File();
  reqFile.setBucket(INTERNAL_DOCUMENTS_BUCKET);
  reqFile.setName(data.filename);
  if (data.fileId) {
    reqFile.setId(data.fileId);
  }
  const file = await upsertFile(reqFile.toObject());
  if (!id) {
    req.setDateCreated(timestamp());
    req.setFileId(file.id);
    fieldMaskList.push('DateCreated', 'FileId');
  }
  req.setFieldMaskList(fieldMaskList);
  return await InternalDocumentClientService[id ? 'Update' : 'Create'](req);
};

export const deleteInternalDocumentById = async (id: number) => {
  const req = new InternalDocument();
  req.setId(id);
  await InternalDocumentClientService.Delete(req);
};

export const loadFiles = async (filter: Partial<FileType>) => {
  const req = new File();
  const fieldMaskList = [];
  for (const fieldName in filter) {
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](filter[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return (await FileClientService.BatchGet(req)).toObject();
};

export const upsertFile = async (data: Partial<FileType>) => {
  const req = new File();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await FileClientService[data.id ? 'Update' : 'Create'](req);
};

export const deleteFileById = async (id: number) => {
  const req = new File();
  req.setId(id);
  await FileClientService.Delete(req);
};

export const loadDocumentKeys = async () => {
  const req = new DocumentKey();
  req.setIsActive(true);
  const { dataList } = (
    await InternalDocumentClientService.GetDocumentKeys(req)
  ).toObject();
  return dataList;
};

export const saveDocumentKey = async (data: DocumentKeyType, id?: number) => {
  const req = new DocumentKey();
  const fieldMaskList = [];
  if (id) {
    req.setId(id);
  }
  for (const fieldName in data) {
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  await InternalDocumentClientService.WriteDocumentKey(req);
};

export const deleteDocumentKeyById = async (id: number) => {
  const req = new DocumentKey();
  req.setId(id);
  await InternalDocumentClientService.DeleteDocumentKey(req);
};

export const getFileS3BucketUrl = async (filename: string, bucket: string) => {
  const url = new URLObject();
  url.setKey(filename);
  url.setBucket(bucket);
  const dlURL = await S3ClientService.GetDownloadURL(url);
  return dlURL.url;
};

export const openFile = async (filename: string, bucket: string) => {
  const url = await getFileS3BucketUrl(filename, bucket);
  window.open(url, '_blank');
};

const getComputedStyleCssText = (element: Element) => {
  var style = window.getComputedStyle(element, null),
    cssText;
  if (style.cssText != '') {
    return style.cssText;
  }
  cssText = '';
  for (var i = 0; i < style.length; i++) {
    cssText += style[i] + ': ' + style.getPropertyValue(style[i]) + '; ';
  }
  return cssText;
};

export const setInlineStyles = (theElement: Element) => {
  const els = theElement.children;
  for (let i = 0, maxi = els.length; i < maxi; i++) {
    setInlineStyles(els[i]);
    const defaultElem = document.createElement(els[i].nodeName);
    const child = document.body.appendChild(defaultElem);
    const defaultsStyles = window.getComputedStyle(defaultElem, null);
    let computed = getComputedStyleCssText(els[i]);
    for (let j = 0, maxj = defaultsStyles.length; j < maxj; j++) {
      const defaultStyle =
        defaultsStyles[j] +
        ': ' +
        defaultsStyles.getPropertyValue('' + defaultsStyles[j]) +
        ';';
      if (computed.startsWith(defaultStyle)) {
        computed = computed.substring(defaultStyle.length);
      } else {
        computed = computed.replace(' ' + defaultStyle, '');
      }
    }
    child.remove();
    els[i].setAttribute('style', computed);
  }
};

export const makeLast12MonthsOptions = (
  withAllOption: boolean,
  monthOffset = 0,
) => {
  const today = new Date();
  const currMonth = today.getMonth() + 1 + monthOffset;
  return [
    ...(withAllOption ? [{ label: OPTION_ALL, value: OPTION_ALL }] : []),
    ...MONTHS.slice(currMonth).map((month, idx) => ({
      label: `${month}, ${today.getFullYear() - 1}`,
      value: `${today.getFullYear() - 1}-${trailingZero(
        currMonth + idx + 1,
      )}-%`,
    })),
    ...MONTHS.slice(0, currMonth).map((month, idx) => ({
      label: `${month}, ${today.getFullYear()}`,
      value: `${today.getFullYear()}-${trailingZero(idx + 1)}-%`,
    })),
  ].reverse();
};

export const makeMonthsOptions = (withAllOption?: boolean) => {
  return [
    ...(withAllOption ? [{ label: OPTION_ALL, value: '0' }] : []),
    ...MONTHS.map((month, idx) => ({
      label: month,
      value: trailingZero(idx + 1),
    })),
  ];
};

export const getUploadedHTMLUrl = async (
  HTMLString: string,
  filename: string,
  bucketName: string = 'testbuckethelios',
) => {
  const client = new PDFClient(ENDPOINT);
  const req = new HTML();
  req.setData(HTMLString);
  req.setKey(filename);
  req.setBucket(bucketName);
  const url = await client.Create(req);
  return url;
};

const loadGovPerDiemData = async (
  apiEndpoint: string,
  apiKey: string,
  zipCode: string,
  year: number,
  month: number,
) => {
  try {
    const endpoint = `${apiEndpoint.replace(
      '{ZIP}',
      zipCode,
    )}${year}?api_key=${apiKey}`;
    const {
      rates: [
        {
          rate: [{ meals, months }],
        },
      ],
    } = await (await fetch(endpoint)).json();
    return {
      [zipCode]: { meals: MEALS_RATE, lodging: months.month[month - 1].value },
    };
  } catch (e) {
    return { [zipCode]: { meals: MEALS_RATE, lodging: 0 } };
  }
};

export const loadGovPerDiemByZipCode = async (
  zipCode: number,
  year: number,
) => {
  const client = new ApiKeyClient(ENDPOINT);
  const req = new ApiKey();
  req.setTextId('per_diem_key');
  const { apiEndpoint, apiKey } = await client.Get(req);
  const endpoint = `${apiEndpoint.replace(
    '{ZIP}',
    zipCode.toString(),
  )}${year}?api_key=${apiKey}`;
  const response = await (await fetch(endpoint)).json();
  if (response.rates.length === 0) return false;
  const {
    rates: [
      {
        rate: [
          {
            city,
            county,
            months: { month },
          },
        ],
        state,
      },
    ],
  } = response;
  return { state, city, county, month };
};

export const loadPerDiemsLodging = async (perDiems: PerDiemType[]) => {
  const zipCodesByYearMonth: {
    [key: number]: {
      [key: number]: string[];
    };
  } = {};
  perDiems.forEach(({ rowsList }) =>
    rowsList
      .filter(({ mealsOnly }) => !mealsOnly)
      .forEach(({ dateString, zipCode }) => {
        const [y, m] = dateString.split('-');
        const year = +y;
        const month = +m;
        if (!zipCodesByYearMonth[year]) {
          zipCodesByYearMonth[year] = {};
        }
        if (!zipCodesByYearMonth[year][month]) {
          zipCodesByYearMonth[year][month] = [];
        }
        if (!zipCodesByYearMonth[year][month].includes(zipCode)) {
          zipCodesByYearMonth[year][month].push(zipCode);
        }
      }),
  );
  const zipCodesArr: {
    year: number;
    month: number;
    zipCodes: string[];
  }[] = [];
  Object.keys(zipCodesByYearMonth).forEach(year =>
    Object.keys(zipCodesByYearMonth[+year]).forEach(month => {
      zipCodesArr.push({
        year: +year,
        month: +month,
        zipCodes: zipCodesByYearMonth[+year][+month],
      });
    }),
  );
  const govPerDiems = await Promise.all(
    zipCodesArr.map(async ({ year, month, zipCodes }) => ({
      year,
      month,
      data: await loadGovPerDiem(zipCodes, year, month),
    })),
  );
  const govPerDiemsByYearMonth: {
    [key: number]: {
      [key: number]: {
        [key: string]: {
          meals: number;
          lodging: number;
        };
      };
    };
  } = {};
  govPerDiems.forEach(({ year, month, data }) => {
    if (!govPerDiemsByYearMonth[year]) {
      govPerDiemsByYearMonth[year] = {};
    }
    govPerDiemsByYearMonth[year][month] = data;
  });
  return perDiems
    .reduce(
      (aggr, { rowsList }) => [...aggr, ...rowsList],
      [] as PerDiemRowType[],
    )
    .filter(({ mealsOnly }) => !mealsOnly)
    .reduce((aggr, { id, dateString, zipCode }) => {
      const [y, m] = dateString.split('-');
      const year = +y;
      const month = +m;
      return {
        ...aggr,
        [id]: govPerDiemsByYearMonth[year][month][zipCode].lodging,
      };
    }, {});
};

export const loadGovPerDiem = async (
  zipCodes: string[],
  year: number,
  month: number,
) => {
  const client = new ApiKeyClient(ENDPOINT);
  const req = new ApiKey();
  req.setTextId('per_diem_key');
  const { apiEndpoint, apiKey } = await client.Get(req);
  const results = await Promise.all(
    uniq(zipCodes).map(zipCode =>
      loadGovPerDiemData(apiEndpoint, apiKey, zipCode, year, month),
    ),
  );
  return results.reduce((aggr, item) => ({ ...aggr, ...item }), {});
};

export const loadTaskEventsByFilter = async ({
  id,
  technicianUserId,
  withTechnicianNames = false,
}: {
  id: number;
  technicianUserId?: number;
  withTechnicianNames?: boolean;
}) => {
  const req = new TaskEvent();
  req.setTaskId(id);
  if (technicianUserId) {
    req.setTechnicianUserId(technicianUserId);
  }
  req.setIsActive(true);
  req.setPageNumber(0);
  const results: TaskEventType[] = [];
  const { resultsList, totalCount } = (
    await TaskEventClientService.BatchGet(req)
  ).toObject();
  results.push(...resultsList);
  if (totalCount > resultsList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - resultsList.length) / resultsList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await TaskEventClientService.BatchGet(req)).toObject()
          .resultsList;
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  if (withTechnicianNames) {
    const technicianIds = uniq(
      compact(results.map(({ technicianUserId }) => technicianUserId)),
    );
    const technicianNames = await loadUsersByIds(technicianIds);
    results.forEach(result => {
      result.technicianName = technicianNames[result.technicianUserId]
        ? getCustomerName(technicianNames[result.technicianUserId])
        : '';
    });
  }
  return results.sort((a, b) => {
    const A = a.timeStarted;
    const B = b.timeStarted;
    if (A < B) return 1;
    if (A > B) return -1;
    return 0;
  });
};

export const upsertTaskEvent = async (data: Partial<TaskEventType>) => {
  const req = new TaskEvent();
  const fieldMaskList = [];
  for (const fieldName in data) {
    const { methodName, upperCaseProp } = getRPCFields(fieldName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  return await TaskEventClientService[data.id ? 'Update' : 'Create'](req);
};

export const deleteTaskEvent = async (id: number) => {
  const req = new TaskEvent();
  req.setId(id);
  await TaskEventClientService.Delete(req);
};

interface IBugReport {
  title: string;
  body?: string;
  labels?: string[];
}
const BUG_REPORT_LABEL = 'user submitted bug report';
async function newBugReport(data: IBugReport) {
  try {
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId('github_key');
    const key = await client.Get(req);
    data.labels = [BUG_REPORT_LABEL];
    const authString = `token ${key.apiKey}`;
    const postData = {
      method: 'POST',
      headers: {
        Authorization: authString,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    await fetch(key.apiEndpoint, postData);
  } catch (err) {
    console.log('error generating bug report', err);
  }
}

export type BugReportImage = {
  label: string;
  data: string;
  url?: string;
};

async function newBugReportImage(
  user: User.AsObject,
  images: BugReportImage[],
) {
  try {
    const timestamp = new Date().getTime();
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId('github_file_key');
    const key = await client.Get(req);
    const common = {
      message: 'bug report image',
      committer: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
      },
    };
    const authString = `token ${key.apiKey}`;
    const result: { filename: string; url: string }[] = [];
    for (const img of images) {
      const data = { ...common, content: img.data };
      const putData = {
        method: 'PUT',
        headers: {
          Authorization: authString,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      try {
        await fetch(
          `${key.apiEndpoint}/images/${timestamp}/${img.label}`,
          putData,
        );
        result.push({
          filename: img.label,
          url: encodeURI(
            `https://github.com/rmilejcz/kalos-frontend-issues/raw/master/images/${timestamp}/${img.label}`,
          ),
        });
      } catch (e) {
        console.log('error uploading image', e);
      }
    }
    return result;
  } catch (err) {
    console.log('error uploading image', err);
  }
}

export const CustomEventsHandler = (() => {
  type EventName =
    | 'AddProperty'
    | 'AddServiceCall'
    | 'ShowDocuments'
    | 'EditCustomer';
  const customEvents: { [key in EventName]: boolean } = {
    AddProperty: false,
    AddServiceCall: false,
    ShowDocuments: false,
    EditCustomer: false,
  };
  return {
    listen: (eventName: EventName, callback: () => void) => {
      if (customEvents[eventName]) return;
      customEvents[eventName] = true;
      window.addEventListener(eventName, callback);
    },
    emit: (eventName: EventName) =>
      window.dispatchEvent(new CustomEvent(eventName)),
  };
})();

/**
 * Checks URL for http, and redirects to https appropriately
 */
function forceHTTPS() {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname.startsWith('192.168.')
  )
    return;
  if (window.location.href.includes('http://')) {
    window.location.href = window.location.href.replace('http://', 'https://');
  }
}

/**
 * A redundant hardening feature that redirects non-employees from admin views
 * @param user
 */
function customerCheck(user: User.AsObject) {
  if (window.location.href.includes('admin') && user.isEmployee === 0) {
    window.location.href =
      'https://app.kalosflorida.com/index.cfm?action=customer:account.dashboard';
  }
}

type dateRes = [number, number, number];
/**
 *
 * @param str A date string in the format YYYY-MM-DD
 */
function getDateArgs(str: string): dateRes {
  const splitTarget = str.includes('T') ? 'T' : ' ';
  const arr = str.split(splitTarget);
  const dateParts = arr[0].split('-');
  return [
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1, //month must be decremented
    parseInt(dateParts[2]),
  ];
}

type dateTimeRes = [number, number, number, number, number, number];
/**
 *
 * @param str A date string in the format YYYY-MM-DD HH:MM:SS
 */
function getDateTimeArgs(str: string): dateTimeRes {
  const splitTarget = str.includes('T') ? 'T' : ' ';
  const arr = str.split(splitTarget);
  const dateParts = arr[0].split('-');
  const timeParts = arr[1].split(':');
  return [
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1, //month must be decremented
    parseInt(dateParts[2]),
    parseInt(timeParts[0]),
    parseInt(timeParts[1]),
    parseInt(timeParts[2]),
  ];
}

export {
  SUBJECT_TAGS,
  getDateArgs,
  getDateTimeArgs,
  cfURL,
  BASE_URL,
  timestamp,
  getSlackList,
  getSlackID,
  slackNotify,
  getEditDistance,
  getURLParams,
  b64toBlob,
  formatTime,
  formatDate,
  formatDay,
  formatDateTimeDay,
  makeFakeRows,
  getRPCFields,
  formatDateTime,
  padWithZeroes,
  loadJobTypes,
  loadJobSubtypes,
  loadJobTypeSubtypes,
  loadPropertyById,
  loadUserById,
  loadUsersByIds,
  range,
  loadGeoLocationByAddress,
  loadTechnicians,
  loadEventsByPropertyId,
  loadServicesRendered,
  loadStoredQuotes,
  loadQuoteParts,
  loadQuoteLineParts,
  loadQuoteLines,
  trailingZero,
  loadTimesheetDepartments,
  loadUsersByDepartmentId,
  loadMetricByUserId,
  loadMetricByUserIds,
  roundNumber,
  getWeekOptions,
  loadSpiffToolAdminActionsByTaskId,
  loadEventByJobOrContractNumber,
  loadEventsByJobOrContractNumbers,
  escapeText,
  newBugReport,
  newBugReportImage,
  forceHTTPS,
  customerCheck,
};
