const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
const KALOS_BOT = 'xoxb-213169303473-vMbrzzbLN8AThTm4JsXuw4iJ';

function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
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
    }
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
      `https://slack.com/api/users.list?token=${KALOS_BOT}`
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
  count = 0
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
  const [hourStr, minutes] = time.split(':');
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

function makeFakeRows(columns: number = 1, rows: number = 3) {
  return Array.from(Array(rows)).map(() =>
    Array.from(Array(columns)).map(() => ({ value: '' }))
  );
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
};
