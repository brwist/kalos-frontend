const BASE_URL = 'https://app.kalosflorida.com/index.cfm';
function cfURL(action: string, qs = '') {
  return `${BASE_URL}?action=admin:${action}${qs}`;
}

export { cfURL, BASE_URL };
