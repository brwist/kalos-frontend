import { Options } from '../Form';

import { User } from '../../../@kalos-core/kalos-rpc/User';
import {
  PTO,
  TimeoffRequest,
} from '../../../@kalos-core/kalos-rpc/TimeoffRequest';
import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';
import { TimeoffRequestType } from '../../../@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import { TimesheetDepartment } from '../../../@kalos-core/kalos-rpc/TimesheetDepartment';

export type State = {
  initiated: boolean;
  deleting: boolean;
  deleted: boolean;
  saving: boolean;
  typeOptions: Options;
  requestTypes: TimeoffRequestType[];
  pto: PTO | undefined;
  user: User | undefined;
  openAlert: boolean;
  alertDismissed: boolean;
  upcomingRequests: TimeoffRequest[];
  ptoHistory: TimeoffRequest[];
  loggedUser: User | undefined;
  logData: ActivityLog[];
  formKey: number;
  error: string;
  data: TimeoffRequest;
  departments: TimesheetDepartment[];
};

export enum ACTIONS {
  SET_INITIATED = 'setInitiated',
  SET_DELETING = 'setDeleting',
  SET_DELETED = 'setDeleted',
  SET_SAVING = 'setSaving',
  SET_TYPE_OPTIONS = 'setTypeOptions',
  SET_REQUEST_TYPES = 'setRequestTypes',
  SET_PTO = 'setPto',
  SET_USER = 'setUser',
  SET_OPEN_ALERT = 'setOpenAlert',
  SET_ALERT_DISMISSED = 'setAlertDismissed',
  SET_UPCOMING_REQUESTS = 'setUpcomingRequests',
  SET_PTO_HISTORY = 'setPtoHistory',
  SET_LOGGED_USER = 'setLoggedUser',
  SET_LOG_DATA = 'setLogData',
  SET_FORM_KEY = 'setFormKey',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
  SET_DEPARTMENTS = 'setDepartments',
}

export type Action =
  | { type: ACTIONS.SET_INITIATED; data: boolean }
  | { type: ACTIONS.SET_DELETING; data: boolean }
  | { type: ACTIONS.SET_DELETED; data: boolean }
  | { type: ACTIONS.SET_SAVING; data: boolean }
  | { type: ACTIONS.SET_TYPE_OPTIONS; data: Options }
  | { type: ACTIONS.SET_REQUEST_TYPES; data: TimeoffRequestType[] }
  | { type: ACTIONS.SET_PTO; data: PTO }
  | { type: ACTIONS.SET_USER; data: User }
  | { type: ACTIONS.SET_OPEN_ALERT; data: boolean }
  | { type: ACTIONS.SET_DEPARTMENTS; data: TimesheetDepartment[] }
  | { type: ACTIONS.SET_ALERT_DISMISSED; data: boolean }
  | { type: ACTIONS.SET_UPCOMING_REQUESTS; data: TimeoffRequest[] }
  | { type: ACTIONS.SET_PTO_HISTORY; data: TimeoffRequest[] }
  | { type: ACTIONS.SET_LOGGED_USER; data: User }
  | { type: ACTIONS.SET_LOG_DATA; data: ActivityLog[] }
  | { type: ACTIONS.SET_FORM_KEY; data: number }
  | { type: ACTIONS.SET_ERROR; data: string }
  | { type: ACTIONS.SET_DATA; data: TimeoffRequest };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_INITIATED: {
      console.log('setting init');
      return {
        ...state,
        initiated: action.data,
      };
    }
    case ACTIONS.SET_DELETING: {
      console.log('setting deleting');
      return {
        ...state,
        deleting: action.data,
      };
    }
    case ACTIONS.SET_DELETED: {
      console.log('setting deleted');
      return {
        ...state,
        deleted: action.data,
      };
    }
    case ACTIONS.SET_SAVING: {
      console.log('setting saving');
      return {
        ...state,
        saving: action.data,
      };
    }
    case ACTIONS.SET_TYPE_OPTIONS: {
      console.log('setting type options');
      return {
        ...state,
        typeOptions: action.data,
      };
    }
    case ACTIONS.SET_REQUEST_TYPES: {
      console.log('setting request types');
      return {
        ...state,
        requestTypes: action.data,
      };
    }
    case ACTIONS.SET_PTO: {
      console.log('setting  pto');
      return {
        ...state,
        pto: action.data,
      };
    }
    case ACTIONS.SET_USER: {
      console.log('setting  user');
      return {
        ...state,
        user: action.data,
      };
    }
    case ACTIONS.SET_OPEN_ALERT: {
      console.log('setting request types');
      return {
        ...state,
        openAlert: action.data,
      };
    }
    case ACTIONS.SET_ALERT_DISMISSED: {
      console.log('setting alert Dismissed');
      return {
        ...state,
        alertDismissed: action.data,
      };
    }
    case ACTIONS.SET_UPCOMING_REQUESTS: {
      console.log('setting upcoming requests');
      return {
        ...state,
        upcomingRequests: action.data,
      };
    }
    case ACTIONS.SET_PTO_HISTORY: {
      console.log('setting pto history');
      return {
        ...state,
        ptoHistory: action.data,
      };
    }
    case ACTIONS.SET_LOGGED_USER: {
      console.log('setting logged user');
      return {
        ...state,
        loggedUser: action.data,
      };
    }
    case ACTIONS.SET_LOG_DATA: {
      console.log('setting log data');
      return {
        ...state,
        logData: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      console.log('setting error');
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_FORM_KEY: {
      console.log('setting form key');
      return {
        ...state,
        formKey: action.data,
      };
    }
    case ACTIONS.SET_DATA: {
      console.log('setting data');
      return {
        ...state,
        data: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENTS: {
      console.log('setting departments');
      return {
        ...state,
        departments: action.data,
      };
    }
    default:
      return state;
  }
};
