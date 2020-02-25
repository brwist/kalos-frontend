export const BASE_URL = 'https://app.kalosflorida.com/index.cfm';

export const EVENT_STATUS_LIST = [
  'Requested',
  'Confirmed',
  'Enroute',
  'On Call',
  'Delayed',
  'Incomplete',
  'Part on Order',
  'Pend Sched',
  'Canceled',
  'Completed',
  'Admin Review',
];
export const PAYMENT_TYPE_LIST = [
  'Pre-Paid',
  'Cash',
  'Check',
  'Credit Card',
  'Paypal',
  'Billing',
  'Financing',
  'AOR Warranty',
  'Service Warranty',
  'Extended Warranty',
  'No Charge',
  'Account Transer',
  'Quote',
  'Charity',
];

export const DUMMY_USER = 'test';
export const DUMMY_PWD = 'test';

export const COLORS = {
  light1: '#FAFAFC',
  light2: '#F2F2F5',
  light3: '#EBEBF0',
  dark1: '#8F90A6',
  dark2: '#555770',
  dark3: '#28293D',
  primary1: '#FF908A',
  primary2: '#FF453A',
  primary3: '#F20E00',
};

export const ELEVATION = {
  card: '0px 1px 2px #00000052',
  button: '0px 2px 4px #00000052',
  menu: '0px 4px 8px #00000052',
  card2: '0px 8px 16px #00000052',
  popover: '0px 16px 24px #00000052',
  modals: '0px 20px 32px #00000052',
};

export const ENDPOINT = 'https://core-dev.kalosflorida.com:8443';

export const USA_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

export const BILLING_TERMS = ['COD', 'Net 10', 'Net 30', 'Net 45', 'Pre-paid'];

export default {
  BASE_URL,
  EVENT_STATUS_LIST,
  DUMMY_PWD,
  DUMMY_USER,
  PAYMENT_TYPE_LIST,
  COLORS,
  ENDPOINT,
  ELEVATION,
  USA_STATES,
  BILLING_TERMS,
};
