const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
const KALOS_BOT = 'xoxb-213169303473-vMbrzzbLN8AThTm4JsXuw4iJ';

function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
}

function timestamp() {
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
  console.log(jsonRes);
  const resString = JSON.stringify(jsonRes.members);
  localStorage.setItem('SLACK_USER_CACHE', resString);
  return jsonRes.members;
}

async function getSlackID(
  userName: string,
  skipCache = false,
): Promise<string> {
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
    return await getSlackID(userName, true);
  }
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

export { cfURL, BASE_URL, timestamp, getSlackList, getSlackID, slackNotify };
