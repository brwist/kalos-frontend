import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { EventClient, Event } from '@kalos-core/kalos-rpc/Event';
import { JobTypeClient, JobType } from '@kalos-core/kalos-rpc/JobType';
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
import { ENDPOINT } from './constants';

const UserClientService = new UserClient(ENDPOINT);
const PropertyClientService = new PropertyClient(ENDPOINT);
const EventClientService = new EventClient(ENDPOINT);
const JobTypeClientService = new JobTypeClient(ENDPOINT);
const JobSubtypeClientService = new JobSubtypeClient(ENDPOINT);
const JobTypeSubtypeClientService = new JobTypeSubtypeClient(ENDPOINT);
const ServicesRenderedClientService = new ServicesRenderedClient(ENDPOINT);
const StoredQuoteClientService = new StoredQuoteClient(ENDPOINT);
const QuotePartClientService = new QuotePartClient(ENDPOINT);
const QuoteLinePartClientService = new QuoteLinePartClient(ENDPOINT);
const QuoteLineClientService = new QuoteLineClient(ENDPOINT);

const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
const KALOS_BOT = 'xoxb-213169303473-vMbrzzbLN8AThTm4JsXuw4iJ';
const GOOGLE_MAPS_KEY = 'AIzaSyBufXfsM3nTanL9XsATgToVf5SgPkbWHkc';

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

  if (dateOnly) {
    return `${dateObj.getFullYear()}-${month}-${day}`;
  }
  return `${dateObj.getFullYear()}-${month}-${day} ${hour}:${minute}:00`;
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

function getMimeType(fileName: string) {
  const arr = fileName.split('.');
  const ext = arr[arr.length - 1];
  if (ext === 'pdf') {
    return 'application/pdf';
  } else if (ext === 'doc' || ext === 'docx') {
    return 'application/msword';
  } else if (ext === 'png') {
    return 'image/png';
  } else if (ext === 'jpg' || ext === 'jpeg') {
    return 'image/jpeg';
  }
}

/**
 *
 * @param time time in format HH:MM (ie. 16:30)
 * @returns format h:MMa (ie. 4:30AM)
 */
function formatTime(time: string) {
  const str = time.includes(' ') ? time.substr(11) : time;
  const [hourStr, minutes] = str.split(':');
  const hour = +hourStr;
  return (
    (hour > 12 ? hour - 12 : hour) + ':' + minutes + (hour < 12 ? 'AM' : 'PM')
  );
}

/**
 *
 * @param date date in format YYYY-MM-DD (ie. 2020-06-01)
 * @returns format M/D/YYYY (ie. 6/1/2020)
 */
function formatDate(date: string) {
  const [year, month, day] = date.substr(0, 10).split('-');
  return [+month, +day, +year].join('/');
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

/** Returns loaded Technicians
 * @returns User[]
 */
async function loadTechnicians() {
  const results: User.AsObject[] = [];
  const req = new User();
  req.setPageNumber(0);
  req.setIsActive(1);
  req.setIsEmployee(1);
  req.setIsSu(0);
  req.setServiceCalls(1);
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

/**
 * Returns loaded Events by property id
 * @param propertyId: property id
 * @returns Event[]
 */
async function loadEventsByPropertyId(propertyId: number) {
  const results: Event.AsObject[] = [];
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
async function loadUserById(id: number) {
  const req = new User();
  req.setId(id);
  req.setIsActive(1);
  return await UserClientService.Get(req);
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
  const users = await Promise.all(uniqueIds.map(loadUserById));
  return users.reduce((aggr, user) => ({ ...aggr, [user.id]: user }), {}) as {
    [key: number]: User.AsObject;
  };
}

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
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_KEY}`,
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
  } catch (e) {}
}

export {
  cfURL,
  BASE_URL,
  timestamp,
  getSlackList,
  getSlackID,
  slackNotify,
  getEditDistance,
  getURLParams,
  b64toBlob,
  getMimeType,
  formatTime,
  formatDate,
  makeFakeRows,
  getRPCFields,
  formatDateTime,
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
};
