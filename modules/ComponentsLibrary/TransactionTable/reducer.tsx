import { EmailConfig } from '@kalos-core/kalos-rpc/Email';
import {
  Transaction,
  TransactionList,
} from '@kalos-core/kalos-rpc/Transaction';
import { TransactionAccountList } from '@kalos-core/kalos-rpc/TransactionAccount';
import {
  TransactionActivity,
  TransactionActivityClient,
} from '@kalos-core/kalos-rpc/TransactionActivity';
import { User } from '@kalos-core/kalos-rpc/User';
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
  loading: boolean;
};
export type Action =
  | { type: 'setFilter'; data: FilterType }
  | { type: 'setTransactions'; data: SelectorParams[] }
  | { type: 'setTotalTransactions'; data: number }
  | { type: 'setTransactionActivityLogs'; data: TransactionActivity[] }
  | { type: 'setTransactionToEdit'; data: Transaction | undefined }
  | { type: 'setLoading'; data: boolean };

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
    default:
      return state;
  }
};
