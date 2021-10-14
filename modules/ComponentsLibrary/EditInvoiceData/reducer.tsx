import { Invoice } from '@kalos-core/kalos-rpc/Invoice';

export type State = {
  isLoaded: boolean;
  invoiceData: Invoice;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_INVOICE_DATA = 'setInvoiceData',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_INVOICE_DATA; data: Invoice };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data,
      };
    }
    case ACTIONS.SET_INVOICE_DATA: {
      return {
        ...state,
        invoiceData: action.data,
      };
    }
    default:
      return state;
  }
};
