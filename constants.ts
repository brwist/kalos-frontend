import { Options } from './modules/ComponentsLibrary/Field';

export const MEALS_RATE = 59;

export const MAX_PAGES = 20;
export const WaiverTypes = [
  { label: 'Final Waiver', value: 2 },
  { label: 'Partial Waiver', value: 3 },
  { label: 'Waiver On File', value: 4 },
  { label: 'No Waiver Required', value: 5 },
];
export const APP_URL = 'https://app.kalosflorida.com/';
export const BASE_URL = `${APP_URL}index.cfm`;

export const OPTION_BLANK = '-- Select --';
export const OPTION_ALL = '-- All --';

export const LOG_IMAGE_BUCKET = 'project-log-images';

export const CREDIT_CARD_ACCOUNTS = [
  'Capital One (1974)',
  'Capital One (1440)',
];

export const PROP_LEVEL = 'Used for property-level billing only';
export const INTERNAL_DOCUMENTS_BUCKET = 'kalos-internal-docs';

export const JOB_STATUS_LIST = [
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
];

export const EVENT_STATUS_LIST = [...JOB_STATUS_LIST, 'Admin Review'];

export const BILLING_STATUS_TYPE_LIST = [
  'Pending',
  'Billed',
  'Cancelled',
  'Paid',
  'Charity',
];

export const NOTIFICATIONS_STATUS_TYPE_LIST = ['Deletions only'];

export const SPIFF_KIND_TYPE_LIST = ['Monthly', 'Weekly'];

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

export const SIGNATURE_PAYMENT_TYPE_LIST: Options = [
  'Credit Card',
  'Cash',
  'Check',
  'Paypal',
];

export const PAYMENT_COLLECTED_LIST: Options = [
  'Credit Card',
  'Financing (Complete)',
  'Cash',
  'Check',
  'PayPal',
  'ACH Transfer',
  'Pre-Paid',
  'Charity',
];
export const PAYMENT_STATUS_LIST: Options = [
  'Paid',
  'Pending',
  'Billed',
  'Cancelled',
];

export const PAYMENT_NOT_COLLECTED_LIST: Options = [
  'Billing',
  'Credit Card',
  'Financing (Complete)',
  'AOR Warranty',
  'Service Warranty',
  'No Charge',
  'Pre-Paid',
  'Charity',
];

export const DUMMY_USER = 'test';
export const DUMMY_PWD = 'test';

export const CHART_COLORS = {
  blue: 'rgb(51, 102, 204)',
  red: 'rgb(220, 57, 18)',
  orange: 'rgb(255, 153, 0)',
  green: 'rgb(16, 150, 24)',
  purple: 'rgb(153, 0, 153)',
};

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

export const SERVICE_STATUSES = {
  NO_STATUS: '',
  ENROUTE: 'Enroute',
  ON_CALL: 'On Call',
  SIGNATURE: 'Signature',
  PAYMENT: 'Payment',
  COMPLETED: 'Completed',
  INCOMPLETE: 'Incomplete',
  ADMIN: 'Admin',
  SIGNED_AS: 'signed as',
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

export const PROJECT_TASK_STATUS_COLORS: { [key: number]: string } = {
  1: '#efc281',
  2: '#88edb3',
  3: '#999',
  4: '#55e552',
  5: '#e1e1e1',
  6: '#07ccec',
  7: '#fefdb9',
  8: '#fd9834',
  9: '#789abc',
};

export const ELEVATION = {
  card: '0px 1px 2px #00000052',
  button: '0px 2px 4px #00000052',
  menu: '0px 4px 8px #00000052',
  card2: '0px 8px 16px #00000052',
  popover: '0px 16px 24px #00000052',
  modals: '0px 20px 32px #00000052',
};

export const ENDPOINT = 'https://dev-core.kalosflorida.com';

export const QUOTE_PART_AVAILABILITY: { [key: number]: string } = {
  1: 'local',
  2: 'next day',
  3: '3-7 days',
  4: 'more than a week',
  5: 'Truck Stock',
};

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

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const NULL_TIME = '0001-01-01 00:00:00';
export const EMPTY_VALUES = [0, '', NULL_TIME];
export const PERMISSION_PRIVILEGE = 'privilege';
export const PERMISSION_ROLE = 'role';
export const PERMISSION_DEPARTMENT = 'department';
export const PERMISSION_NAME_MANAGER = 'Manager';

export const IRS_SUGGESTED_MILE_FACTOR = 0.585; // $0.56 a mile

export default {
  IRS_SUGGESTED_MILE_FACTOR,
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
  SERVICE_STATUSES,
  QUOTE_PART_AVAILABILITY,
  SIGNATURE_PAYMENT_TYPE_LIST,
  PAYMENT_COLLECTED_LIST,
  PAYMENT_NOT_COLLECTED_LIST,
  OPTION_BLANK,
  CHART_COLORS,
  MONTHS,
  PERMISSION_PRIVILEGE,
  PERMISSION_ROLE,
  EMPTY_VALUES,
  PERMISSION_DEPARTMENT,
};
