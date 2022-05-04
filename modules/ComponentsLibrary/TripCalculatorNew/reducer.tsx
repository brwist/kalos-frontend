import { Trip } from '../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';

export type State = {
  isLoaded: boolean;
  error: string | undefined;
  origin: string;
  destination: string;
  dropDownValue1: 'Employee' | 'Job' | 'Custom';
  dropDownValue2: 'Employee' | 'Job' | 'Custom';
  formValue1: number | string;
  formValue2: number | string;
  optionalFormData: { date: string; roundTrip: boolean; jobNumber: number };
  loadingData: boolean;
  departmentNumber: number;
  homeAddress: string;
  pendingTrip: Trip | undefined;
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
  SET_FORM_VALUE_1 = 'setFormValue1',
  SET_FORM_VALUE_2 = 'setFormValue2',
  SET_OPTIONAL_FORM_DATA = 'setOptionalFormData',
  SET_DESTINATION = 'setDestination',
  SET_HOME_ADDRESS = 'setHomeAddress',
  SET_DEPARTMENT = 'setDepartment',
  SET_PENDING_TRIP = 'setPendingTrip',
  SET_DISTANCE_RESULTS = 'setDistanceResults',
  SET_TRIP_ERROR = 'setTripError',
  SET_DROPDOWN_VALUE_1 = 'setDropDownValue1',
  SET_DROPDOWN_VALUE_2 = 'setDropDownValue2',
}

export type Action =
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_LOADING_DATA; data: boolean }
  | { type: ACTIONS.SET_ERROR; data: string }
  | { type: ACTIONS.SET_PENDING_TRIP; data: Trip | undefined }
  | { type: ACTIONS.SET_DEPARTMENT; data: number }
  | { type: ACTIONS.SET_FORM_VALUE_1; data: string | number }
  | { type: ACTIONS.SET_FORM_VALUE_2; data: string | number }
  | { type: ACTIONS.SET_HOME_ADDRESS; data: string }
  | { type: ACTIONS.SET_ORIGIN; data: string }
  | {
      type: ACTIONS.SET_OPTIONAL_FORM_DATA;
      data: { date: string; roundTrip: boolean; jobNumber: number };
    }
  | { type: ACTIONS.SET_DROPDOWN_VALUE_1; data: 'Employee' | 'Job' | 'Custom' }
  | { type: ACTIONS.SET_DROPDOWN_VALUE_2; data: 'Employee' | 'Job' | 'Custom' }
  | { type: ACTIONS.SET_DESTINATION; data: string }
  | { type: ACTIONS.SET_TRIP_ERROR; data: string | undefined }
  | {
      type: ACTIONS.SET_DISTANCE_RESULTS;
      data: { distance: number | undefined; duration: number | undefined };
    };

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
    case ACTIONS.SET_DROPDOWN_VALUE_1: {
      return {
        ...state,
        dropDownValue1: action.data,
      };
    }
    case ACTIONS.SET_DROPDOWN_VALUE_2: {
      return {
        ...state,
        dropDownValue2: action.data,
      };
    }
    case ACTIONS.SET_FORM_VALUE_1: {
      return {
        ...state,
        formValue1: action.data,
      };
    }
    case ACTIONS.SET_FORM_VALUE_2: {
      return {
        ...state,
        formValue2: action.data,
      };
    }
    case ACTIONS.SET_PENDING_TRIP: {
      return {
        ...state,
        pendingTrip: action.data,
      };
    }
    case ACTIONS.SET_HOME_ADDRESS: {
      return {
        ...state,
        homeAddress: action.data,
      };
    }
    case ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.data,
      };
    }
    case ACTIONS.SET_OPTIONAL_FORM_DATA: {
      return {
        ...state,
        optionalFormData: action.data,
      };
    }
    case ACTIONS.SET_DEPARTMENT: {
      return {
        ...state,
        departmentNumber: action.data,
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
