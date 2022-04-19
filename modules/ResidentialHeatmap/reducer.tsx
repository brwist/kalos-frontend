export type State = {
  isLoaded: boolean;
  error: string | undefined;
  heatmapData: Array<google.maps.LatLng>;
  apiKey: string;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_DATA = 'setData',
  SET_APIKEY = 'setApiKey',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_DATA; data: Array<google.maps.LatLng> }
  | { type: ACTIONS.SET_ERROR; data: string | undefined }
  | { type: ACTIONS.SET_APIKEY; data: string };

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
    case ACTIONS.SET_APIKEY: {
      return {
        ...state,
        apiKey: action.data,
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
