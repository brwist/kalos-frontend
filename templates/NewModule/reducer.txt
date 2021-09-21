export type State = {
    isLoaded: boolean;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data, 
      };
    }
    default:
      return state;
  }
};
