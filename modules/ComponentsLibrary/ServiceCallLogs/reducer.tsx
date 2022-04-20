import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';

export type State = {
  isLoaded: boolean;
  error: string | undefined;
  activityLogs: ActivityLog[] | undefined;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_ACTIVITY_LOGS = 'setActivityLogs',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | {
      type: ACTIONS.SET_ACTIVITY_LOGS;
      data: ActivityLog[] | undefined;
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
    case ACTIONS.SET_ACTIVITY_LOGS: {
      return {
        ...state,
        activityLogs: action.data,
      };
    }
    default:
      console.error(
        'Action type sent to reducer which is not defined. This is a no-op, but you may want to check your logic. Got type: ',
        (action as any).type,
      );
      return state;
  }
};
