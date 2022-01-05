import { SpiffType, TaskEventData } from '@kalos-core/kalos-rpc/Task';

export type State = {
  isLoaded: boolean;
  error: string | undefined;
  spiffTypes: SpiffType[];
  saving: boolean;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_SPIFF_TYPES = 'setSpiffTypes',
  SET_SAVING = 'setSaving',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_SAVING; data: boolean }
  | { type: ACTIONS.SET_SPIFF_TYPES; data: SpiffType[] }
  | { type: ACTIONS.SET_ERROR; data: string | undefined };

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
    case ACTIONS.SET_SAVING: {
      return {
        ...state,
        saving: action.data,
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
