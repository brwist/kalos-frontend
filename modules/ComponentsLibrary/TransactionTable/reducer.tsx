import { EmailConfig } from '@kalos-core/kalos-rpc/Email';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  Transaction,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import { TransactionActivity } from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
import { FilterData, RoleType, AssignedUserData } from '../Payroll';

interface FilterType {
  departmentId: number;
  employeeId: number;
  week: string;
  vendor: string;
  isAccepted: boolean | undefined;
  isRejected: boolean | undefined;
  amount: number | undefined;
  billingRecorded: boolean;
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
  loadTransactions: boolean;
  creatingTransaction: boolean;
  mergingTransaction: boolean;
  role: RoleType | undefined;
  page: number;
  error: string | undefined;
  assigningUser:
    | {
        isAssigning: boolean;
        transactionId: number;
      }
    | undefined;
  employees: User[];
  assignedEmployee: number | undefined;
  selectedTransactions: Transaction[];
  status: 'Accepted' | 'Rejected' | 'Accepted / Rejected';
  departments: TimesheetDepartment[];
};
export type Action =
  | { type: 'setFilter'; data: FilterType }
  | { type: 'setTransactions'; data: SelectorParams[] }
  | { type: 'setTotalTransactions'; data: number }
  | { type: 'setTransactionActivityLogs'; data: TransactionActivity[] }
  | { type: 'setTransactionToEdit'; data: Transaction | undefined }
  | { type: 'setLoading'; data: boolean }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setChangingPage'; data: boolean }
  | { type: 'setLoadTransactions'; data: boolean }
  | { type: 'setMergingTransaction'; data: boolean }
  | { type: 'setRole'; data: RoleType }
  | { type: 'setCreatingTransaction'; data: boolean }
  | { type: 'setEmployees'; data: User[] }
  | { type: 'setPage'; data: number }
  | { type: 'setError'; data: string | undefined }
  | { type: 'setStatus'; data: 'Accepted' | 'Rejected' | 'Accepted / Rejected' }
  | { type: 'setDepartments'; data: TimesheetDepartment[] }
  | { type: 'setSelectedTransactions'; data: Transaction[] }
  | {
      type: 'setAssigningUser';
      data: {
        isAssigning: boolean;
        transactionId: number;
      };
    }
  | {
      type: 'setTransactionToDelete';
      data: Transaction | undefined;
    }
  | { type: 'setAssignedEmployee'; data: number | undefined };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setFilter': {
      return {
        ...state,
        transactionFilter: action.data,
      };
    }
    case 'setTransactions': {
      return {
        ...state,
        transactions: action.data,
      };
    }
    case 'setTotalTransactions': {
      return {
        ...state,
        totalTransactions: action.data,
      };
    }
    case 'setTransactionActivityLogs': {
      console.log(action.data);
      return {
        ...state,
        transactionActivityLogs: action.data,
      };
    }
    case 'setTransactionToEdit': {
      console.log('setting edit');
      return {
        ...state,
        transactionToEdit: action.data,
      };
    }
    case 'setLoading': {
      console.log('setting loading');
      return {
        ...state,
        loading: action.data,
      };
    }
    case 'setLoadTransactions': {
      console.log('setting loading transactions');
      return {
        ...state,
        loadTransactions: action.data,
      };
    }
    case 'setCreatingTransaction': {
      console.log('setting creating transactions');
      return {
        ...state,
        creatingTransaction: action.data,
      };
    }
    case 'setMergingTransaction': {
      console.log('setting merging transactions');
      return {
        ...state,
        mergingTransaction: action.data,
      };
    }
    case 'setRole': {
      console.log('setting role');
      return {
        ...state,
        role: action.data,
      };
    }
    case 'setAssigningUser': {
      console.log('setting assigning user');
      return {
        ...state,
        assigningUser: action.data,
      };
    }
    case 'setEmployees': {
      console.log('setting employees');
      return {
        ...state,
        employees: action.data,
      };
    }
    case 'setDepartments': {
      console.log('setting department');
      return {
        ...state,
        departments: action.data,
      };
    }
    case 'setTransactionToDelete':
      console.log('setting transaction to delete');
      // Filling
      return {
        ...state,
        transactionToDelete: action.data,
      };
    case 'setSelectedTransactions': {
      console.log('setting selected department');
      return {
        ...state,
        selectedTransactions: action.data,
      };
    }
    case 'setPage': {
      console.log('setting page');
      return {
        ...state,
        page: action.data,
      };
    }
    case 'setAssignedEmployee': {
      console.log('setting assigned Employee');
      return {
        ...state,
        assignedEmployee: action.data,
      };
    }
    case 'setError': {
      console.log('setting error ');
      return {
        ...state,
        error: action.data,
      };
    }
    case 'setStatus': {
      console.log('setting status ');
      return {
        ...state,
        status: action.data,
      };
    }
    case 'setLoaded': {
      console.log('setting loaded ');
      return {
        ...state,
        loaded: action.data,
      };
    }
    case 'setChangingPage': {
      console.log('setting changing page ');
      return {
        ...state,
        loaded: action.data,
      };
    }
    default:
      return state;
  }
};
