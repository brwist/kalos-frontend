import { Vehicle } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

export type State = {
  loading: boolean;
  orderBy: string;
  changingPage: boolean;
  loaded: boolean;
  page: number;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | undefined;
  creatingVehicle: boolean;
  vehicleCount: number;
  assigningVehicle: Vehicle | undefined;
};

export enum ACTIONS {
  SET_LOADING = 'setLoading',
  SET_LOADED = 'setLoaded',
  SET_CHANGING_PAGE = 'setChangingPage',
  SET_ORDER_BY = 'setOrderBy',
  SET_PAGE = 'setPage',
  SET_ACTIVE_VEHICLE = 'setActiveVehicle',
  SET_VEHICLES = 'setVehicles',
  SET_VEHICLES_COUNT = 'setVehiclesCount',
  SET_CREATING_VEHICLE = 'setCreatingVehicle',
  SET_ASSIGNING_VEHICLE = 'setAssigningVehicle',
}
export type assignmentData = {
  userId: number;
  departmentId: number;
};
export type Action =
  | { type: ACTIONS.SET_LOADING; data: boolean }
  | { type: ACTIONS.SET_LOADED; data: boolean }
  | { type: ACTIONS.SET_CHANGING_PAGE; data: boolean }
  | { type: ACTIONS.SET_CREATING_VEHICLE; data: boolean }
  | { type: ACTIONS.SET_ORDER_BY; data: string }
  | { type: ACTIONS.SET_ASSIGNING_VEHICLE; data: Vehicle | undefined }
  | { type: ACTIONS.SET_VEHICLES_COUNT; data: number }
  | { type: ACTIONS.SET_ACTIVE_VEHICLE; data: Vehicle | undefined }
  | { type: ACTIONS.SET_VEHICLES; data: Vehicle[] }
  | { type: ACTIONS.SET_PAGE; data: number };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING: {
      console.log('setting loading');
      return {
        ...state,
        loading: action.data,
      };
    }
    case ACTIONS.SET_PAGE: {
      console.log('setting page');
      return {
        ...state,
        page: action.data,
      };
    }
    case ACTIONS.SET_LOADED: {
      return {
        ...state,
        loaded: action.data,
      };
    }
    case ACTIONS.SET_CHANGING_PAGE: {
      console.log('setting changing page ');
      return {
        ...state,
        changingPage: action.data,
      };
    }
    case ACTIONS.SET_VEHICLES: {
      console.log('setting vehicles ');
      return {
        ...state,
        vehicles: action.data,
      };
    }
    case ACTIONS.SET_ACTIVE_VEHICLE: {
      console.log('setting active vehicles ');
      return {
        ...state,
        activeVehicle: action.data,
      };
    }
    case ACTIONS.SET_CREATING_VEHICLE: {
      console.log('setting creating vehicles ');
      return {
        ...state,
        creatingVehicle: action.data,
      };
    }
    case ACTIONS.SET_VEHICLES_COUNT: {
      console.log('setting vehicle count ');
      return {
        ...state,
        vehicleCount: action.data,
      };
    }
    case ACTIONS.SET_ASSIGNING_VEHICLE: {
      console.log('setting assignment ');
      console.log(action.data);
      return {
        ...state,
        assigningVehicle: action.data,
      };
    }
    default:
      return state;
  }
};
