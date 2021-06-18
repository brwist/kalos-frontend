import { parseISO } from 'date-fns/esm';
import { format, addMonths, addDays } from 'date-fns';
import {
  S3Client,
  URLObject,
  SUBJECT_TAGS,
  SUBJECT_TAGS_TRANSACTIONS,
} from '@kalos-core/kalos-rpc/S3File';
import { FileClient } from '@kalos-core/kalos-rpc/File';
import { ApiKeyClient, ApiKey } from '@kalos-core/kalos-rpc/ApiKey';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { JobTypeClient } from '@kalos-core/kalos-rpc/JobType';
import { TimeoffRequestClient } from '@kalos-core/kalos-rpc/TimeoffRequest';
import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';
import { TaskEvent, TaskEventClient } from '@kalos-core/kalos-rpc/TaskEvent';
import { TaskClient } from '@kalos-core/kalos-rpc/Task';
import { TaskAssignmentClient } from '@kalos-core/kalos-rpc/TaskAssignment';
import {
  ActivityLog,
  ActivityLogClient,
} from '@kalos-core/kalos-rpc/ActivityLog';
import {
  ReportClient,
  PromptPaymentReportLine,
  SpiffReportLine,
} from '@kalos-core/kalos-rpc/Report';
import { EmployeeFunctionClient } from '@kalos-core/kalos-rpc/EmployeeFunction';
import { JobSubtypeClient } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobTypeSubtypeClient } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { ServicesRenderedClient } from '@kalos-core/kalos-rpc/ServicesRendered';
import { StoredQuoteClient } from '@kalos-core/kalos-rpc/StoredQuote';
import { QuotePartClient } from '@kalos-core/kalos-rpc/QuotePart';
import { QuoteLinePartClient } from '@kalos-core/kalos-rpc/QuoteLinePart';
import { QuoteLineClient } from '@kalos-core/kalos-rpc/QuoteLine';
import { PerDiemClient } from '@kalos-core/kalos-rpc/PerDiem';
import { MapClient } from '@kalos-core/kalos-rpc/Maps';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { TimesheetDepartmentClient } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { TimesheetLineClient } from '@kalos-core/kalos-rpc/TimesheetLine';
import { MetricsClient } from '@kalos-core/kalos-rpc/Metrics';
import { SpiffToolAdminActionClient } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { GroupClient } from '@kalos-core/kalos-rpc/Group';
import { UserGroupLinkClient } from '@kalos-core/kalos-rpc/UserGroupLink';
import { TransactionDocumentClient } from '@kalos-core/kalos-rpc/TransactionDocument';
import { InternalDocumentClient } from '@kalos-core/kalos-rpc/InternalDocument';
import { PDFClient } from '@kalos-core/kalos-rpc/PDF';
import { DocumentClient } from '@kalos-core/kalos-rpc/Document';
import {
  ENDPOINT,
  MONTHS,
  OPTION_ALL,
  MAX_PAGES,
  BASE_URL,
  IRS_SUGGESTED_MILE_FACTOR,
} from './constants';
import { Option } from './modules/ComponentsLibrary/Field';
import {
  getRandomAge,
  getRandomDigit,
  getRandomName,
  getRandomLastName,
  getRandomDigits,
  getRandomNumber,
  randomize,
} from './modules/ComponentsLibrary/helpers';
import { Contract, ContractClient } from '@kalos-core/kalos-rpc/Contract';
export type TaskEventType = TaskEvent.AsObject & { technicianName?: string };

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
export const ApiKeyClientService = new ApiKeyClient(ENDPOINT);

export const getCFAppUrl = (action: string) => `${BASE_URL}?action=${action}`;

function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
}

/**
 *
 * @param number
 * @returns string as number with trailing zero, if number is less than 10
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
  const KALOS_BOT = await ApiKeyClientService.getKeyByKeyName('kalos_bot');
  await fetch(
    `https://slack.com/api/chat.postMessage?token=${KALOS_BOT}&channel=${id}&text=${text}`,
    {
      method: 'POST',
    },
  );
}

async function getSlackList(skipCache = false): Promise<SlackUser[]> {
  const KALOS_BOT = await ApiKeyClientService.getKeyByKeyName('kalos_bot');
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
  return (
    {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
    } as { [key: number]: string }
  )[new Date(datetime.substr(0, 10)).getDay()];
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
 *
 * @param datetime date in format YYYY-MM-DD HH:MM:SS (ie. 2020-06-01 15:28:31)
 * @returns format Day M/D/YYYY h:MMa (ie. Tue 6/1/2020)
 */
function formatDateDay(datetime: string) {
  return formatDay(datetime) + ', ' + formatDate(datetime);
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

export const loadProjectTaskBillableTypes = async () => {
  //const { resultsList } = (
  //  await TaskClientService.loadTaskBillableTypeList() // FIXME when available in rpc
  //).toObject();
  return ['Flat Rate', 'Hourly', 'Parts Run', 'Spiff', 'Tool Purchase'];
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
  req: Event;
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
  // FIXME move to event client
  page,
  filter: { dateStart, dateEnd, businessName, lastname },
  req,
}: LoadMetricsBySearchFilter) => {
  req.setFieldMaskList(['IsActive']);
  if (businessName && businessName != '') {
    const bReq = new Property();
    bReq.setBusinessname(businessName);
    const bResult = await PropertyClientService.Get(bReq);
    if (bReq) {
      req.setPropertyId(bResult.getId());
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
  const res = await EventClientService.BatchGet(req);
  return { resultsList: res.getResultsList(), totalCount: res.getTotalCount() };
};

export const loadCallbackReportByFilter = async ({
  //FIXME make this load real data, move to client
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

export const loadBillingAuditReport = async (startDate: string) => {
  //FIXME make this load real data, move to client
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
  //FIXME make this load real data, move to client
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
  //FIXME make this load real data, move to client
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
  //FIXME make this load real data, move to client
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
  // //FIXME make this load real data, move to client
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
  entries: PromptPaymentReportLine[];
};

export const loadPromptPaymentData = async (month: string) => {
  //FIXME finish implementation, move to reports client
  const req = new PromptPaymentReportLine();
  const date = `${month.replace('%', '01')} 00:00:00`;
  const startDate = format(addDays(new Date(date), -1), 'yyyy-MM-dd');
  const endDate = format(addMonths(new Date(date), 1), 'yyyy-MM-dd');
  req.setDateRangeList(['>', startDate, '<', endDate]);
  req.setDateTargetList(['log_billingDate', 'reportUntil']);
  const res = await ReportClientService.GetPromptPaymentData(req);
  const data: {
    [key: string]: PromptPaymentData;
  } = {};
  res.getDataList().forEach(entry => {
    const userId = entry.getUserId();
    const userBusinessName = entry.getUserBusinessName();
    const paymentTerms = entry.getPaymentTerms();
    const daysToPay = entry.getDaysToPay();
    const payable = entry.getPayable();
    const payed = entry.getPayed();
    const dueDate = entry.getDueDate();
    const paymentDate = entry.getPaymentDate();
    const possibleAward = entry.getPossibleAward();
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
  //FIXME finish this, move to report client
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
  const res = await ReportClientService.GetSpiffReportData(req);
  const data: {
    [key: string]: {
      spiffBonusTotal: number;
      items: SpiffReportLine[];
    };
  } = {};
  res.getDataList().forEach(item => {
    const employeeName = item.getEmployeeName();
    if (!data[employeeName]) {
      data[employeeName] = {
        spiffBonusTotal: 0,
        items: [],
      };
    }
    data[employeeName].items.push(item);
    data[employeeName].spiffBonusTotal += item.getAmount();
  });
  return data;
};

export type ActivityLogsSort = {
  orderByField: keyof ActivityLog | keyof User;
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
  //FIXME move to activity log client
  const { orderBy, orderDir, orderByField } = sort;
  const req = new ActivityLog();
  const u = new User();
  req.setUser(u);
  req.setOrderBy(cleanOrderByField(orderBy));
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
  const results: ActivityLog[] = [];
  const res = await ActivityLogClientService.BatchGet(req);
  results.push(...res.getResultsList());
  const totalCount = res.getTotalCount();
  const len = res.getResultsList().length;

  if (page === -1 && totalCount > len) {
    const batchesAmount = Math.min(
      MAX_PAGES,
      Math.ceil((totalCount - len) / len),
    );
    const batchResults = await Promise.all(
      Array.from(Array(batchesAmount)).map(async (_, idx) => {
        req.setPageNumber(idx + 1);
        return (await ActivityLogClientService.BatchGet(req)).getResultsList();
      }),
    );
    results.push(
      ...batchResults.reduce((aggr, item) => [...aggr, ...item], []),
    );
  }
  return { results, totalCount };
};

export type PropertiesSort = {
  orderByField: keyof Property;
  orderBy: string;
  orderDir: OrderDir;
};
export type ContractsSort = {
  orderByField: keyof Contract;
  orderBy: string;
  orderDir: OrderDir;
};
export type TripsSort = {
  orderByField: keyof Trip;
  orderBy: string;
  orderDir: OrderDir;
};
export type LoadPropertiesByFilter = {
  page: number;
  filter: PropertiesFilter;
  sort: PropertiesSort;
  req: Property;
};
export type LoadContractsByFilter = {
  page: number;
  filter: ContractsFilter;
  sort: ContractsSort;
  req: Contract;
};
export type LoadTripsByFilter = {
  page: number;
  filter: TripsFilter;
  sort: TripsSort;
  req: Trip;
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
  userId?: number;
};
export type TripsFilter = {
  id?: number;
  userId?: number;
  lastName?: string;
  originAddress?: string;
  destinationAddress?: string;
  weekof?: number[];
  page: number;
  payrollProcessed: boolean | undefined;
  approved: boolean | undefined;
  role?: string;
  departmentId?: number;
  dateProcessed?: string | undefined;
  isActive?: boolean;
  adminActionDate?: string;
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
  req,
}: LoadPropertiesByFilter) => {
  // FIXME move to property client
  const { orderBy, orderDir, orderByField } = sort;
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
    results: response.getResultsList().sort((a, b) => {
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
  req,
}: LoadContractsByFilter) => {
  // FIXME, move to contract client
  const { orderBy, orderDir, orderByField } = sort;
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
    results: response.getResultsList().sort((a, b) => {
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
  req,
}: LoadTripsByFilter) => {
  // FIXME move to trips client
  const { orderDir, orderByField } = sort;
  req.setPage(page);
  req.setIsActive(true);
  for (const fieldName in filter) {
    const value = filter[fieldName as keyof TripsFilter];

    const { methodName } = getRPCFields(fieldName);

    // @ts-ignore
    if (!req[methodName]) continue;

    //@ts-ignore
    req[methodName](typeof value === 'string' ? `%${value}%` : value);
  }

  if (filter.payrollProcessed == true) {
    req.setPayrollProcessed(false);
    req.addNotEquals('PayrollProcessed');
  }
  if (filter.payrollProcessed === false) {
    req.setPayrollProcessed(true);
    req.addNotEquals('PayrollProcessed');
  }
  if (filter.approved === false) {
    req.addNotEquals('Approved');
    req.setApproved(true);
  }

  if (filter.approved === true) {
    req.addNotEquals('Approved');
    req.setApproved(false);
  }

  try {
    const response = await PerDiemClientService.BatchGetTrips(req);
    return {
      results: response.getResultsList().sort((a, b) => {
        const A = (a[orderByField] || '').toString().toLowerCase();
        const B = (b[orderByField] || '').toString().toLowerCase();
        if (A < B) return orderDir === 'DESC' ? 1 : -1;
        if (A > B) return orderDir === 'DESC' ? -1 : 1;
        return 0;
      }),
      totalCount: response.getTotalCount(),
    };
  } catch (err) {
    throw new Error(`An error occurred while batch-getting trips: ${err}`) // To be caught at a higher call
  }
};

export type EventsSort = {
  orderByField: keyof Event | keyof Property | keyof User;
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
  req: Event;
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
  req,
}: LoadEventsByFilter) => {
  // FIXME, move to event client
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
  const p = new Property();
  const u = new User();
  if (orderByField === 'getLastname') {
    u.setOrderBy(cleanOrderByField(orderBy));
    u.setOrderDir(orderDir);
  } else if (orderByField === 'getAddress') {
    // FIXME - missing setOrderBy/setOrderDir in Property RPC
    // p.setOrderBy(orderBy);
    // p.setOrderDir(orderDir)
  } else {
    req.setOrderBy(cleanOrderByField(orderBy));
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
  const resultsList = response.getResultsList();
  return { resultsList, totalCount };
};

export const loadProjects = async () => {
  // FIXME move to event client
  const req = new Event();
  req.setNotEqualsList(['DepartmentId']);
  req.setPageNumber(0);
  req.setOrderBy('date_started');
  req.setOrderDir('ASC');
  req.setWithoutLimit(true);
  const response = await EventClientService.BatchGet(req);
  const resultsList = response.getResultsList();
  return resultsList;
};

export const loadEventById = async (eventId: number) => {
  // FIXME move to event client
  return await EventClientService.loadEvent(eventId);
};

export const loadEventsByFilterDeleted = async ({
  page,
  filter,
  sort,
  pendingBilling = false,
  req,
}: LoadEventsByFilter) => {
  // FIXME move to event client
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
  const { orderBy, orderDir, orderByField } = sort;
  const p = new Property();
  const u = new User();
  if (orderByField === 'getLastname') {
    u.setOrderBy(cleanOrderByField(orderBy));
    u.setOrderDir(orderDir);
  } else if (orderByField === 'getAddress') {
    // FIXME - missing setOrderBy/setOrderDir in Property RPC
    // p.setOrderBy(orderBy);
    // p.setOrderDir(orderDir)
  } else {
    req.setOrderBy(cleanOrderByField(orderBy));
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
  const resultsList = response.getResultsList();
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
  // FIXME move to s3 client
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
    const uploadRes = await fetch(urlRes.getUrl(), {
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

export const getCurrDate = () =>
  formatDate(new Date().toISOString()).replace(/\//g, '-');

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

// Returns an object with the key being the per diem id of the relevant per diem and the
// value being the cost for lodging

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
    const authString = `token ${key.getApiKey()}`;
    const postData = {
      method: 'POST',
      headers: {
        Authorization: authString,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    await fetch(key.getApiEndpoint(), postData);
  } catch (err) {
    console.log('error generating bug report', err);
  }
}

export type BugReportImage = {
  label: string;
  data: string;
  url?: string;
};

async function newBugReportImage(user: User, images: BugReportImage[]) {
  try {
    const timestamp = new Date().getTime();
    const client = new ApiKeyClient(ENDPOINT);
    const req = new ApiKey();
    req.setTextId('github_file_key');
    const key = await client.Get(req);
    const common = {
      message: 'bug report image',
      committer: {
        name: `${user.getFirstname()} ${user.getLastname()}`,
        email: user.getEmail(),
      },
    };
    const authString = `token ${key.getApiKey()}`;
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
          `${key.getApiEndpoint()}/images/${timestamp}/${img.label}`,
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
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.includes('local')
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
function customerCheck(user: User) {
  if (window.location.href.includes('admin') && user.getIsEmployee() === 0) {
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

const cleanOrderByField = (f: string) => {
  const parts = f.replace('get', '').split(/(?=[A-Z])/g);
  const lowerParts = parts.map(p => p.toLowerCase());
  return lowerParts.join('_');
};

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
  formatDateDay,
  formatDateTimeDay,
  makeFakeRows,
  getRPCFields,
  formatDateTime,
  range,
  trailingZero,
  roundNumber,
  getWeekOptions,
  escapeText,
  newBugReport,
  newBugReportImage,
  forceHTTPS,
  customerCheck,
  cleanOrderByField,
};
