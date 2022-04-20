import { SpiffType, Task } from '../../../../@kalos-core/kalos-rpc/Task';

export type State = {
  loading: boolean;
  loaded: boolean;
  page: number;
  count: number;
  entries: Task[];
  deleting: Task | undefined;
  edited: Task | undefined;
  status: number | undefined;
  spiffTypes: {
    [key: number]: SpiffType;
  };
};

export enum ACTIONS {
  SET_LOADING = 'setLoading',
  SET_LOADED = 'setLoaded',
  SET_PAGE = 'setPage',
  SET_COUNT = 'setCount',
  SET_ENTRIES = 'setEntries',
  SET_DELETING = 'setDeleting',
  SET_EDITED = 'setEdited',
  SET_STATUS = 'setStatus',
  SET_SPIFF_TYPES = 'setSpiffTypes',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_PAGE; data: number }
  | { type: ACTIONS.SET_COUNT; data: number }
  | { type: ACTIONS.SET_ENTRIES; data: Task[] }
  | { type: ACTIONS.SET_DELETING; data: Task | undefined }
  | { type: ACTIONS.SET_EDITED; data: Task | undefined }
  | { type: ACTIONS.SET_STATUS; data: number | undefined }
  | {
      type: ACTIONS.SET_SPIFF_TYPES;
      data: {
        [key: number]: SpiffType;
      };
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_PAGE: {
      return {
        ...state,
        page: action.data,
      };
    }
    case ACTIONS.SET_COUNT: {
      return {
        ...state,
        count: action.data,
      };
    }
    case ACTIONS.SET_ENTRIES: {
      return {
        ...state,
        entries: action.data,
      };
    }
    case ACTIONS.SET_EDITED: {
      return {
        ...state,
        edited: action.data,
      };
    }
    case ACTIONS.SET_DELETING: {
      return {
        ...state,
        deleting: action.data,
      };
    }
    case ACTIONS.SET_STATUS: {
      return {
        ...state,
        status: action.data,
      };
    }
    case ACTIONS.SET_SPIFF_TYPES: {
      return {
        ...state,
        spiffTypes: action.data,
      };
    }
    default:
      return state;
  }
};
