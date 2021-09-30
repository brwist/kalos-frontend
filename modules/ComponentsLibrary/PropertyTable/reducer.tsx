import { Property } from '@kalos-core/kalos-rpc/Property';

export type State = {
  isLoaded: boolean;
  propertiesSelected: Property[];
  propertiesLoaded: Property[]; // Loaded by user id
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_PROPERTIES_SELECTED = 'setPropertiesSelected',
  SET_PROPERTIES_LOADED = 'setPropertiesLoaded',
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
    default:
      return state;
  }
};
