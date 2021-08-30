import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export type FormData = {
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
  formData: FormData;
  notIncludedJobTypes: number[];
  openModal: boolean;
  modalKey: string;
  selectedTech: DispatchableTech;
  selectedCall: DispatchCall;
  center: {lat: number, lng: number};
  zoom: number;
}

export type Action =
  | { type: 'setTechs'; data: DispatchableTech[] }
  | { type: 'setDismissedTechs'; data: DispatchableTech[] }
  | { type: 'setCalls'; data: DispatchCall[] }
  | { type: 'updateDepartmentIds'; data: {
    techs: DispatchableTech[],
    dismissedTechs: DispatchableTech[],
    departmentIds: number[] 
  }}
  | { type: 'updateJobTypes'; data: {
    calls: DispatchCall[],
    jobTypes: number[]
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
  | { type: 'setModal'; data: {
    openModal: boolean,
    modalKey: string,
    selectedTech: DispatchableTech,
    selectedCall: DispatchCall 
  }}
  | { type: 'setCenter'; data: {
    center: {lat: number, lng: number},
    zoom: number
  }};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTechs':
      return {
        ...state,
        techs: action.data,
      };
    case 'setDismissedTechs':
      return {
        ...state,
        dismissedtechs: action.data,
      };
    case 'setCalls':
      return {
        ...state,
        calls: action.data,
      };
    case 'updateDepartmentIds':
      return {
        ...state,
        techs: action.data.techs,
        dismissedTechs: action.data.dismissedTechs,
        departmentIds: action.data.departmentIds,
      };
    case 'updateJobTypes':
      return {
        ...state,
        calls: action.data.calls,
        jobTypes: action.data.jobTypes,
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
    case 'setModal':
      return {
        ...state,
        openModal: action.data.openModal,
        modalKey: action.data.modalKey,
        selectedTech: action.data.selectedTech,
        selectedCall: action.data.selectedCall,
      }
    case 'setCenter':
      return {
        ...state,
        center: action.data.center,
        zoom: action.data.zoom,
      }
    default:
      return state;
  }
};
