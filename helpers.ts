import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import compact from 'lodash/compact';
import { parseISO } from 'date-fns/esm';
import { startOfWeek, format, addMonths, addDays } from 'date-fns';
import {
  S3Client,
  URLObject,
  FileObject,
  SUBJECT_TAGS,
  SUBJECT_TAGS_TRANSACTIONS,
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
import { QuotableRead } from '@kalos-core/kalos-rpc/compiled-protos/event_pb';
import { QuoteLineClient, QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import {
  PerDiemClient,
  PerDiem,
  PerDiemRow,
  PerDiemReportConfig,
} from '@kalos-core/kalos-rpc/PerDiem';
import { MapClient, MatrixRequest, Place } from '@kalos-core/kalos-rpc/Maps';
import {
  PerDiemList,
  Trip,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Coordinates, MapClient as KalosMap } from '@kalos-core/kalos-rpc/Maps';
import {
  TimesheetDepartmentClient,
  TimesheetDepartment,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  TimesheetLineClient,
  TimesheetLine,
} from '@kalos-core/kalos-rpc/TimesheetLine';
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
import { TripInfo } from './modules/ComponentsLibrary/TripViewModal';
import { NULL_TIME } from './constants';
import { PropertyInfo } from './modules/PropertyInformation/components/PropertyInfo';

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
export type QuotableReadType = QuotableRead.AsObject;
export type QuotableType = Quotable.AsObject;
export type ProjectTaskType = ProjectTask.AsObject;
export type ProjectType = Event.AsObject;
export type TaskStatusType = TaskStatus.AsObject;
export type TaskPriorityType = TaskPriority.AsObject;
export type TransactionType = Transaction.AsObject;
export type TaskEventType = TaskEvent.AsObject & { technicianName?: string };
export type TaskAssignmentType = TaskAssignment.AsObject;
export type CardDataType = CardData.AsObject;
export type TransactionDocumentType = TransactionDocument.AsObject;
export type TimeoffRequestType = TimeoffRequest.AsObject;
export type PTOType = PTO.AsObject;
export type TimesheetLineType = TimesheetLine.AsObject;
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
export const TimesheetLineClientService = new TimesheetLineClient(ENDPOINT);

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

/**
 * Returns a key given its alias
 * @param keyName
 * @returns ApiKey.AsObject
 */
export const getKeyByKeyName = async (keyName: string) => {
  const client = new ApiKeyClient(ENDPOINT);
  const req = new ApiKey();
  req.setTextId(keyName);
  const ans = await client.Get(req);
  return ans;
};

const BASE_URL = 'https://app.kalosflorida.com/index.cfm';

const IRS_SUGGESTED_MILE_FACTOR = 0.56; // $0.56 a mile

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

export const perDiemTripMilesToUsdAsNumber = (miles: number) => {
  return miles * IRS_SUGGESTED_MILE_FACTOR;
};

export const perDiemTripMilesToUsd = (miles: number) => {
  return usd(perDiemTripMilesToUsdAsNumber(miles));
};

/**
 *
 * @param dateOnly if true, returns only the date portion YYYY-MM-DD
 * @returns a timestamp in the format YYYY-MM-DD HH:MM:SS
 */
function timestamp(dateOnly = false, date?: Date) {
  const dateObj = date || new Date();
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
  const KALOS_BOT = await getKeyByKeyName('kalos_bot');
  await fetch(
    `https://slack.com/api/chat.postMessage?token=${KALOS_BOT.apiKey}&channel=${id}&text=${text}`,
    {
      method: 'POST',
    },
  );
}

// Replacement for lodash uniq
function unique(original: any[]) {
  let container: any[] = [];
  for (const el of original) {
    if (!container.includes(el)) {
      container.push(el);
    }
  }
  console.log('Returning: ', container);
  return container;
}

async function getSlackList(skipCache = false): Promise<SlackUser[]> {
  const KALOS_BOT = await getKeyByKeyName('kalos_bot');
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
      `https://slack.com/api/users.list?token=${KALOS_BOT.apiKey}`,
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

export const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'yyyy')} ${format(d, 'MMMM')}, ${format(
    d,
    'do',
  )}`;
};

export const updateMaterialUsed = async (
  serviceCallId: number,
  materialUsed: string,
  materialTotal: number,
) => {
  const req = new Event();
  req.setId(serviceCallId);
  req.setMaterialUsed(materialUsed);
  req.setMaterialTotal(materialTotal);
  req.setFieldMaskList(['MaterialUsed', 'MaterialTotal']);
  await EventClientService.Update(req);
};

export interface GetPendingSpiffConfig {
  page?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
  role?: string;
  departmentId?: number;
  option?: string;
}

export const GetPendingTasks = (billableType: string) => {
  return async (config: GetPendingSpiffConfig) => {
    const req = new Task();
    req.setOrderBy(billableType === 'Spiff' ? 'date_performed' : 'time_due');
    req.setBillableType(billableType);
    if (billableType === 'Spiff') {
      req.setDatePerformed(NULL_TIME);
      req.setNotEqualsList(['DatePerformed']);
    }
    if (billableType === 'Tool Purchase') {
      req.setTimeDue(NULL_TIME);
      req.setNotEqualsList(['TimeDue']);
    }
    req.setIsActive(true);
    req.setGroupBy('external_id');
    req.setPageNumber(config.page || 0);
    if (config.role === 'Manager') {
      req.setFieldMaskList(['AdminActionId']);
      if (billableType === 'Spiff') {
        req.setNotEqualsList(['DatePerformed']);
      }
      if (billableType === 'Tool Purchase') {
        req.setNotEqualsList(['TimeDue']);
      }
    }
    if (config.role === 'Payroll') {
      if (billableType === 'Spiff') {
        req.setNotEqualsList(['AdminActionId', 'DatePerformed']);
        req.setFieldMaskList(['PayrollProcessed']);
      }
      if (billableType === 'Tool Purchase') {
        req.setNotEqualsList(['AdminActionId', 'TimeDue']);
        req.setFieldMaskList(['PayrollProcessed']);
      }
    }
    if (config.role === 'Auditor') {
      console.log('Spiff Tool auditor');
      if (billableType === 'Spiff') {
        req.setNotEqualsList([
          'AdminActionId',
          'DatePerformed',
          'NeedsAuditing',
        ]);
      }
      if (billableType === 'Tool Purchase') {
        req.setNotEqualsList(['AdminActionId', 'TimeDue', 'NeedsAuditing']);
      }
    }
    if (config.technicianUserID) {
      //req.setExternalId(config.technicianUserID);
    }
    if (config.startDate && config.endDate) {
      req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
    }
    if (config.option) {
      const spiffType = new SpiffType();
      spiffType.setPayout(config.option);
      req.setSpiffType(spiffType);
    }
    if (config.departmentId) {
      let u = new User();
      u.setEmployeeDepartmentId(config.departmentId);
      req.setSearchUser(u);
    }
    console.log(req);
    const response = (await TaskClientService.BatchGet(req)).toObject();
    return response;
  };
};

export const loadPendingSpiffs = GetPendingTasks('Spiff');
export const loadPendingToolLogs = GetPendingTasks('Tool Purchase');

export interface GetTimesheetConfig {
  page?: number;
  departmentID?: number;
  requestType?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
}

export const loadTimeoffRequests = async (config: GetTimesheetConfig) => {
  const req = new TimeoffRequest();
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
  }
  if (config.departmentID) {
    req.setDepartmentCode(config.departmentID);
  }
  if (config.technicianUserID) {
    req.setUserId(config.technicianUserID);
  }
  req.setPageNumber(config.page || 0);
  req.setOrderBy('time_started');
  if (config.requestType !== 9) {
    req.setRequestType(config.requestType || 0);
    req.setFieldMaskList(['AdminApprovalUserId']);
  }
  if (config.requestType === 9) {
    req.setFieldMaskList(['PayrollProcessed']);
    req.setNotEqualsList(['AdminApprovalDatetime']);
    req.setAdminApprovalDatetime('0001-01-01 00:00:00');
    req.setRequestTypeList('9,10,11');
  } else {
    req.setNotEqualsList(['AdminApprovalDatetime']);
    req.setAdminApprovalDatetime('0001-01-01 00:00:00');
    req.setRequestTypeList('9,10,11');
  }
  if (config.departmentID) {
    const user = new User();
    user.setEmployeeDepartmentId(config.departmentID);
    req.setUser(user);
  }
  req.setIsActive(1);
  return (await TimeoffRequestClientService.BatchGet(req)).toObject();
};

export const loadTimesheets = async ({
  page,
  departmentId,
  employeeId,
  startDate,
  endDate,
}: {
  page: number;
  departmentId?: number;
  employeeId?: number;
  startDate?: string;
  endDate?: string;
}) =>
  (
    await TimesheetLineClientService.GetTimesheets({
      page,
      departmentID: departmentId,
      technicianUserID: employeeId,
      startDate,
      endDate,
      type: 'Payroll', // Added payroll type to get rid of error
    })
  ).toObject();

export const loadTimesheetLine = async ({
  page,
  departmentId,
  technicianUserId,
}: {
  page: number;
  departmentId: number;
  technicianUserId: number;
}) => {
  const req = new TimesheetLine();
  req.setPageNumber(page);
  if (departmentId) {
    req.setDepartmentCode(departmentId);
  }
  if (technicianUserId) {
    req.setTechnicianUserId(technicianUserId);
  }
  const response = (await TimesheetLineClientService.BatchGet(req)).toObject();
  return response;
};

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

/** Returns loads all employees unfiltered
 * @returns User[]
 */
async function loadTechnicians() {
  const req = new User();
  req.setIsActive(1);
  req.setIsEmployee(1);
  req.setOverrideLimit(true);
  const { resultsList } = (await UserClientService.BatchGet(req)).toObject();
  return resultsList.sort((a, b) => {
    const A = `${a.firstname} ${a.lastname}`.toLocaleLowerCase();
    const B = `${b.firstname} ${b.lastname}`.toLocaleLowerCase();
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  });
}

/** Returns all loaded Users by department id, does not support pagination, returns in alphabetical order
 * @param departmentId: number
 * @returns User[]
 */
async function loadUsersByDepartmentId(departmentId: number) {
  const results: UserType[] = [];
  const req = new User();
  req.setIsActive(1);
  req.setEmployeeDepartmentId(departmentId);
  req.setOverrideLimit(true);
  const { resultsList } = (await UserClientService.BatchGet(req)).toObject();
  return resultsList.sort((a, b) => {
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

export const writeQuotes = async (q: Quotable) => {
  return await EventClientService.WriteQuotes(q);
};

/**
 * Returns loaded QuoteParts
 * @returns QuotePart[]
 */
async function loadQuoteParts(
  filter: Partial<QuotableReadType>,
  fieldMaskListInit: string[] = [],
) {
  const results: QuotableType[] = [];
  const { dataList, totalCount } = (
    await EventClientService.loadQuotableList(
      { ...filter, pageNumber: 0 },
      fieldMaskListInit,
    )
  ).toObject();
  results.push(...dataList);
  if (totalCount > dataList.length) {
    const batchesAmount = Math.ceil(
      (totalCount - dataList.length) / dataList.length,
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        return (
          await EventClientService.loadQuotableList(
            { ...filter, pageNumber: idx + 1 },
            fieldMaskListInit,
          )
        ).toObject().dataList;
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

export const loadProjectTaskBillableTypes = async () => {
  //const { resultsList } = (
  //  await TaskClientService.loadTaskBillableTypeList() // FIXME when available in rpc
  //).toObject();
  return ['Flat Rate', 'Hourly', 'Parts Run', 'Spiff', 'Tool Purchase'];
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
  checkedIn,
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
  if (checkedIn != undefined) {
    req.setCheckedIn(checkedIn);
    fieldMaskList.push('CheckedIn');
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
  const users = await Promise.all(
    uniqueIds.map(id => UserClientService.loadUserById(id)),
  );
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

export const downloadCSV = (filename: string, csv: string) => {
  const link = document.createElement('a');
  link.setAttribute('download', `${filename}.csv`);
  link.setAttribute(
    'href',
    'data:text/csv;charset=utf-8,' + encodeURIComponent(csv),
  );
  link.click();
};

export const loadTransactionsByEventId = async (
  eventId: number,
  withoutLimit = false,
  page = 0,
) => {
  const req = new Transaction();
  req.setJobId(eventId);
  req.setIsActive(1);
  req.setPageNumber(page);
  req.setWithoutLimit(withoutLimit);
  const { resultsList, totalCount } = (
    await TransactionClientService.BatchGet(req)
  ).toObject();
  return resultsList;
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

export const loadPerDiemByUserIdsAndDateStarted = async (
  userIds: number[],
  dateStarted: string,
) => {
  const response = await Promise.all(
    unique(userIds).map(async userId => ({
      userId,
      data: (
        await PerDiemClientService.loadPerDiemByUserIdAndDateStarted(
          userId,
          dateStarted,
        )
      ).resultsList,
    })),
  );
  return response.reduce(
    (aggr, { userId, data }) => ({ ...aggr, [userId]: data }),
    {},
  );
};

export const getRowDatesFromPerDiemTripInfos = async (trips: TripInfo[]) => {
  let tripIds = [];
  for (const trip of trips) {
    tripIds.push(trip.perDiemRowId);
  }
  let res: { date: string; row_id: number }[] = [];
  for await (const id of tripIds) {
    try {
      let pd = new PerDiem();
      pd.setId(id);
      const pdr = await PerDiemClientService.Get(pd);
      const obj = {
        date: pdr.dateStarted,
        row_id: id,
      };
      if (!res.includes(obj)) res.push(obj);
    } catch (err) {
      console.error(
        'Error in promise for get row dates from per diem IDs (Verify Per Diem exists): ',
        err,
      );
    }
  }

  return res;
};

export const getRowDatesFromPerDiemTrips = async (trips: Trip[]) => {
  let tripIds = [];
  for (const trip of trips) {
    tripIds.push(trip.getPerDiemRowId());
  }
  let res: { date: string; row_id: number }[] = [];

  if (tripIds.length != 0) {
    let pds = await PerDiemClientService.BatchGetPerDiemsByIds(tripIds);

    for (const perDiem of pds.getResultsList()) {
      const obj = {
        date: perDiem.getDateStarted(),
        row_id: perDiem.getId(),
      };
      res.push(obj);
    }
  }

  return res;
};

export const getRowDatesFromPerDiemIds = async (ids: number[]) => {
  let res: { date: string; row_id: number }[] = [];
  for await (const id of ids) {
    try {
      let pd = new PerDiem();
      pd.setId(id);
      const pdr = await PerDiemClientService.Get(pd);
      const obj = {
        date: pdr.dateStarted,
        row_id: id,
      };
      if (!res.includes(obj)) res.push(obj);
    } catch (err) {
      console.error(
        'Error in promise for get row dates from per diem IDs (Verify Per Diem exists): ',
        err,
      );
    }
  }

  return res;
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
export const loadPerDiemsForPayroll = async (
  page: number,
  needsAuditing: boolean,
  needsProcessed: boolean,
  managerApproved?: boolean,
  departmentId?: number,
  userId?: number,
  dateStarted?: string,
) => {
  const req = new PerDiem();
  req.setWithRows(true);
  req.setPageNumber(page);
  req.addNotEquals('DateSubmitted');
  req.setDateSubmitted(NULL_TIME);
  if (departmentId) {
    req.setDepartmentId(departmentId);
  }
  if (userId) {
    req.setUserId(userId);
  }
  if (dateStarted) {
    req.setDateStarted(`${dateStarted}%`);
  }
  if (managerApproved || needsProcessed || needsAuditing) {
    if (managerApproved) {
      //fetch unapproved perdiems for the department
      req.addFieldMask('ApprovedById');
      req.addNotEquals('PayrollProcessed');
    } else if (needsProcessed) {
      //fetch all peridems that are not currently processed by payroll
      req.addNotEquals('ApprovedById');
      req.addFieldMask('PayrollProcessed');
    } else if (needsAuditing) {
      //fetch perdiems that have no been audited yet
      req.addNotEquals('ApprovedById');
      req.addFieldMask('NeedsAuditing');
      req.setFieldMaskList(['NeedsAuditing']);
      req.setNeedsAuditing(true);
    }
  }

  return (await PerDiemClientService.BatchGet(req)).toObject();
};
export const loadPerDiemsNeedsAuditing = async (
  page: number,
  needsAuditing: boolean,
  payrollProcessed: boolean,
  departmentId?: number,
  userId?: number,
  dateStarted?: string,
  approved?: boolean,
) => {
  const req = new PerDiem();
  req.setFieldMaskList([
    'NeedsAuditing',
    'PayrollProcessed',
    ...(typeof approved === 'boolean' && !approved ? ['ApprovedById'] : []),
  ]);
  req.setWithRows(true);
  req.setPageNumber(page);
  req.setNeedsAuditing(needsAuditing);
  req.setPayrollProcessed(payrollProcessed);
  req.setNotEqualsList(['DateSubmitted']);
  req.setDateSubmitted(NULL_TIME);
  req.setIsActive(true);
  if (departmentId) {
    req.setDepartmentId(departmentId);
  }
  if (userId) {
    req.setUserId(userId);
  }
  if (dateStarted) {
    req.setDateStarted(`${dateStarted}%`);
  }
  if (typeof approved === 'boolean' && approved) {
    req.setNotEqualsList(['ApprovedById']);
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
      }
      if (!isNaN(Number(str))) {
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
  streetAddress = streetAddress.trimStart();
  streetAddress = streetAddress.trimEnd();
  city = city.trimStart();
  city = city.trimEnd();
  state = state.trimStart();
  state = state.trimEnd();

  pl.setStreetNumber(streetNumber);
  pl.setRoadName(streetAddress);
  pl.setCity(city);
  pl.setState(state);
  pl.setZipCode(zipCode);

  return pl;
};

const metersToMiles = (meters: number): number => {
  const conversionFactor = 0.000621;
  return !Number.isNaN(meters * conversionFactor)
    ? meters * conversionFactor
    : 0;
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
      distanceKm = row.toArray()[0][0][3][0];
      distanceMeters = row.toArray()[0][0][3][1];
      status = row.toArray()[0][0][0];
    });

    if (status != 'OK') {
      console.error("Status was not 'OK' on distanceMatrixRequest.");
      console.error('Status was: ', status);
    }

    distanceMiles = metersToMiles(distanceMeters);

    return distanceMiles;
  } catch (err) {
    console.error(
      'An error occurred while calculating the trip distance: ' + err,
    );
    throw new Error(err);
  }
};

export const tripAsObjectToTrip = (
  asObj: Trip.AsObject,
  rowId?: number,
  userId?: number,
): Trip => {
  const req = new Trip();
  let originAddress: string = '',
    destinationAddress: string = '',
    fieldMaskList = [];
  for (const fieldName in asObj) {
    let { upperCaseProp, methodName } = getRPCFields(fieldName);
    if (methodName == 'setDestinationAddress') {
      //@ts-ignore
      destinationAddress = asObj[fieldName];
    }
    if (methodName == 'setOriginAddress') {
      //@ts-ignore
      originAddress = asObj[fieldName];
    }

    //@ts-ignore
    req[methodName](asObj[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  req.setPerDiemRowId(rowId ? rowId : asObj.perDiemRowId);
  req.setUserId(userId ? userId : asObj.userId);
  req.setNotes(asObj.notes);
  req.setDistanceInMiles(asObj.distanceInMiles);
  req.setOriginAddress(originAddress);
  req.setDestinationAddress(destinationAddress);
  return req;
};

export const upsertTrip = async (
  data: Trip.AsObject,
  rowId: number,
  userId: number,
) => {
  const req = tripAsObjectToTrip(data, rowId, userId);
  req.setDistanceInMiles(
    await getTripDistance(req.getOriginAddress(), req.getDestinationAddress()),
  );

  try {
    return await PerDiemClientService[
      data.id != 0 && data.id != null ? 'UpdateTrip' : 'CreateTrip'
    ](req);
  } catch (err) {
    console.error('Error occurred trying to save trip: ' + err);
  }
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

/**
 * Returns a number representing the per diem row id of the current week (or the date provided if
 * one was provided), or undefined if there is an error.
 * @param date
 * @returns number | undefined
 */
export const getPerDiemRowIds = async (date?: Date) => {
  const dateToQuery = date != null ? date : new Date();
  let daysToGoBack = 0;
  // If the day is Monday - Friday, we don't have to worry about overflow stuff with the offset
  // (Since our days start on Saturday, not Sunday like JS, we have this weirdness)
  if (dateToQuery.getDay() <= 5) {
    daysToGoBack = dateToQuery.getDay() + 1;
  } else {
    daysToGoBack = dateToQuery.getDay() - 6;
  }
  let dateToQueryMonth = dateToQuery.getMonth() + 1;
  let dateToQueryYear = dateToQuery.getFullYear();
  let dateToQueryDay = dateToQuery.getDate() - daysToGoBack;
  // If the dateToQueryDay is less than 0, that means it occurred last year but this day
  // that is being checked is in the new year, so we act accordingly
  if (dateToQueryDay < 0) {
    dateToQueryMonth = 12;
    dateToQueryYear--;
    dateToQueryDay = 31 + dateToQueryDay;
  }

  // We find the last saturday that happened because that's the start of our weeks
  // and every Saturday per_diem_row is incremented
  const lastSaturday = `${dateToQueryYear}-${padWithZeroes(
    dateToQueryMonth,
  )}-${padWithZeroes(dateToQueryDay)} 00:00:00`;

  let perDiemRes: PerDiemList = new PerDiemList();
  try {
    let pd = new PerDiem();
    pd.setDateStarted(lastSaturday);
    perDiemRes = await PerDiemClientService.BatchGet(pd);
  } catch (error) {
    let err = String(error);
    if (
      err.startsWith(
        'Error: failed to scan PerDiem query result - sql: no rows in result set',
      )
    ) {
      // There was just no results in the set so we should not error for that,
      // just display it as no trips and if they go to add one add a Per Diem
      // first
      console.log('No per-diem was found for the given date : ', error);
      return;
    }
    console.error(
      'An error occurred while fetching the current Per-Diem period: ',
      error,
    );
  }

  if (perDiemRes.getTotalCount() == 0) {
    console.error('No per-diem was found for the given date.');
    return;
  }

  return perDiemRes;
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
 * Returns geo-coordinates for given address location
 * @param address
 * @returns { geolocationLat: number, geolocationLng: number }
 */
async function loadGeoLocationByAddress(address: string) {
  try {
    const res = await getKeyByKeyName('google_maps');
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${res.apiKey}`,
    );
    const data = await response.json();
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
  if (page === -1) {
    req.setOverrideLimit(true);
  } else {
    req.setPageNumber(page);
  }
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
  return {
    results: resultsList.sort((a, b) => {
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
export type DateStartEndSearchFilter = {
  dateStart: string;
  dateEnd: string;
  businessName?: string;
  lastname?: string;
};
export type LoadMetricsByFilter = {
  page: number;
  filter: DateStartEndFilter;
};
export type LoadMetricsBySearchFilter = {
  page: number;
  filter: DateStartEndSearchFilter;
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
  filter: { dateStart, dateEnd, businessName, lastname },
}: LoadMetricsBySearchFilter) => {
  const req = new Event();
  req.setFieldMaskList(['IsActive']);
  if (businessName && businessName != '') {
    const bReq = new Property();
    bReq.setBusinessname(businessName);
    const bResult = await PropertyClientService.Get(bReq);
    if (bReq) {
      req.setPropertyId(bResult.id);
      req.addFieldMask('PropertyId');
    }
  }

  req.setPageNumber(page === -1 ? 0 : page);
  req.setOrderBy('date_started');
  req.setOrderDir('ASC');
  req.setIsActive(0);
  req.setDateRangeList(['>=', dateStart, '<=', dateEnd]);
  req.setDateTargetList(['date_started', 'date_started']);
  req.setWithoutLimit(true);
  const results: EventType[] = [];
  const { resultsList, totalCount } = (
    await EventClientService.BatchGet(req)
  ).toObject();
  return { resultsList, totalCount };
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

  const fn = (key: any) => {
    key.trimStart();
    return (a: PromptPaymentData, b: PromptPaymentData) => {
      // @ts-ignore
      a[key] = a[key].trimStart();
      // @ts-ignore
      b[key] = b[key].trimStart();
      // @ts-ignore
      return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
    };
  };

  console.log();

  return Object.values(data)
    .concat()
    .sort(fn('customerName'))
    .map(
      //@ts-ignore
      ({
        averageDaysToPay,
        ...item
      }: {
        averageDaysToPay: number;
        promptPaymentData: PromptPaymentData;
      }) => ({
        ...item,
        averageDaysToPay:
          // @ts-ignore
          item.paidInvoices === 0
            ? 0
            : // @ts-ignore
              Math.round(averageDaysToPay / item.paidInvoices),
      }),
    );
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
export type TripsSort = {
  orderByField: keyof TripType;
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
export type LoadTripsByFilter = {
  page: number;
  filter: TripsFilter;
  sort: TripsSort;
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
export type TripsFilter = {
  id?: number;
  userId?: number;
  lastName?: string;
  originAddress?: string;
  destinationAddress?: string;
  weekof?: number[];
  page: number;
  payrollProcessed: boolean;
  approved: boolean;
  role?: string;
  departmentId?: number;
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

export const loadTripsByFilter = async ({
  page,
  filter,
  sort,
}: LoadTripsByFilter) => {
  const { orderBy, orderDir, orderByField } = sort;
  const req = new Trip();
  req.setPage(page);
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof TripsFilter];

    const { methodName } = getRPCFields(fieldName);

    // @ts-ignore
    if (!req[methodName]) continue;

    //@ts-ignore
    req[methodName](typeof value === 'string' ? `%${value}%` : value);
  }
  req.setApproved(filter.approved);
  req.setPayrollProcessed(filter.payrollProcessed);

  if (filter.payrollProcessed) {
    req.setApproved(true);
    req.setNotEqualsList(['PayrollProcessed']);
  }
  if (!filter.approved) {
    req.setNotEqualsList([...req.getNotEqualsList(), 'Approved']);
    req.setApproved(!req.getApproved());
  }
  //if (filter.approved) {
  //  req.setFieldMaskList(['ApproveById']);
  //}

  const response = await PerDiemClientService.BatchGetTrips(req);
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
  notEqualsList?: string[];
  fieldMaskList?: string[];
  isActive?: boolean;
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
    notEqualsList,
    fieldMaskList,
    isActive,
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
  if (fieldMaskList) {
    req.setFieldMaskList(fieldMaskList);
  }
  if (isActive) {
    req.setIsActive(1);
    req.addFieldMask('isActive');
  }
  if (!isActive) {
    req.setIsActive(0);
    req.addFieldMask('isActive');
  }
  p.setIsActive(1);
  if (pendingBilling) {
    req.setLogJobStatus('Completed');
    req.setLogPaymentStatus('Pending');
  }
  if (notEqualsList) {
    req.setNotEqualsList(notEqualsList);
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
  if (page === -1) {
    req.setWithoutLimit(true);
  } else {
    req.setPageNumber(page);
  }
  const results = [];
  const response = await EventClientService.BatchGet(req);
  const totalCount = response.getTotalCount();
  const resultsList = response.getResultsList().map(item => item.toObject());
  return { resultsList, totalCount };
};

export const loadProjects = async () => {
  const req = new Event();
  req.setNotEqualsList(['DepartmentId']);
  req.setPageNumber(0);
  req.setOrderBy('date_started');
  req.setOrderDir('ASC');
  req.setWithoutLimit(true);
  const response = await EventClientService.BatchGet(req);
  const resultsList = response.getResultsList().map(item => item.toObject());
  return resultsList;
};

export const loadEventById = async (eventId: number) => {
  return await EventClientService.loadEvent(eventId);
};

export const loadEventsByFilterDeleted = async ({
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
    notEqualsList,
    fieldMaskList,
  } = filter;
  console.log({ filter });
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
  if (fieldMaskList) {
    req.setFieldMaskList(['IsActive']);
  }

  req.setPageNumber(page === -1 ? 0 : page);
  if (pendingBilling) {
    req.setLogJobStatus('Completed');
    req.setLogPaymentStatus('Pending');
  }
  if (notEqualsList) {
    req.setNotEqualsList(notEqualsList);
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
      console.log('We set date started');
      req.setDateStarted(`%${dateStarted}%`);
    }
    if (dateEnded) {
      console.log('We set date ended');
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
    console.log('We got a buisiness name');
    u.setBusinessname(`%${businessname}%`);
  }
  //console.log({ u });
  //console.log({ p });
  req.setProperty(p);
  req.setCustomer(u);
  console.log({ req });
  const results = [];
  const response = await EventClientService.BatchGet(req);
  const totalCount = response.getTotalCount();
  const resultsList = response.getResultsList().map(item => item.toObject());
  results.push(...resultsList);
  return {
    results,
    totalCount,
  };
};
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
    console.log('Method name: ', methodName);
    //@ts-ignore
    req[methodName](data[fieldName]);
    fieldMaskList.push(upperCaseProp);
  }
  req.setFieldMaskList(fieldMaskList);
  console.log('Sending out');
  return await EventClientService[data.id ? 'Update' : 'Create'](req);
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

export const openFile = async (filename: string, bucket: string) => {
  const url = await S3ClientService.getFileS3BucketUrl(filename, bucket);
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

// Returns an object with the key being the per diem id of the relevant per diem and the
// value being the cost for lodging
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
    unique(zipCodes).map(zipCode =>
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
    const technicianIds: number[] = unique(
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
  SUBJECT_TAGS_TRANSACTIONS,
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
  loadJobTypeSubtypes,
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
  escapeText,
  newBugReport,
  newBugReportImage,
  forceHTTPS,
  customerCheck,
};
