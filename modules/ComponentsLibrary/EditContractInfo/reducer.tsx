import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { Property } from '@kalos-core/kalos-rpc/Property';

export type State = {
  isLoaded: boolean;
  contractData: Contract;
  propertiesSelected: Property[] | undefined;
  isValidating: boolean;
  invoiceData: Invoice;
  isSaving: boolean;
  error: string | undefined;
  fatalError: boolean; // Contract does not exist, etc.
  invoiceId: number;
  contractEvent: Event; // Corresponding event for the contract that must be kept in sync with updates
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_CONTRACT_DATA = 'setContractData',
  SET_PROPERTIES_SELECTED = 'setPropertiesSelected',
  SET_VALIDATING = 'setValidating',
  SET_INVOICE_DATA = 'setInvoiceData',
  SET_SAVING = 'setSaving',
  SET_ERROR = 'setError',
  SET_FATAL_ERROR = 'setUnrecoverableError',
  SET_INVOICE_ID = 'setInvoiceId',
  SET_CONTRACT_EVENT = 'setContractEvent',
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
    }
  | {
      type: ACTIONS.SET_INVOICE_DATA;
      data: Invoice;
    }
  | {
      type: ACTIONS.SET_SAVING;
      data: boolean;
    }
  | {
      type: ACTIONS.SET_ERROR;
      data: string | undefined;
    }
  | {
      type: ACTIONS.SET_FATAL_ERROR;
      data: true; // Should only be set to true, not set to false. Wouldn't be very "fatal" otherwise
    }
  | {
      type: ACTIONS.SET_INVOICE_ID;
      data: number;
    }
  | {
      type: ACTIONS.SET_CONTRACT_EVENT;
      data: Event;
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
    case ACTIONS.SET_INVOICE_DATA: {
      return {
        ...state,
        invoiceData: action.data,
      };
    }
    case ACTIONS.SET_SAVING: {
      return {
        ...state,
        isSaving: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_FATAL_ERROR: {
      return {
        ...state,
        fatalError: action.data,
      };
    }
    case ACTIONS.SET_INVOICE_ID: {
      return {
        ...state,
        invoiceId: action.data,
      };
    }
    case ACTIONS.SET_CONTRACT_EVENT: {
      return {
        ...state,
        contractEvent: action.data,
      };
    }
    default:
      return state;
  }
};
