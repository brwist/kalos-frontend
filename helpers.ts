const { BASE_URL } = require('./constants');

function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
}

export { cfURL, BASE_URL };
