import { Property } from '@kalos-core/kalos-rpc/Property';

export type State = {
  isLoaded: boolean;
  propertiesSelected: Property[];
  propertiesLoaded: Property[]; // Loaded by user id
  error: boolean; // Is this in an error state?
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_PROPERTIES_SELECTED = 'setPropertiesSelected',
  SET_PROPERTIES_LOADED = 'setPropertiesLoaded',
  SET_ERROR = 'setError',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | {
      type: ACTIONS.SET_PROPERTIES_SELECTED;
      data: Property[];
    }
  | {
      type: ACTIONS.SET_PROPERTIES_LOADED;
      data: Property[];
    }
  | {
      type: ACTIONS.SET_ERROR;
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
    case ACTIONS.SET_PROPERTIES_SELECTED: {
      return {
        ...state,
        propertiesSelected: action.data,
      };
    }
    case ACTIONS.SET_PROPERTIES_LOADED: {
      return {
        ...state,
        propertiesLoaded: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    default:
      return state;
  }
};
