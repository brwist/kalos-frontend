import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Trip } from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Task } from '@kalos-core/kalos-rpc/Task';
import { TransactionAccount } from '@kalos-core/kalos-rpc/TransactionAccount';

export type State = {
  loading: boolean;
  loadingEvent: boolean;
  perDiems: PerDiem[];
  timesheets: TimesheetLine[];
  transactions: Transaction[];
  lodgings: { [key: number]: number };
  costCenterTotals: { [key: string]: number };
  transactionAccounts: TransactionAccount[];
  totalHoursWorked: number;
  loadedInit: boolean;
  event: Event | undefined;
  loaded: boolean;
  trips: Trip[];
  tripsTotal: number;
  tasks: Task[];
  dropDowns: { perDiemId: number; active: number }[];
  activeTab: string;
  costCenterDropDownActive: boolean;
  printStatus: 'idle' | 'loading' | 'loaded' | undefined;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_LOADING_EVENT = 'setLoadingEvent',
  SET_PER_DIEMS = 'setPerDiems',
  SET_TIMESHEETS = 'setTimesheets',
  SET_TRANSACTIONS = 'setTransactions',
  SET_LODGINGS = 'setLodgings',
  SET_TOTAL_HOURS_WORKED = 'setTotalHoursWorked',
  SET_LOADED_INIT = 'setLoadedInit',
  SET_EVENT = 'setEvent',
  SET_COST_CENTER_TOTALS = 'setCostCenterTotals',
  SET_LOADING = 'setLoading',
  SET_TRIPS = 'setTrips',
  SET_TRIPS_TOTAL = 'setTripsTotal',
  SET_TASKS = 'setTasks',
  SET_DROPDOWNS = 'setDropDowns',
  SET_COST_CENTER_DROPDOWN_ACTIVE = 'setCostCenterDropdownActive',
  SET_ACTIVE_TAB = 'setActiveTab',
  SET_PRINT_STATUS = 'setPrintStatus',
  SET_TRANSACTION_ACCOUNTS = 'setTransactionAccounts',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_LOADING_EVENT; data: boolean }
  | { type: ACTIONS.SET_PER_DIEMS; data: PerDiem[] }
  | { type: ACTIONS.SET_TIMESHEETS; data: TimesheetLine[] }
  | { type: ACTIONS.SET_TRANSACTIONS; data: Transaction[] }
  | { type: ACTIONS.SET_LODGINGS; data: { [key: number]: number } }
  | { type: ACTIONS.SET_COST_CENTER_TOTALS; data: { [key: string]: number } }
  | { type: ACTIONS.SET_TOTAL_HOURS_WORKED; data: number }
  | { type: ACTIONS.SET_LOADED_INIT; data: boolean }
  | { type: ACTIONS.SET_COST_CENTER_DROPDOWN_ACTIVE; data: boolean }
  | { type: ACTIONS.SET_EVENT; data: Event }
  | { type: ACTIONS.SET_TRIPS; data: Trip[] }
  | { type: ACTIONS.SET_TRANSACTION_ACCOUNTS; data: TransactionAccount[] }
  | { type: ACTIONS.SET_TRIPS_TOTAL; data: number }
  | {
      type: ACTIONS.SET_PRINT_STATUS;
      data: 'idle' | 'loading' | 'loaded' | undefined;
    }
  | { type: ACTIONS.SET_TASKS; data: Task[] }
  | { type: ACTIONS.SET_ACTIVE_TAB; data: string }
  | {
      type: ACTIONS.SET_DROPDOWNS;
      data: { perDiemId: number; active: number }[];
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_PER_DIEMS: {
      return {
        ...state,
        perDiems: action.data,
      };
    }
    case ACTIONS.SET_TIMESHEETS: {
      return {
        ...state,
        timesheets: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.data,
      };
    }
    case ACTIONS.SET_LODGINGS: {
      return {
        ...state,
        lodgings: action.data,
      };
    }
    case ACTIONS.SET_COST_CENTER_TOTALS: {
      return {
        ...state,
        costCenterTotals: action.data,
      };
    }
    case ACTIONS.SET_TRANSACTION_ACCOUNTS: {
      return {
        ...state,
        transactionAccounts: action.data,
      };
    }
    case ACTIONS.SET_TOTAL_HOURS_WORKED: {
      return {
        ...state,
        totalHoursWorked: action.data,
      };
    }
    case ACTIONS.SET_LOADED_INIT: {
      return {
        ...state,
        loadedInit: action.data,
      };
    }
    case ACTIONS.SET_EVENT: {
      return {
        ...state,
        event: action.data,
      };
    }
    case ACTIONS.SET_TRIPS: {
      return {
        ...state,
        trips: action.data,
      };
    }
    case ACTIONS.SET_TRIPS_TOTAL: {
      return {
        ...state,
        tripsTotal: action.data,
      };
    }
    case ACTIONS.SET_TASKS: {
      return {
        ...state,
        tasks: action.data,
      };
    }
    case ACTIONS.SET_DROPDOWNS: {
      return {
        ...state,
        dropDowns: action.data,
      };
    }
    case ACTIONS.SET_COST_CENTER_DROPDOWN_ACTIVE: {
      return {
        ...state,
        costCenterDropDownActive: action.data,
      };
    }
    case ACTIONS.SET_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.data,
      };
    }
    case ACTIONS.SET_PRINT_STATUS: {
      return {
        ...state,
        printStatus: action.data,
      };
    }
    default:
      return state;
  }
};
