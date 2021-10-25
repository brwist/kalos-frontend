import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
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
  contractEvents: Event[]; // Corresponding event for the contract that must be kept in sync with updates
  jobTypes: JobType[];
  jobSubtypes: JobSubtype[];
  jobTypeSubtypes: JobTypeSubtype[];
  eventPage: number; // Page for the current event to display
  initiatedSchema: string[];
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
  SET_CONTRACT_EVENTS = 'setContractEvents',
  SET_JOB_TYPES = 'setJobTypes',
  SET_JOB_SUBTYPES = 'setJobSubtypes',
  SET_JOB_TYPE_SUBTYPES = 'setJobTypeSubtypes',
  SET_EVENT_PAGE = 'setEventPage',
  SET_INITIATED_SCHEMA = 'setInitiatedSchema',
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
      type: ACTIONS.SET_CONTRACT_EVENTS;
      data: Event[];
    }
  | {
      type: ACTIONS.SET_JOB_TYPES;
      data: JobType[];
    }
  | {
      type: ACTIONS.SET_JOB_TYPE_SUBTYPES;
      data: JobTypeSubtype[];
    }
  | {
      type: ACTIONS.SET_JOB_SUBTYPES;
      data: JobSubtype[];
    }
  | {
      type: ACTIONS.SET_EVENT_PAGE;
      data: number;
    }
  | {
      type: ACTIONS.SET_INITIATED_SCHEMA;
      data: string[];
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
    case ACTIONS.SET_CONTRACT_EVENTS: {
      return {
        ...state,
        contractEvents: action.data,
      };
    }
    case ACTIONS.SET_JOB_TYPES: {
      return {
        ...state,
        jobTypes: action.data,
      };
    }
    case ACTIONS.SET_JOB_SUBTYPES: {
      return {
        ...state,
        jobSubtypes: action.data,
      };
    }
    case ACTIONS.SET_JOB_TYPE_SUBTYPES: {
      return {
        ...state,
        jobTypeSubtypes: action.data,
      };
    }
    case ACTIONS.SET_EVENT_PAGE: {
      return {
        ...state,
        eventPage: action.data,
      };
    }
    case ACTIONS.SET_INITIATED_SCHEMA: {
      return {
        ...state,
        initiatedSchema: action.data,
      };
    }
    default:
      console.error(
        // @ts-expect-error
        `The supplied action type does not match any actions in the reducer: ${action.type}`,
      );
      return state;
  }
};
