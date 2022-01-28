import { SpiffType, Task } from '@kalos-core/kalos-rpc/Task';
import {
  SavedSignatureType,
  ServicesRenderedPaymentType,
  SignatureType,
  PaymentAndSignatureType,
  PaymentType,
} from './Services';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { EventClient, Quotable } from '@kalos-core/kalos-rpc/Event';

export type State = {
  paymentForm: PaymentAndSignatureType;
  viewPayment: PaymentType | undefined;
  viewSignature: SavedSignatureType | undefined;
  signatureForm: SignatureType;
  deleting: ServicesRendered | undefined;
  editing: ServicesRenderedPaymentType;
  serviceRenderedPayment: ServicesRenderedPaymentType;
  saving: boolean;
  changingStatus: boolean;
  pendingQuotable: Quotable[];
  pendingNewQuotable: Quotable[];
  openMaterials: boolean;
};

export enum ACTIONS {
  SET_PAYMENT_FORM = 'setPaymentForm',
  SET_VIEW_PAYMENT = 'setViewPayment',
  SET_VIEW_SIGNATURE = 'setViewSignature',
  SET_SIGNATURE_FORM = 'setSigatureForm',
  SET_DELETING = 'setDeleting',
  SET_SAVING = 'setSaving',
  SET_CHANGING_STATUS = 'setChangingStatus',
  SET_EDITING = 'setEditing',
  SET_SERVICE_RENDERED_PAYMENT = 'setServiceRenderedPayment',
  SET_PENDING_QUOTABLE = 'setPendingQuotable',
  SET_PENDING_NEW_QUOTABLE = 'setPendingNewQuotable',
  SET_OPEN_MATERIALS = 'setOpenMaterials',
}

export type Action =
  | {
      type: ACTIONS.SET_PAYMENT_FORM;
      data: PaymentAndSignatureType;
    }
  | { type: ACTIONS.SET_VIEW_PAYMENT; data: PaymentType | undefined }
  | { type: ACTIONS.SET_VIEW_SIGNATURE; data: SavedSignatureType | undefined }
  | { type: ACTIONS.SET_SIGNATURE_FORM; data: SignatureType }
  | { type: ACTIONS.SET_DELETING; data: ServicesRendered | undefined }
  | { type: ACTIONS.SET_CHANGING_STATUS; data: boolean }
  | { type: ACTIONS.SET_EDITING; data: ServicesRenderedPaymentType }
  | { type: ACTIONS.SET_PENDING_QUOTABLE; data: Quotable[] }
  | { type: ACTIONS.SET_OPEN_MATERIALS; data: boolean }
  | { type: ACTIONS.SET_PENDING_NEW_QUOTABLE; data: Quotable[] }
  | {
      type: ACTIONS.SET_SERVICE_RENDERED_PAYMENT;
      data: ServicesRenderedPaymentType;
    }
  | { type: ACTIONS.SET_SAVING; data: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_PAYMENT_FORM: {
      return {
        ...state,
        paymentForm: action.data,
      };
    }
    case ACTIONS.SET_VIEW_PAYMENT: {
      return {
        ...state,
        viewPayment: action.data,
      };
    }
    case ACTIONS.SET_OPEN_MATERIALS: {
      return {
        ...state,
        openMaterials: action.data,
      };
    }
    case ACTIONS.SET_SAVING: {
      return {
        ...state,
        saving: action.data,
      };
    }
    case ACTIONS.SET_VIEW_SIGNATURE: {
      return {
        ...state,
        viewSignature: action.data,
      };
    }
    case ACTIONS.SET_PENDING_QUOTABLE: {
      return {
        ...state,
        pendingQuotable: action.data,
      };
    }
    case ACTIONS.SET_PENDING_NEW_QUOTABLE: {
      return {
        ...state,
        pendingNewQuotable: action.data,
      };
    }
    case ACTIONS.SET_SIGNATURE_FORM: {
      return {
        ...state,
        signatureForm: action.data,
      };
    }
    case ACTIONS.SET_DELETING: {
      return {
        ...state,
        deleting: action.data,
      };
    }
    case ACTIONS.SET_CHANGING_STATUS: {
      return {
        ...state,
        changingStatus: action.data,
      };
    }
    case ACTIONS.SET_EDITING: {
      return {
        ...state,
        editing: action.data,
      };
    }
    case ACTIONS.SET_SERVICE_RENDERED_PAYMENT: {
      return {
        ...state,
        serviceRenderedPayment: action.data,
      };
    }
    default:
      return state;
  }
};
