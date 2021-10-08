import { DispatchableTech, DispatchCall } from '@kalos-core/kalos-rpc/Dispatch';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export type FormData = {
  departmentIds: number[];
  division: number;
  jobTypes: number[];
  availableTechs: DispatchableTech[];
  meetingTime: string;
  classTime: string;
};

export type FirstCallType = {
  calls: CallObj[];
  manualOff: number[];
  expires: string;
  meeting: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  };
  class: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  };
  inUse: number[];
  onCall: {
    coordinator: string,
    expires: string,
    tech: TechObj
  };
  message: string;
};

export type TechObj = {
  userId: number;
  name: string;
  userPhone: string;
  userEmail: string;
  secondsWorked: number;
};

export type CallObj = {
  assigned: TechObj[];
  start: string;
  end: string;
  id: number;
  propertyAddress: string;
  propertyCity: string;
  propertyId: number;
  userId: number;
  description: string;
  custName: string;
  userBusinessName: string;
  type: string;
  subType: string;
  notes: string;
};

export interface State {
  techs: DispatchableTech[];
  offTechs: number[];
  meetingTechs: DispatchableTech[];
  classTechs: DispatchableTech[];
  onCallTech: DispatchableTech;
  calls: DispatchCall[];
  assignedCalls: DispatchCall[];
  jobTypeList: JobType[];
  departmentList: number[];
  formData: FormData;
  googleApiKey: string;
  openModal: boolean;
  modalKey: string;
  center: {lat: number, lng: number};
  zoom: number;
  loaded: boolean;
  savedFirstCall: FirstCallType;
  firstCallCalls: CallObj[];
  firstCallMeeting: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  };
  firstCallMessage: string;
  firstCallOnCall: {
    coordinator: string,
    expires: string,
    tech: TechObj
  };
  firstCallExpires: string;
  firstCallClass: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  };
  firstCallInUse: number[];
  firstCallManualOff: number[];
  selectedCall: DispatchCall;
  isProcessing: boolean;
  assigneeList: {id: number, name: string}[];
  save: boolean;
  newFirstCall: boolean,
  saveTime: string;
  firstCallId: number;
  errorMessage: string;
  saveCall: boolean;
  showAddTech: boolean;
  tempAssigneeList: number;
}

export type Action = 
  | { type: 'setTechs'; data: DispatchableTech[] }
  | { type: 'setModal'; data: {
    openModal: boolean,
    modalKey: string,
    selectedCall?: DispatchCall,
    assigneeList?: {id: number, name: string}[],
  }}
  | { type: 'setCalls'; data: {
    available: DispatchCall[],
    assigned: DispatchCall[] 
  }}
  | { type: 'setAssignedCalls'; data: DispatchCall[] }
  | { type: 'setApiKey'; data: string }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setInitialValues'; data:  {
    techs: DispatchableTech[],
    calls: DispatchCall[],
    jobTypes: JobType[],
    assignedCalls: DispatchCall[],
    key: string,
    firstCall: FirstCallType,
    newFirstCall: boolean,
    saveTime: string,
    firstCallId: number,
    meetingList: DispatchableTech[],
    classList: DispatchableTech[],
    offList: number[],
  }}
  | { type: 'setTimes'; data: {
    meetingTime: string,
    classTime: string,
  }}
  | { type: 'setSelectedCall'; data: DispatchCall }
  | { type: 'setProcessing'; data: boolean }
  | { type: 'setFirstCallCalls'; data: CallObj[]}
  | { type: 'setFirstCallMeeting'; data: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  }}
  | { type: 'setFirstCallMessage'; data: string }
  | { type: 'setFirstCallOnCall'; data: {
    coordinator: string,
    expires: string,
    tech: TechObj
  }}
  | { type: 'setFirstCallExpires'; data: string }
  | { type: 'setFirstCallClass'; data: {
    isTomorrow: boolean,
    start: string,
    list: number[]
  }}
  | { type: 'setFirstCallInUse'; data: number[] }
  | { type: 'setFirstCallManualOff'; data: number[] }
  | { type: 'setSave'; data: {
    save: boolean,
    saveTime: string,
    firstCallId: number,
    isNew: boolean,
  } }
  | { type: 'setFormData'; data: FormData }
  | { type: 'setFailedSave'; data: {
    save: boolean,
    error: string,
  }}
  | { type: 'setOffTechs'; data: number[] }
  | { type: 'setCenter'; data: {
    center: {lat: number, lng: number},
    zoom: number,
  }}
  | { type: 'setSaveCall'; data: boolean }
  | { type: 'setAssigneesAndCall'; data: {
    assigneeList: {id: number, name: string}[],
    selectedCall: DispatchCall,
  }}
  | { type: 'setShowAddTech'; data: boolean }
;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTechs':
      return {
        ...state,
        techs: action.data,
      }
    case 'setModal':
      return {
        ...state,
        openModal: action.data.openModal,
        modalKey: action.data.modalKey,
        selectedCall: action.data.selectedCall ? action.data.selectedCall : new DispatchCall(),
        assigneeList: action.data.assigneeList ? action.data.assigneeList : [],
      }
    case 'setCalls':
      return {
        ...state,
        calls: action.data.available,
        assignedCalls: action.data.assigned,
        saveCall: false,
      }
    case 'setAssignedCalls':
      return {
        ...state,
        assignedCalls: action.data,
      }
    case 'setApiKey':
      return {
        ...state,
        googleApiKey: action.data,
      }
    case 'setLoaded':
      return {
        ...state,
        loaded: action.data,
      }
    case 'setInitialValues':
      return {
        ...state,
        techs: action.data.techs,
        calls: action.data.calls,
        jobTypeList: action.data.jobTypes,
        assignedCalls: action.data.assignedCalls,
        googleApiKey: action.data.key,
        savedFirstCall: action.data.firstCall,
        newFirstCall: action.data.newFirstCall,
        firstCallCalls: action.data.firstCall.calls,
        firstCallMeeting: action.data.firstCall.meeting,
        firstCallMessage: action.data.firstCall.message,
        firstCallOnCall: action.data.firstCall.onCall,
        firstCallExpires: action.data.firstCall.expires,
        firstCallClass: action.data.firstCall.class,
        firstCallInUse: action.data.firstCall.inUse,
        firstCallManualOff: action.data.firstCall.manualOff,
        loaded: true,
        saveTime: action.data.saveTime,
        firstCallId: action.data.firstCallId,
        meetingTechs: action.data.meetingList,
        classTechs: action.data.classList,
        offTechs: action.data.offList,
      }
    case 'setTimes':
      return {
        ...state,
        meetingTime: action.data.meetingTime,
        classTime: action.data.classTime,
      }
    case 'setSelectedCall':
      return {
        ...state,
        selectedCall: action.data,
        saveCall: true,
      }
    case 'setProcessing':
      return {
        ...state,
        isProcessing: action.data,
      }
    case 'setFirstCallCalls':
      return {
        ...state,
        firstCallCalls: action.data,
        save: true,
      }
    case 'setFirstCallMeeting':
      return {
        ...state,
        firstCallMeeting: action.data,
        save: true,
      }
    case 'setFirstCallMessage':
      return {
        ...state,
        firstCallMessage: action.data,
        save: true,
      }
    case 'setFirstCallOnCall':
      return {
        ...state,
        firstCallOnCall: action.data,
        save: true,
      }
    case 'setFirstCallExpires':
      return {
        ...state,
        firstCallExpires: action.data,
        save: true,
      }
    case 'setFirstCallClass':
      return {
        ...state,
        firstCallClass: action.data,
        save: true,
      }
    case 'setFirstCallInUse':
      return {
        ...state,
        firstCallInUse: action.data,
      }
    case 'setFirstCallManualOff':
      return {
        ...state,
        firstCallManualOff: action.data,
        save: true,
      }
    case 'setSave':
      return {
        ...state,
        save: action.data.save,
        saveTime: action.data.saveTime,
        firstCallId: action.data.firstCallId,
        newFirstCall: action.data.isNew,
        isProcessing: false
      }
    case 'setFormData':
      return {
        ...state,
        formData: action.data,
      }
    case 'setFailedSave':
      return {
        ...state,
        save: action.data.save,
        errorMessage: action.data.error,
      }
    case 'setOffTechs':
      return {
        ...state,
        offTechs: action.data,
      }
    case 'setCenter':
      return {
        ...state,
        center: action.data.center,
        zoom: action.data.zoom,
      }
    case 'setSaveCall':
      return {
        ...state,
        saveCall: action.data,
      }
    case 'setAssigneesAndCall':
      return {
        ...state,
        assigneeList: action.data.assigneeList,
        selectedCall: action.data.selectedCall,
        saveCall: true,
        isProcessing: false,
        tempAssigneeList: 0,
      }
    case 'setShowAddTech':
      return {
        ...state,
        showAddTech: action.data,
      }
    default:
      return {
        ...state,
      }
  }
};