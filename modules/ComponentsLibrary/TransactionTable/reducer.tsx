import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { TransactionActivity } from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
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
  loadTransactions: boolean;
  creatingTransaction: boolean;
  mergingTransaction: boolean;
  role: RoleType | undefined;
  assigningUser:
    | {
        isAssigning: boolean;
        transactionId: number;
      }
    | undefined;
  employees: User[];
  departments: TimesheetDepartment[];
  universalSearch: string | undefined;
};
export type Action =
  | { type: 'setFilter'; data: FilterType }
  | { type: 'setTransactions'; data: SelectorParams[] }
  | { type: 'setTotalTransactions'; data: number }
  | { type: 'setTransactionActivityLogs'; data: TransactionActivity[] }
  | { type: 'setTransactionToEdit'; data: Transaction | undefined }
  | { type: 'setLoading'; data: boolean }
  | { type: 'setLoadTransactions'; data: boolean }
  | { type: 'setMergingTransaction'; data: boolean }
  | { type: 'setRole'; data: RoleType }
  | { type: 'setCreatingTransaction'; data: boolean }
  | { type: 'setEmployees'; data: User[] }
  | { type: 'setDepartments'; data: TimesheetDepartment[] }
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
  | {
      type: 'setUniversalSearch';
      data: string | undefined;
    };

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
      return {
        ...state,
        transactionToDelete: action.data,
      };
    case 'setUniversalSearch':
      console.log('setting universal search');
      return {
        ...state,
        universalSearch: action.data,
      };
    default:
      return state;
  }
};
