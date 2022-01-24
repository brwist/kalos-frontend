import { Board } from '@kalos-core/kalos-rpc/compiled-protos/trello_pb';

export type State = {
  isLoaded: boolean;
  error: string | undefined;
  boardToCreate: Board;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_BOARD_TO_CREATE = 'setBoardToCreate',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | { type: ACTIONS.SET_BOARD_TO_CREATE; data: Board };

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
    case ACTIONS.SET_BOARD_TO_CREATE: {
      return {
        ...state,
        boardToCreate: action.data,
      };
    }
    default:
      return state;
  }
};
