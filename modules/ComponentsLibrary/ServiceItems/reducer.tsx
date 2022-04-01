import { ServiceItem } from '../../../@kalos-core/kalos-rpc/ServiceItem';
import { Repair } from './index';
import { Material } from '../../../@kalos-core/kalos-rpc/Material';
export type State = {
  entries: ServiceItem[];
  materials: Material[];
  materialsIds: number[];
  repairs: Repair[];
  loadingMaterials: boolean;
  loaded: boolean;
  loading: boolean;
  error: boolean;
  deletingEntry: ServiceItem | undefined;
  editing: ServiceItem | undefined;
  saving: boolean;
  linkId: number | undefined;
  count: number;
  page: number;
  readingsDropdowns: { serviceItemId: number; active: number }[];
};

export enum ACTIONS {
  SET_SAVING = 'setSaving',
  SET_ENTRIES = 'setEntries',
  SET_MATERIALS = 'setMaterials',
  SET_MATERIALS_IDS = 'setMaterialIds',
  SET_REPAIRS = 'setRepairs',
  SET_LOADING_MATERIALS = 'setLoadingMaterials',
  SET_LOADED = 'setLoaded',
  SET_LOADING = 'setLoading',
  SET_DELETING_ENTRY = 'setDeletingEntry',
  SET_EDITING = 'setEditing',
  SET_ERROR = 'setError',
  SET_LINK_ID = 'setLinkId',
  SET_COUNT = 'setCount',
  SET_PAGE = 'setPage',
  SET_READINGS_DROPDOWNS = 'setReadingsDropdowns',
}

export type Action =
  | { type: ACTIONS.SET_SAVING; data: boolean }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_REPAIRS; data: Repair[] }
  | { type: ACTIONS.SET_ENTRIES; data: ServiceItem[] }
  | { type: ACTIONS.SET_MATERIALS; data: Material[] }
  | { type: ACTIONS.SET_MATERIALS_IDS; data: number[] }
  | { type: ACTIONS.SET_LOADING_MATERIALS; data: boolean }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_DELETING_ENTRY; data: ServiceItem | undefined }
  | { type: ACTIONS.SET_EDITING; data: ServiceItem | undefined }
  | { type: ACTIONS.SET_LINK_ID; data: number | undefined }
  | { type: ACTIONS.SET_COUNT; data: number }
  | { type: ACTIONS.SET_PAGE; data: number }
  | { type: ACTIONS.SET_ERROR; data: boolean }
  | {
      type: ACTIONS.SET_READINGS_DROPDOWNS;
      data: { serviceItemId: number; active: number }[];
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_SAVING: {
      return {
        ...state,
        saving: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_ENTRIES: {
      return {
        ...state,
        entries: action.data,
      };
    }
    case ACTIONS.SET_MATERIALS: {
      return {
        ...state,
        materials: action.data,
      };
    }
    case ACTIONS.SET_REPAIRS: {
      return {
        ...state,
        repairs: action.data,
      };
    }
    case ACTIONS.SET_MATERIALS_IDS: {
      return {
        ...state,
        materialsIds: action.data,
      };
    }
    case ACTIONS.SET_LOADING_MATERIALS: {
      return {
        ...state,
        loadingMaterials: action.data,
      };
    }
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_DELETING_ENTRY: {
      return {
        ...state,
        deletingEntry: action.data,
      };
    }
    case ACTIONS.SET_EDITING: {
      return {
        ...state,
        editing: action.data,
      };
    }
    case ACTIONS.SET_LINK_ID: {
      return {
        ...state,
        linkId: action.data,
      };
    }
    case ACTIONS.SET_COUNT: {
      return {
        ...state,
        count: action.data,
      };
    }
    case ACTIONS.SET_PAGE: {
      return {
        ...state,
        page: action.data,
      };
    }
    case ACTIONS.SET_READINGS_DROPDOWNS: {
      return {
        ...state,
        readingsDropdowns: action.data,
      };
    }
    default:
      return state;
  }
};
