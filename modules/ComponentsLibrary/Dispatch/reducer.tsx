import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export type FormData = {
  dateStart: string;
  timeStart: string;
  dateEnd: string;
  timeEnd: string;
  departmentIds: number[];
  jobTypes: number[];
  divisionMulti: number[];
};
export interface State {
  techs: DispatchableTech[];
  dismissedTechs: DispatchableTech[];
  calls: DispatchCall[];
  defaultDepartmentIds: number[];
  defaultSectorIds: number[];
  departmentList: TimesheetDepartment[];
  jobTypeList: JobType[];
  formData: FormData;
  notIncludedJobTypes: number[];
  openModal: boolean;
  modalKey: string;
  selectedTech: DispatchableTech;
  selectedCall: DispatchCall;
  center: {lat: number, lng: number};
  zoom: number;
  isProcessing: boolean;
  googleApiKey: string;
  isLoadingTech: boolean;
  isLoadingCall: boolean;
  isLoadingMap: boolean;
  isInitialLoad: boolean;
  isLoadingFilters: boolean;
}

export type Action =
  | { type: 'setTechs'; data: {
    availableTechs: DispatchableTech[],
    dismissedTechs: DispatchableTech[]
  }}
  | { type: 'setCalls'; data: {
    calls: DispatchCall[] 
  }}
  | { type: 'setDepartmentList'; data: TimesheetDepartment[] }
  | { type: 'setJobTypeList'; data: JobType[] }
  | { type: 'setFormData'; data: FormData }
  | { type: 'setDropdownValuesAndApi'; data: {
    departmentList: TimesheetDepartment[],
    defaultDepartmentIds: number[],
    defaultSectorIds: number[],
    jobTypeList: JobType[],
    googleApiKey: string,
  }}
  | { type: 'setModal'; data: {
    openModal: boolean,
    modalKey: string,
    selectedTech: DispatchableTech,
    selectedCall: DispatchCall,
    isProcessing: boolean,
  }}
  | { type: 'setCenter'; data: {
    center: {lat: number, lng: number},
    zoom: number
  }}
  | {type: 'setProcessing'; data: boolean }
  | {type: 'setLoadingTech'; data: boolean}
  | {type: 'setLoadingCall'; data: boolean}
  | {type: 'setLoadingMap'; data: boolean};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTechs':
      return {
        ...state,
        techs: action.data.availableTechs,
        dismissedTechs: action.data.dismissedTechs,
        isLoadingTech: false,
      };
    case 'setCalls':
      return {
        ...state,
        calls: action.data.calls,
        isLoadingCall: false,
      };
    case 'setDepartmentList':
      return {
        ...state,
        departmentList: action.data,
      };
    case 'setJobTypeList':
      return {
        ...state,
        jobTypeList: action.data,
      };
    case 'setFormData':
      return {
        ...state,
        formData: action.data,
        isLoadingFilters: false,
      };
    case 'setDropdownValuesAndApi':
      return {
        ...state,
        departmentList: action.data.departmentList,
        defaultDepartmentIds: action.data.defaultDepartmentIds,
        defaultSectorIds: action.data.defaultSectorIds,
        jobTypeList: action.data.jobTypeList,
        googleApiKey: action.data.googleApiKey,
        isLoadingMap: false,
        isInitialLoad: false,
      }
    case 'setModal':
      return {
        ...state,
        openModal: action.data.openModal,
        modalKey: action.data.modalKey,
        selectedTech: action.data.selectedTech,
        selectedCall: action.data.selectedCall,
        isProcessing: action.data.isProcessing,
      }
    case 'setCenter':
      return {
        ...state,
        center: action.data.center,
        zoom: action.data.zoom,
      }
    case 'setProcessing':
      return {
        ...state,
        isProcessing: action.data,
      }
    case 'setLoadingTech':
      return {
        ...state,
        isLoadingTech: action.data,
      }
    case 'setLoadingCall':
      return {
        ...state,
        isLoadingCall: action.data,
      }
    case 'setLoadingMap':
      return {
        ...state,
        isLoadingMap: action.data,
      }
    default:
      return state;
  }
};
