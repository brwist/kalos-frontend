import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { Property } from '@kalos-core/kalos-rpc/Property';

export type State = {
  isLoaded: boolean;
  contractData: Contract;
  propertiesSelected: Property[] | undefined;
  isValidating: boolean;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_CONTRACT_DATA = 'setContractData',
  SET_PROPERTIES_SELECTED = 'setPropertiesSelected',
  SET_VALIDATING = 'setValidating',
}

export enum FREQUENCIES {
  SEMIANNUAL = 'Semi-Annual',
  ANNUAL = 'Annual',
  MONTHLY = 'Monthly',
  BIMONTHLY = 'Bi-Monthly',
  QUARTERLY = 'Quarterly',
}

export enum BILLING_OPTIONS {
  SITE = 'Site',
  GROUP = 'Group',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | {
      type: ACTIONS.SET_CONTRACT_DATA;
      data: Contract;
    }
  | {
      type: ACTIONS.SET_PROPERTIES_SELECTED;
      data: Property[] | undefined;
    }
  | {
      type: ACTIONS.SET_VALIDATING;
      data: boolean;
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
    case ACTIONS.SET_PROPERTIES_SELECTED: {
      return {
        ...state,
        propertiesSelected: action.data,
      };
    }
    case ACTIONS.SET_VALIDATING: {
      return {
        ...state,
        isValidating: action.data,
      };
    }
    default:
      return state;
  }
};
