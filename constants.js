"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.NULL_TIME = exports.WEEK_DAYS = exports.MONTHS = exports.RESIDENTIAL_OPTIONS = exports.API_FAILED_GENERAL_ERROR_MSG = exports.ROWS_PER_PAGE = exports.BILLING_TERMS_OPTIONS = exports.USA_STATES_OPTIONS = exports.QUOTE_PART_AVAILABILITY = exports.ENDPOINT = exports.ELEVATION = exports.PROJECT_TASK_STATUS_COLORS = exports.JOB_STATUS_COLORS = exports.SERVICE_STATUSES = exports.COLORS = exports.CHART_COLORS = exports.DUMMY_PWD = exports.DUMMY_USER = exports.PAYMENT_NOT_COLLECTED_LIST = exports.PAYMENT_COLLECTED_LIST = exports.SIGNATURE_PAYMENT_TYPE_LIST = exports.PAYMENT_TYPE_LIST = exports.SPIFF_KIND_TYPE_LIST = exports.NOTIFICATIONS_STATUS_TYPE_LIST = exports.BILLING_STATUS_TYPE_LIST = exports.EVENT_STATUS_LIST = exports.JOB_STATUS_LIST = exports.INTERNAL_DOCUMENTS_BUCKET = exports.PROP_LEVEL = exports.CREDIT_CARD_ACCOUNTS = exports.OPTION_ALL = exports.OPTION_BLANK = exports.BASE_URL = exports.APP_URL = exports.MAX_PAGES = exports.MEALS_RATE = void 0;
exports.MEALS_RATE = 35;
exports.MAX_PAGES = 20;
exports.APP_URL = 'https://app.kalosflorida.com/';
exports.BASE_URL = exports.APP_URL + "index.cfm";
exports.OPTION_BLANK = '-- Select --';
exports.OPTION_ALL = '-- All --';
exports.CREDIT_CARD_ACCOUNTS = [
    'Capital One (1974)',
    'Capital One (1440)',
];
exports.PROP_LEVEL = 'Used for property-level billing only';
exports.INTERNAL_DOCUMENTS_BUCKET = 'kalos-internal-docs';
exports.JOB_STATUS_LIST = [
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
exports.EVENT_STATUS_LIST = __spreadArrays(exports.JOB_STATUS_LIST, ['Admin Review']);
exports.BILLING_STATUS_TYPE_LIST = [
    'Pending',
    'Billed',
    'Cancelled',
    'Paid',
    'Charity',
];
exports.NOTIFICATIONS_STATUS_TYPE_LIST = ['Deletions only'];
exports.SPIFF_KIND_TYPE_LIST = ['Monthly', 'Weekly'];
exports.PAYMENT_TYPE_LIST = [
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
exports.SIGNATURE_PAYMENT_TYPE_LIST = [
    'Credit Card',
    'Cash',
    'Check',
    'Paypal',
];
exports.PAYMENT_COLLECTED_LIST = [
    'Credit Card',
    'Financing (Complete)',
    'Cash',
    'Check',
    'PayPal',
    'ACH Transfer',
    'Pre-Paid',
    'Charity',
];
exports.PAYMENT_NOT_COLLECTED_LIST = [
    'Billing',
    'Credit Card',
    'Financing (Complete)',
    'AOR Warranty',
    'Service Warranty',
    'No Charge',
    'Pre-Paid',
    'Charity',
];
exports.DUMMY_USER = 'test';
exports.DUMMY_PWD = 'test';
exports.CHART_COLORS = {
    blue: 'rgb(51, 102, 204)',
    red: 'rgb(220, 57, 18)',
    orange: 'rgb(255, 153, 0)',
    green: 'rgb(16, 150, 24)',
    purple: 'rgb(153, 0, 153)'
};
exports.COLORS = {
    light1: '#FAFAFC',
    light2: '#F2F2F5',
    light3: '#EBEBF0',
    dark1: '#8F90A6',
    dark2: '#555770',
    dark3: '#28293D',
    primary1: '#FF908A',
    primary2: '#FF453A',
    primary3: '#F20E00'
};
exports.SERVICE_STATUSES = {
    NO_STATUS: '',
    ENROUTE: 'Enroute',
    ON_CALL: 'On Call',
    SIGNATURE: 'Signature',
    PAYMENT: 'Payment',
    COMPLETED: 'Completed',
    INCOMPLETE: 'Incomplete',
    ADMIN: 'Admin',
    SIGNED_AS: 'signed as'
};
exports.JOB_STATUS_COLORS = {
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
    'Admin Review': 'e1e1e1'
};
exports.PROJECT_TASK_STATUS_COLORS = {
    1: '#efc281',
    2: '#88edb3',
    3: '#999',
    4: '#55e552',
    5: '#e1e1e1',
    6: '#07ccec',
    7: '#fefdb9',
    8: '#fd9834',
    9: '#789abc'
};
exports.ELEVATION = {
    card: '0px 1px 2px #00000052',
    button: '0px 2px 4px #00000052',
    menu: '0px 4px 8px #00000052',
    card2: '0px 8px 16px #00000052',
    popover: '0px 16px 24px #00000052',
    modals: '0px 20px 32px #00000052'
};
exports.ENDPOINT = 'https://core-dev.kalosflorida.com:8443';
exports.QUOTE_PART_AVAILABILITY = {
    1: 'local',
    2: 'next day',
    3: '3-7 days',
    4: 'more than a week',
    5: 'Truck Stock'
};
exports.USA_STATES_OPTIONS = [
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
exports.BILLING_TERMS_OPTIONS = [
    'COD',
    'Net 10',
    'Net 30',
    'Net 45',
    'Pre-paid',
];
exports.ROWS_PER_PAGE = 25;
exports.API_FAILED_GENERAL_ERROR_MSG = 'Error occured while performing this operation.';
exports.RESIDENTIAL_OPTIONS = [
    { label: 'Residential', value: 1 },
    { label: 'Commercial', value: 0 },
];
exports.MONTHS = [
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
exports.WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
exports.NULL_TIME = '0001-01-01 00:00:00';
exports["default"] = {
    BASE_URL: exports.BASE_URL,
    EVENT_STATUS_LIST: exports.EVENT_STATUS_LIST,
    DUMMY_PWD: exports.DUMMY_PWD,
    DUMMY_USER: exports.DUMMY_USER,
    PAYMENT_TYPE_LIST: exports.PAYMENT_TYPE_LIST,
    COLORS: exports.COLORS,
    ENDPOINT: exports.ENDPOINT,
    ELEVATION: exports.ELEVATION,
    USA_STATES_OPTIONS: exports.USA_STATES_OPTIONS,
    BILLING_TERMS_OPTIONS: exports.BILLING_TERMS_OPTIONS,
    ROWS_PER_PAGE: exports.ROWS_PER_PAGE,
    API_FAILED_GENERAL_ERROR_MSG: exports.API_FAILED_GENERAL_ERROR_MSG,
    RESIDENTIAL_OPTIONS: exports.RESIDENTIAL_OPTIONS,
    SERVICE_STATUSES: exports.SERVICE_STATUSES,
    QUOTE_PART_AVAILABILITY: exports.QUOTE_PART_AVAILABILITY,
    SIGNATURE_PAYMENT_TYPE_LIST: exports.SIGNATURE_PAYMENT_TYPE_LIST,
    PAYMENT_COLLECTED_LIST: exports.PAYMENT_COLLECTED_LIST,
    PAYMENT_NOT_COLLECTED_LIST: exports.PAYMENT_NOT_COLLECTED_LIST,
    OPTION_BLANK: exports.OPTION_BLANK,
    CHART_COLORS: exports.CHART_COLORS,
    MONTHS: exports.MONTHS
};
