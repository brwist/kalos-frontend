import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export type FormData = {
  dateStart: string;
  dateEnd: string;
  departmentIds: number[];
  jobTypes: number[];
};
export interface State {
  techs: DispatchableTech[];
  dismissedTechs: DispatchableTech[];
  calls: DispatchCall[];
  departmentIds: number[];
  jobTypes: number[];
  departmentList: TimesheetDepartment[];
  jobTypeList: JobType[];
  callStartDate: string;
  callEndDate: string;
  formData: FormData;
  notIncludedJobTypes: number[];
  openModal: boolean;
  modalKey: string;
  selectedTech: DispatchableTech;
  selectedCall: DispatchCall;
  center: {lat: number, lng: number};
  zoom: number;
  isLoading: boolean;
  googleApiKey: string;
}

export type Action =
  | { type: 'setTechs'; data: {
    availableTechs: DispatchableTech[],
    dismissedTechs: DispatchableTech[]
  }}
  | { type: 'setCalls'; data: DispatchCall[] }
  | { type: 'updateTechParameters'; data: {
    departmentIds: number[] 
  }}
  | { type: 'updateCallParameters'; data: {
    jobTypes: number[],
    callDateStarted: string,
    callDateEnded: string
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
    jobTypeList: JobType[],
    googleApiKey: string,
  }}
  | { type: 'setModal'; data: {
    openModal: boolean,
    modalKey: string,
    selectedTech: DispatchableTech,
    selectedCall: DispatchCall,
    isLoading: boolean,
  }}
  | { type: 'setCenter'; data: {
    center: {lat: number, lng: number},
    zoom: number
  }}
  | {type: 'setLoading'; data: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTechs':
      return {
        ...state,
        techs: action.data.availableTechs,
        dismissedTechs: action.data.dismissedTechs
      };
    case 'setCalls':
      return {
        ...state,
        calls: action.data,
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
        jobTypeList: action.data.jobTypeList,
        googleApiKey: action.data.googleApiKey,
      }
    case 'setModal':
      return {
        ...state,
        openModal: action.data.openModal,
        modalKey: action.data.modalKey,
        selectedTech: action.data.selectedTech,
        selectedCall: action.data.selectedCall,
        isLoading: action.data.isLoading,
      }
    case 'setCenter':
      return {
        ...state,
        center: action.data.center,
        zoom: action.data.zoom,
      }
    case 'setLoading':
      return {
        ...state,
        isLoading: action.data,
      }
    default:
      return state;
  }
};
