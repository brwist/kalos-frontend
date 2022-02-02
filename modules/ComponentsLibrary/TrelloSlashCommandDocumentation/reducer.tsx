export type State = {
  isLoaded: boolean;
  error: string | undefined;
  commands: any; // FIXME set the type to the Command type once it's defined
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_COMMANDS = 'setCommands',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | { type: ACTIONS.SET_COMMANDS; data: any }; // FIXME set the type to the Command type once it's defined

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
    case ACTIONS.SET_COMMANDS: {
      return {
        ...state,
        commands: action.data,
      };
    }
    default:
      return state;
  }
};
