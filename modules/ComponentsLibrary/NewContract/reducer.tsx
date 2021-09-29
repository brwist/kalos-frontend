import { Contract } from '@kalos-core/kalos-rpc/Contract';

export type State = {
  isLoaded: boolean;
  contractData: Contract;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_CONTRACT_DATA = 'setContractData',
}

export enum FREQUENCIES {
  SEMIANNUAL = 'Semi-Annual',
  ANNUAL = 'Annual',
  MONTHLY = 'Monthly',
  BIMONTHLY = 'Bi-Monthly',
  QUARTERLY = 'Quarterly',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | {
      type: ACTIONS.SET_CONTRACT_DATA;
      data: Contract;
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data,
      };
    }
    case ACTIONS.SET_CONTRACT_DATA: {
      return {
        ...state,
        contractData: action.data,
      };
    }
    default:
      return state;
  }
};
