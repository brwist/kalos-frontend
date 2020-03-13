import { Options } from './modules/ComponentsLibrary/Field';

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
export const PAYMENT_TYPE_LIST: Options = [
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

export const JOB_STATUS_COLORS: { [key: string]: string } = {
  Requested: 'efc281',
  Confirmed: 'fefdb9',
  Enroute: 'ffff00',
  'On Call': '88edb3',
  Delayed: '07ccec',
  Incomplete: 'bfd4ff',
  'Part on Order': 'aa93ea',
  'Pend Sched': 'fd9834',
  Canceled: 'e74c3c',
  Completed: '55e552',
  'Admin Review': 'e1e1e1',
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

export const USA_STATES_OPTIONS: Options = [
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

export const BILLING_TERMS_OPTIONS: Options = [
  'COD',
  'Net 10',
  'Net 30',
  'Net 45',
  'Pre-paid',
];

export const ROWS_PER_PAGE = 25;

export const API_FAILED_GENERAL_ERROR_MSG =
  'Error occured while performing this operation.';

export const RESIDENTIAL_OPTIONS: Options = [
  { label: 'Residential', value: 1 },
  { label: 'Commercial', value: 0 },
];

export default {
  BASE_URL,
  EVENT_STATUS_LIST,
  DUMMY_PWD,
  DUMMY_USER,
  PAYMENT_TYPE_LIST,
  COLORS,
  ENDPOINT,
  ELEVATION,
  USA_STATES_OPTIONS,
  BILLING_TERMS_OPTIONS,
  ROWS_PER_PAGE,
  API_FAILED_GENERAL_ERROR_MSG,
  RESIDENTIAL_OPTIONS,
};
