import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { TransactionActivity } from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
import { Modes } from '../InfoTable';
import { RoleType } from '../Payroll';

export interface FilterType {
  departmentId: number;
  employeeId: number;
  week: string;
  vendor: string;
  isAccepted: boolean | undefined;
  isRejected: boolean | undefined;
  amount: number | undefined;
  billingRecorded: boolean;
  universalSearch: string | undefined;
  processed: boolean;
}

type SelectorParams = {
  txn: Transaction;
  totalCount: number;
};
export type State = {
  transactionFilter: FilterType;
  transactions: SelectorParams[] | undefined;
  totalTransactions: number;
  transactionActivityLogs: TransactionActivity[];
  transactionToEdit: Transaction | undefined;
  transactionToDelete: Transaction | undefined;
  loading: boolean;
  changingPage: boolean;
  loaded: boolean;
  creatingTransaction: boolean;
  mergingTransaction: boolean;
  role: RoleType | undefined;
  page: number;
  error: string | undefined;
  pendingUploadPhoto: Transaction | undefined;
  assigningUser:
    | {
        isAssigning: boolean;
        transactionId: number;
      }
    | undefined;
  employees: User[];
  searching: boolean;
  assignedEmployee: number | undefined;
  selectedTransactions: Transaction[];
  status: 'Accepted' | 'Rejected' | 'Accepted / Rejected';
  departments: TimesheetDepartment[];
  universalSearch: string | undefined;
  infoTableMode: Modes;
  fileData: any | undefined;
  imageWaiverTypePopupOpen: boolean;
  imageWaiverTypeFormData: PopupType;
  transactionToSave: Transaction | undefined;
  imageNameToSave: string | undefined;
};

export type PopupType = {
  documentType: 'PickTicket' | 'Receipt' | 'Invoice';
  invoiceWaiverType: number;
};

export enum ACTIONS {
  SET_TRANSACTION_FILTER = 'setTransactionFilter',
  SET_TRANSACTIONS = 'setTransactions',
  SET_TOTAL_TRANSACTIONS = 'setTotalTransactions',
  SET_TRANSACTION_ACTIVITY_LOGS = 'setTransactionActivityLogs',
  SET_TRANSACTION_TO_EDIT = 'setTransactionToEdit',
  SET_LOADING = 'setLoading',
  SET_LOADED = 'setLoaded',
  SET_CHANGING_PAGE = 'setChangingPage',
  SET_MERGING_TRANSACTION = 'setMergingTransaction',
  SET_SEARCHING = 'setSearching',
  SET_ROLE = 'setRole',
  SET_CREATING_TRANSACTION = 'setCreatingTransaction',
  SET_EMPLOYEES = 'setEmployees',
  SET_PENDING_UPLOAD_PHOTO = 'setPendingUploadPhoto',
  SET_PAGE = 'setPage',
  SET_ERROR = 'setError',
  SET_STATUS = 'setStatus',
  SET_DEPARTMENTS = 'setDepartments',
  SET_SELECTED_TRANSACTIONS = 'setSelectedTransactions',
  SET_ASSIGNING_USER = 'setAssigningUser',
  SET_TRANSACTION_TO_DELETE = 'setTransactionToDelete',
  SET_ASSIGNED_EMPLOYEE = 'setAssignedEmployee',
  SET_UNIVERSAL_SEARCH = 'setUniversalSearch',
  SET_FILE_DATA = 'setFileData',
  SET_IMAGE_WAIVER_TYPE_POPUP_OPEN = 'setImageWaiverTypePopupOpen',
  SET_IMAGE_WAIVER_TYPE_FORM_DATA = 'setImageWaiverTypeFormData',
  SET_TRANSACTION_TO_SAVE = 'setTransactionToSave',
  SET_IMAGE_NAME_TO_SAVE = 'setImageNameToSave',
  SET_INFO_TABLE_MODE = 'setInfoTableMode',
}

export type Action =
  | { type: ACTIONS.SET_TRANSACTION_FILTER; data: FilterType }
  | { type: ACTIONS.SET_TRANSACTIONS; data: SelectorParams[] }
  | { type: ACTIONS.SET_TOTAL_TRANSACTIONS; data: number }
  | { type: ACTIONS.SET_TRANSACTION_ACTIVITY_LOGS; data: TransactionActivity[] }
  | { type: ACTIONS.SET_TRANSACTION_TO_EDIT; data: Transaction | undefined }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_CHANGING_PAGE; data: boolean }
  | { type: ACTIONS.SET_MERGING_TRANSACTION; data: boolean }
  | { type: ACTIONS.SET_SEARCHING; data: boolean }
  | { type: ACTIONS.SET_ROLE; data: RoleType }
  | { type: ACTIONS.SET_CREATING_TRANSACTION; data: boolean }
  | { type: ACTIONS.SET_EMPLOYEES; data: User[] }
  | { type: ACTIONS.SET_PENDING_UPLOAD_PHOTO; data: Transaction | undefined }
  | { type: ACTIONS.SET_PAGE; data: number }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | {
      type: ACTIONS.SET_STATUS;
      data: 'Accepted' | 'Rejected' | 'Accepted / Rejected';
    }
  | { type: ACTIONS.SET_DEPARTMENTS; data: TimesheetDepartment[] }
  | { type: ACTIONS.SET_SELECTED_TRANSACTIONS; data: Transaction[] }
  | {
      type: ACTIONS.SET_ASSIGNING_USER;
      data: {
        isAssigning: boolean;
        transactionId: number;
      };
    }
  | {
      type: ACTIONS.SET_TRANSACTION_TO_DELETE;
      data: Transaction | undefined;
    }
  | { type: ACTIONS.SET_ASSIGNED_EMPLOYEE; data: number | undefined }
  | {
      type: ACTIONS.SET_UNIVERSAL_SEARCH;
      data: string | undefined;
    }
  | {
      type: ACTIONS.SET_FILE_DATA;
      data: any;
    }
  | {
      type: ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN;
      data: boolean;
    }
  | {
      type: ACTIONS.SET_IMAGE_WAIVER_TYPE_FORM_DATA;
      data: PopupType;
    }
  | {
      type: ACTIONS.SET_TRANSACTION_TO_SAVE;
      data: Transaction | undefined;
    }
  | {
      type: ACTIONS.SET_IMAGE_NAME_TO_SAVE;
      data: string | undefined;
    }
  | {
      type: ACTIONS.SET_INFO_TABLE_MODE;
      data: Modes;
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTION_FILTER: {
      console.log('we got filter', action.data);
      return {
        ...state,
        transactionFilter: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.data,
      };
    }
    case ACTIONS.SET_TOTAL_TRANSACTIONS: {
      return {
        ...state,
        totalTransactions: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_ACTIVITY_LOGS: {
      console.log(action.data);
      return {
        ...state,
        transactionActivityLogs: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_TO_EDIT: {
      console.log('setting edit');
      return {
        ...state,
        transactionToEdit: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      console.log('setting loading');
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_CREATING_TRANSACTION: {
      console.log('setting creating transactions');
      return {
        ...state,
        creatingTransaction: action.data,
      };
    }
    case ACTIONS.SET_MERGING_TRANSACTION: {
      console.log('setting merging transactions');
      return {
        ...state,
        mergingTransaction: action.data,
      };
    }
    case ACTIONS.SET_ROLE: {
      console.log('setting role');
      return {
        ...state,
        role: action.data,
      };
    }
    case ACTIONS.SET_ASSIGNING_USER: {
      console.log('setting assigning user');
      return {
        ...state,
        assigningUser: action.data,
      };
    }
    case ACTIONS.SET_EMPLOYEES: {
      console.log('setting employees');
      return {
        ...state,
        employees: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENTS: {
      console.log('setting department');
      return {
        ...state,
        departments: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_TO_DELETE:
      console.log('setting transaction to delete');
      return {
        ...state,
        transactionToDelete: action.data,
      };
    case ACTIONS.SET_SELECTED_TRANSACTIONS: {
      console.log('setting selected department');
      return {
        ...state,
        selectedTransactions: action.data,
      };
    }
    case ACTIONS.SET_PAGE: {
      console.log('setting page');
      return {
        ...state,
        page: action.data,
      };
    }
    case ACTIONS.SET_ASSIGNED_EMPLOYEE: {
      console.log('setting assigned Employee');
      return {
        ...state,
        assignedEmployee: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      console.log('setting error ');
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_STATUS: {
      console.log('setting status ');
      return {
        ...state,
        status: action.data,
      };
    }
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_CHANGING_PAGE: {
      console.log('setting changing page ');
      return {
        ...state,
        changingPage: action.data,
      };
    }
    case ACTIONS.SET_UNIVERSAL_SEARCH:
      console.log('setting universal search');
      return {
        ...state,
        universalSearch: action.data,
      };
    case ACTIONS.SET_SEARCHING:
      console.log('setting searching');
      return {
        ...state,
        searching: action.data,
      };
    case ACTIONS.SET_PENDING_UPLOAD_PHOTO:
      console.log('setting pending upload:', action.data);
      console.log(action.data);
      return {
        ...state,
        pendingUploadPhoto: action.data,
      };
    case ACTIONS.SET_FILE_DATA:
      console.log('setting file data');
      return { ...state, fileData: action.data };
    case ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN:
      console.log('setting image waiver type popup open');
      return { ...state, imageWaiverTypePopupOpen: action.data };
    case ACTIONS.SET_IMAGE_WAIVER_TYPE_FORM_DATA:
      console.log('setting image waiver type form data');
      return { ...state, imageWaiverTypeFormData: action.data };
    case ACTIONS.SET_TRANSACTION_TO_SAVE:
      console.log('setting transaction to save');
      return { ...state, transactionToSave: action.data };
    case ACTIONS.SET_IMAGE_NAME_TO_SAVE:
      console.log('setting image name to save');
      return { ...state, imageNameToSave: action.data };
    case ACTIONS.SET_INFO_TABLE_MODE:
      console.log('setting info table mode');
      return { ...state, infoTableMode: action.data };
    default:
      return state;
  }
};
