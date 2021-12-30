export type State = {
  isLoaded: boolean;
  error: string | undefined;
  invoiceHTML: string | undefined;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_INVOICE_HTML = 'setInvoiceHTML',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | {
      type: ACTIONS.SET_INVOICE_HTML;
      data: string | undefined;
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_INVOICE_HTML: {
      return {
        ...state,
        invoiceHTML: action.data,
      };
    }
    default:
      return state;
  }
};
