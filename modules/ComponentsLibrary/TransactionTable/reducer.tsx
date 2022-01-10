import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { TransactionActivity } from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
import { RoleType } from '../Payroll';
import { OrderDir } from '../../../helpers';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';

export interface FilterType {
  departmentId: number;
  employeeId: number;
  week: string;
  jobNumber: number;
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

export type MergeDocuments = {
  document1: string;
  document2: string;
};
export type State = {
  transactionFilter: FilterType;
  transactions: SelectorParams[] | undefined;
  totalTransactions: number;
  transactionActivityLogs: TransactionActivity[];
  transactionToEdit: Transaction | undefined;
  transactionToDelete: Transaction | undefined;
  costCenterData: TransactionAccountList;
  loading: boolean;
  orderBy: string;
  openMerge: boolean;
  document1: string;
  document2: string;
  orderDir: OrderDir | undefined;
  costCenters: { label: string; value: number }[];
  changingPage: boolean;
  loaded: boolean;
  creatingTransaction: boolean;
  mergingTransaction: boolean;
  role: RoleType | undefined;
  accountsPayableAdmin: boolean;
  pendingSendNotificationForExistingTransaction: Transaction | undefined;
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
  notify: number;
  assignedEmployee: number | undefined;
  selectedTransactions: Transaction[];
  status: 'Accepted' | 'Rejected' | 'Accepted / Rejected';
  departments: TimesheetDepartment[];
  universalSearch: string | undefined;
  fileData: any | undefined;
  imageWaiverTypePopupOpen: boolean;
  imageWaiverTypeFormData: PopupType;
  transactionToSave: Transaction | undefined;
  imageNameToSave: string | undefined;
  openUploadPhotoTransaction: boolean;
  mergeDocumentAlert: string;
};

export type PopupType = {
  documentType: 'PickTicket' | 'Receipt' | 'Invoice';
  invoiceWaiverType: number;
};

export enum ACTIONS {
  SET_TRANSACTION_FILTER = 'setTransactionFilter',
  SET_TRANSACTIONS = 'setTransactions',
  SET_DELETE_FROM_LOCAL_LIST = 'setDeleteFromLocalList',
  SET_UPDATE_FROM_LOCAL_LIST = 'setUpdateFromLocalList',
  SET_TOTAL_TRANSACTIONS = 'setTotalTransactions',
  SET_TRANSACTION_ACTIVITY_LOGS = 'setTransactionActivityLogs',
  SET_TRANSACTION_TO_EDIT = 'setTransactionToEdit',
  SET_COST_CENTER_DATA = 'setCostCenterData',
  SET_LOADING = 'setLoading',
  SET_LOADED = 'setLoaded',
  SET_ORDER = 'setOrder',
  SET_PENDING_SEND_NOTIFICATION_FOR_EXISTING_TRANSACTION = 'setPendingSendNotificationForExistingTransaction',
  SET_MERGE_DOCUMENT_ALERT = 'setMergeDocumentAlert',
  SET_MERGE_DOCUMENT1 = 'setMergeDocument1',
  SET_MERGE_DOCUMENT2 = 'setMergeDocument2',
  SET_OPEN_MERGE = 'setOpenMerge',
  UPDATE_LOCAL_STATUS = 'updateLocalStatus',
  SET_CHANGING_PAGE = 'setChangingPage',
  SET_MERGING_TRANSACTION = 'setMergingTransaction',
  SET_SEARCHING = 'setSearching',
  SET_ROLE = 'setRole',
  SET_ACCOUNTS_PAYABLE_ADMIN = 'setAccountsPayableAdmin',
  SET_COST_CENTERS = 'setCostCenters',
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
  SET_NOTIFY = 'setNotify',
  SET_IMAGE_WAIVER_TYPE_POPUP_OPEN = 'setImageWaiverTypePopupOpen',
  SET_IMAGE_WAIVER_TYPE_FORM_DATA = 'setImageWaiverTypeFormData',
  SET_TRANSACTION_TO_SAVE = 'setTransactionToSave',
  SET_OPEN_UPLOAD_PHOTO_TRANSACTION = 'setOpenUploadPhotoTransaction',

  SET_IMAGE_NAME_TO_SAVE = 'setImageNameToSave',
}

export type Action =
  | { type: ACTIONS.SET_TRANSACTION_FILTER; data: FilterType }
  | { type: ACTIONS.SET_TRANSACTIONS; data: SelectorParams[] }
  | { type: ACTIONS.SET_TOTAL_TRANSACTIONS; data: number }
  | { type: ACTIONS.SET_TRANSACTION_ACTIVITY_LOGS; data: TransactionActivity[] }
  | { type: ACTIONS.SET_TRANSACTION_TO_EDIT; data: Transaction | undefined }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_NOTIFY; data: number }
  | {
      type: ACTIONS.SET_PENDING_SEND_NOTIFICATION_FOR_EXISTING_TRANSACTION;
      data: Transaction | undefined;
    }
  | {
      type: ACTIONS.UPDATE_LOCAL_STATUS;
      data: { transactionId: number; statusId: number };
    }
  | { type: ACTIONS.SET_CHANGING_PAGE; data: boolean }
  | { type: ACTIONS.SET_MERGING_TRANSACTION; data: boolean }
  | { type: ACTIONS.SET_SEARCHING; data: boolean }
  | { type: ACTIONS.SET_ROLE; data: RoleType }
  | { type: ACTIONS.SET_ACCOUNTS_PAYABLE_ADMIN; data: boolean }
  | { type: ACTIONS.SET_CREATING_TRANSACTION; data: boolean }
  | {
      type: ACTIONS.SET_ORDER;
      data: { orderBy: string; orderDir: OrderDir | undefined };
    }
  | { type: ACTIONS.SET_EMPLOYEES; data: User[] }
  | { type: ACTIONS.SET_DELETE_FROM_LOCAL_LIST; data: Transaction }
  | { type: ACTIONS.SET_UPDATE_FROM_LOCAL_LIST; data: Transaction }
  | { type: ACTIONS.SET_PENDING_UPLOAD_PHOTO; data: Transaction | undefined }
  | { type: ACTIONS.SET_PAGE; data: number }
  | { type: ACTIONS.SET_MERGE_DOCUMENT_ALERT; data: string }
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
      type: ACTIONS.SET_COST_CENTERS;
      data: { label: string; value: number }[];
    }
  | {
      type: ACTIONS.SET_OPEN_MERGE;
      data: boolean;
    }
  | {
      type: ACTIONS.SET_MERGE_DOCUMENT1;
      data: string;
    }
  | {
      type: ACTIONS.SET_MERGE_DOCUMENT2;
      data: string;
    }
  | {
      type: ACTIONS.SET_COST_CENTER_DATA;
      data: TransactionAccountList;
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
      type: ACTIONS.SET_OPEN_UPLOAD_PHOTO_TRANSACTION;
      data: boolean;
    }
  | {
      type: ACTIONS.SET_IMAGE_NAME_TO_SAVE;
      data: string | undefined;
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTION_FILTER: {
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
    case ACTIONS.SET_MERGE_DOCUMENT_ALERT: {
      return {
        ...state,
        mergeDocumentAlert: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_ACTIVITY_LOGS: {
      return {
        ...state,
        transactionActivityLogs: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_TO_EDIT: {
      return {
        ...state,
        transactionToEdit: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.data,
      };
    }

    case ACTIONS.SET_CREATING_TRANSACTION: {
      return {
        ...state,
        creatingTransaction: action.data,
      };
    }
    case ACTIONS.SET_MERGING_TRANSACTION: {
      return {
        ...state,
        mergingTransaction: action.data,
      };
    }
    case ACTIONS.SET_ROLE: {
      return {
        ...state,
        role: action.data,
      };
    }
    case ACTIONS.SET_ACCOUNTS_PAYABLE_ADMIN: {
      return {
        ...state,
        accountsPayableAdmin: action.data,
      };
    }
    case ACTIONS.SET_ASSIGNING_USER: {
      return {
        ...state,
        assigningUser: action.data,
      };
    }
    case ACTIONS.SET_NOTIFY: {
      return {
        ...state,
        notify: action.data,
      };
    }
    case ACTIONS.SET_PENDING_SEND_NOTIFICATION_FOR_EXISTING_TRANSACTION: {
      return {
        ...state,
        pendingSendNotificationForExistingTransaction: action.data,
      };
    }
    case ACTIONS.SET_EMPLOYEES: {
      return {
        ...state,
        employees: action.data,
      };
    }
    case ACTIONS.SET_OPEN_MERGE: {
      return {
        ...state,
        openMerge: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENTS: {
      return {
        ...state,
        departments: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_TO_DELETE:
      return {
        ...state,
        transactionToDelete: action.data,
      };
    case ACTIONS.SET_SELECTED_TRANSACTIONS: {
      return {
        ...state,
        selectedTransactions: action.data,
      };
    }
    case ACTIONS.SET_PAGE: {
      return {
        ...state,
        page: action.data,
      };
    }
    case ACTIONS.SET_MERGE_DOCUMENT1: {
      console.log('we set document1');
      return {
        ...state,
        document1: action.data,
      };
    }
    case ACTIONS.SET_MERGE_DOCUMENT2: {
      console.log('we set document 2');
      return {
        ...state,
        document2: action.data,
      };
    }
    case ACTIONS.SET_ASSIGNED_EMPLOYEE: {
      return {
        ...state,
        assignedEmployee: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_STATUS: {
      return {
        ...state,
        status: action.data,
      };
    }
    case ACTIONS.SET_COST_CENTERS: {
      return {
        ...state,
        costCenters: action.data,
      };
    }
    case ACTIONS.SET_COST_CENTER_DATA: {
      console.log('setting cost center data ');
      return {
        ...state,
        costCenterData: action.data,
      };
    }
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_CHANGING_PAGE: {
      return {
        ...state,
        changingPage: action.data,
      };
    }
    case ACTIONS.SET_UNIVERSAL_SEARCH:
      return {
        ...state,
        universalSearch: action.data,
      };
    case ACTIONS.SET_SEARCHING:
      return {
        ...state,
        searching: action.data,
      };
    case ACTIONS.SET_ORDER:
      return {
        ...state,
        orderBy: action.data.orderBy,
        orderDir: action.data.orderDir,
      };
    case ACTIONS.SET_PENDING_UPLOAD_PHOTO:
      return {
        ...state,
        pendingUploadPhoto: action.data,
      };
    case ACTIONS.SET_DELETE_FROM_LOCAL_LIST: {
      console.log('delete from local list');
      if (state.transactions) {
        let temp = state.transactions!.filter(
          transaction => transaction.txn.getId() != action.data.getId(),
        );
        return {
          ...state,
          transactions: temp,
          totalTransactions: state.totalTransactions - 1,
        };
      } else {
        return { ...state };
      }
    }
    case ACTIONS.SET_UPDATE_FROM_LOCAL_LIST: {
      console.log('update from local list');
      if (state.transactions) {
        let temp = state.transactions.findIndex(
          transaction => transaction.txn.getId() === action.data.getId(),
        );
        let newTransactions = state.transactions;
        newTransactions[temp].txn = action.data;
        return {
          ...state,
          transactions: newTransactions,
        };
      } else {
        return { ...state };
      }
    }
    case ACTIONS.UPDATE_LOCAL_STATUS: {
      console.log('update from local list');
      if (state.transactions) {
        let temp = state.transactions.findIndex(
          transaction => transaction.txn.getId() === action.data.transactionId,
        );
        let newTransactions = state.transactions;
        newTransactions[temp].txn.setStatusId(action.data.statusId);
        return {
          ...state,
          transactions: newTransactions,
        };
      } else {
        return { ...state };
      }
    }

    case ACTIONS.SET_FILE_DATA:
      return { ...state, fileData: action.data };
    case ACTIONS.SET_IMAGE_WAIVER_TYPE_POPUP_OPEN:
      return { ...state, imageWaiverTypePopupOpen: action.data };
    case ACTIONS.SET_IMAGE_WAIVER_TYPE_FORM_DATA:
      return { ...state, imageWaiverTypeFormData: action.data };
    case ACTIONS.SET_TRANSACTION_TO_SAVE:
      return { ...state, transactionToSave: action.data };
    case ACTIONS.SET_IMAGE_NAME_TO_SAVE:
      return { ...state, imageNameToSave: action.data };
    case ACTIONS.SET_OPEN_UPLOAD_PHOTO_TRANSACTION:
      console.log('setting upload photo');
      return { ...state, openUploadPhotoTransaction: action.data };
    default:
      return state;
  }
};
