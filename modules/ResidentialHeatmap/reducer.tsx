export type State = {
  isLoaded: boolean;
  error: string | undefined;
  heatmapData: Array<google.maps.LatLng>;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_DATA; data: Array<google.maps.LatLng> }
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
    case ACTIONS.SET_DATA: {
      return {
        ...state,
        heatmapData: action.data,
        isLoaded: true,
      };
    }
    default:
      return state;
  }
};
