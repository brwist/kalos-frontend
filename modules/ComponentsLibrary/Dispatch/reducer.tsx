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
  isResidential: number;
};
export interface State {
  techs: DispatchableTech[];
  dismissedTechs: DispatchableTech[];
  calls: DispatchCall[];
  departmentIds: number[];
  defaultDepartmentIds: number[];
  jobTypes: number[];
  departmentList: TimesheetDepartment[];
  jobTypeList: JobType[];
  callStartDate: string;
  callEndDate: string;
  callStartTime: string;
  callEndTime: string;
  isResidential: number;
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
}

export type Action =
  | { type: 'setTechs'; data: {
    availableTechs: DispatchableTech[],
    dismissedTechs: DispatchableTech[]
  }}
  | { type: 'setCalls'; data: {
    calls: DispatchCall[] 
  }}
  | { type: 'updateTechParameters'; data: {
    departmentIds: number[] 
  }}
  | { type: 'updateCallParameters'; data: {
    jobTypes: number[],
    callDateStarted: string,
    callDateEnded: string,
    callTimeStarted: string,
    callTimeEnded: string,
    isResidential: number,
  }}
  | { type: 'setDepartmentList'; data: TimesheetDepartment[] }
  | { type: 'setJobTypeList'; data: JobType[] }
  | { type: 'setFormData'; data: FormData }
  | { type: 'setInitialRender'; data: {
    techs: DispatchableTech[],
    calls: DispatchCall[],
    dismissedTechs: DispatchableTech[],
    departmentList: TimesheetDepartment[],
    jobTypeList: JobType[]
  }}
  | { type: 'setInitialDropdowns'; data: {
    departmentList: TimesheetDepartment[],
    defaultDepartmentIds: number[],
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
    case 'updateTechParameters':
      return {
        ...state,
        departmentIds: action.data.departmentIds,
      };
    case 'updateCallParameters':
      return {
        ...state,
        jobTypes: action.data.jobTypes,
        callStartDate: action.data.callDateStarted,
        callEndDate: action.data.callDateEnded,
        callStartTime: action.data.callTimeStarted,
        callEndTime: action.data.callTimeEnded,
        isResidential: action.data.isResidential,
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
      };
    case 'setInitialRender':
      return {
        ...state,
        techs: action.data.techs,
        calls: action.data.calls,
        dismissedTechs: action.data.dismissedTechs,
        departmentList: action.data.departmentList,
        jobTypeList: action.data.jobTypeList,
      }
    case 'setInitialDropdowns':
      return {
        ...state,
        departmentList: action.data.departmentList,
        defaultDepartmentIds: action.data.defaultDepartmentIds,
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
