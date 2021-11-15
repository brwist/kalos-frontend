export type State = {
  isLoaded: boolean;
  error: string | undefined;
  origin: string;
  destination: string;
  employeeId: number;
  loadingData: boolean;
  jobNumber: number;
  distanceResults: {
    distance: number | undefined;
    duration: number | undefined;
  };
  tripError: string | undefined;
};

export enum ACTIONS {
  SET_LOADED = 'setLoaded',
  SET_ERROR = 'setError',
  SET_LOADING_DATA = 'setLoadingData',
  SET_ORIGIN = 'setOrigin',
  SET_DESTINATION = 'setDestination',
  SET_EMPLOYEE_ID = 'setEmployeeId',
  SET_JOB_NUMBER = 'setJobNumber',
  SET_DISTANCE_RESULTS = 'setDistanceResults',
  SET_TRIP_ERROR = 'setTripError',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADING_DATA; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string }
  | { type: ACTIONS.SET_ORIGIN; data: string }
  | { type: ACTIONS.SET_DESTINATION; data: string }
  | { type: ACTIONS.SET_TRIP_ERROR; data: string | undefined }
  | { type: ACTIONS.SET_EMPLOYEE_ID; data: number }
  | {
      type: ACTIONS.SET_DISTANCE_RESULTS;
      data: { distance: number | undefined; duration: number | undefined };
    }
  | { type: ACTIONS.SET_JOB_NUMBER; data: number };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        isLoaded: action.data,
      };
    }
    case ACTIONS.SET_LOADING_DATA: {
      return {
        ...state,
        loadingData: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_ORIGIN: {
      return {
        ...state,
        origin: action.data,
      };
    }
    case ACTIONS.SET_DESTINATION: {
      return {
        ...state,
        destination: action.data,
      };
    }
    case ACTIONS.SET_EMPLOYEE_ID: {
      return {
        ...state,
        employeeId: action.data,
      };
    }
    case ACTIONS.SET_JOB_NUMBER: {
      if (action.data.toString() === '') {
        action.data = 0;
      }
      console.log('value that got sent', action.data);
      return {
        ...state,
        jobNumber: action.data,
      };
    }
    case ACTIONS.SET_DISTANCE_RESULTS: {
      return {
        ...state,
        distanceResults: action.data,
      };
    }
    case ACTIONS.SET_TRIP_ERROR: {
      return {
        ...state,
        tripError: action.data,
      };
    }
    default:
      return state;
  }
};
