import {
  DispatchableTech,
  DispatchCall,
} from '../../../@kalos-core/kalos-rpc/Dispatch';
import { JobType } from '../../../@kalos-core/kalos-rpc/JobType';
import { User } from '../../../@kalos-core/kalos-rpc/User';

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
  manualOff: { id: number; name: string }[];
  scheduledOff: { id: number; name: string }[];
  expires: string;
  meeting: {
    isTomorrow: boolean;
    start: string;
    list: { id: number; name: string }[];
  };
  class: {
    isTomorrow: boolean;
    start: string;
    list: { id: number; name: string }[];
  };
  inUse: number[];
  onCall: {
    coordinator: string;
    expires: string;
    tech: TechObj;
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
  propertyState: string;
  propertyId: number;
  userId: number;
  description: string;
  custName: string;
  userBusinessName: string;
  jobType: string;
  subType: string;
  notes: string;
};

export interface State {
  users: User[];
  techs: DispatchableTech[];
  offTechs: { id: number; name: string }[];
  scheduledOff: { id: number; name: string }[];
  meetingTechs: DispatchableTech[];
  classTechs: DispatchableTech[];
  onCallTech: DispatchableTech;
  calls: DispatchCall[];
  availableCalls: DispatchCall[];
  assignedCalls: DispatchCall[];
  requestedCalls: DispatchCall[];
  jobTypeList: JobType[];
  sectorList: number[];
  departmentList: number[];
  formData: FormData;
  googleApiKey: string;
  openModal: boolean;
  modalKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  loaded: boolean;
  savedFirstCall: FirstCallType;
  firstCallCalls: CallObj[];
  firstCallMeeting: {
    isTomorrow: boolean;
    start: string;
    list: { id: number; name: string }[];
  };
  firstCallMessage: string;
  firstCallOnCall: {
    coordinator: string;
    expires: string;
    tech: TechObj;
  };
  firstCallExpires: string;
  firstCallClass: {
    isTomorrow: boolean;
    start: string;
    list: { id: number; name: string }[];
  };
  firstCallInUse: number[];
  firstCallManualOff: { id: number; name: string }[];
  firstCallScheduledOff: { id: number; name: string }[];
  selectedCall: DispatchCall;
  currentFCCall: CallObj;
  isProcessing: boolean;
  assigneeList: { id: number; name: string }[];
  callMsg: string;
  save: boolean;
  newFirstCall: boolean;
  saveTime: string;
  firstCallId: number;
  errorMessage: string;
  saveCall: boolean;
  showAddTech: boolean;
  tempAssigneeList: string;
  refreshCalls: boolean;
  isApproved: boolean;
  hasNotification: boolean;
  notificationType: string;
  notificationMessage: string[];
  pendingAddInUse: number[];
  pendingRemoveInUse: number[];
  checkUser: boolean;
  userHasApiKey: boolean;
}

export type Action =
  | {
      type: 'setUsers';
      data: {
        users: User[];
      };
    }
  | {
      type: 'setTechs';
      data: {
        techs: DispatchableTech[];
      };
    }
  | {
      type: 'setTechRefresh';
      data: {
        techs: DispatchableTech[];
        formData: FormData;
        scheduledOff: { id: number; name: string }[];
      };
    }
  | {
      type: 'setModal';
      data: {
        openModal: boolean;
        modalKey: string;
        currentFC: FirstCallType;
        callMsg: string;
        selectedCall?: DispatchCall;
        assigneeList?: { id: number; name: string }[];
      };
    }
  | {
      type: 'setCalls';
      data: {
        calls: DispatchCall[];
        available: DispatchCall[];
        assigned: DispatchCall[];
        requested: DispatchCall[];
      };
    }
  | {
      type: 'setCallsOnly';
      data: {
        calls: DispatchCall[];
      };
    }
  | { type: 'setAssignedCalls'; data: DispatchCall[] }
  | { type: 'setApiKey'; data: string }
  | { type: 'setLoaded'; data: boolean }
  | {
      type: 'setInitialValues';
      data: {
        users: User[];
        techs: DispatchableTech[];
        calls: DispatchCall[];
        jobTypes: JobType[];
        availableCalls: DispatchCall[];
        assignedCalls: DispatchCall[];
        requestedCalls: DispatchCall[];
        key: string;
        firstCall: FirstCallType;
        newFirstCall: boolean;
        saveTime: string;
        firstCallId: number;
        meetingList: DispatchableTech[];
        classList: DispatchableTech[];
        offList: { id: number; name: string }[];
        scheduledOffList: { id: number; name: string }[];
        initialFormData: FormData;
      };
    }
  | {
      type: 'setTimes';
      data: {
        meetingTime: string;
        classTime: string;
      };
    }
  | { type: 'setSelectedCall'; data: DispatchCall }
  | { type: 'setProcessing'; data: boolean }
  | { type: 'setFirstCallCalls'; data: CallObj[] }
  | {
      type: 'setFirstCallMeeting';
      data: {
        isTomorrow: boolean;
        start: string;
        list: { id: number; name: string }[];
      };
    }
  | { type: 'setFirstCallMessage'; data: string }
  | {
      type: 'setFirstCallOnCall';
      data: {
        coordinator: string;
        expires: string;
        tech: TechObj;
      };
    }
  | { type: 'setFirstCallExpires'; data: string }
  | {
      type: 'setFirstCallClass';
      data: {
        isTomorrow: boolean;
        start: string;
        list: { id: number; name: string }[];
      };
    }
  | { type: 'setFirstCallInUse'; data: number[] }
  | { type: 'setFirstCallManualOff'; data: { id: number; name: string }[] }
  | {
      type: 'setFCCallsAndInUse';
      data: {
        calls: CallObj[];
        inUse: number[];
      };
    }
  | {
      type: 'setSave';
      data: {
        save: boolean;
        saveTime: string;
        firstCallId: number;
        isNew: boolean;
      };
    }
  | {
      type: 'setFormData';
      data: {
        formData: FormData;
      };
    }
  | {
      type: 'setFailedSave';
      data: {
        save: boolean;
        error: string;
      };
    }
  | { type: 'setOffTechs'; data: { id: number; name: string }[] }
  | {
      type: 'setCenter';
      data: {
        center: { lat: number; lng: number };
        zoom: number;
      };
    }
  | { type: 'setSaveCall'; data: boolean }
  | {
      type: 'setAssigneesAndCall';
      data: {
        assigneeList: { id: number; name: string }[];
        selectedCall: DispatchCall;
      };
    }
  | { type: 'setShowAddTech'; data: boolean }
  | { type: 'setRefreshCalls'; data: boolean }
  | { type: 'setSectorList'; data: number[] }
  | { type: 'setFinalApproval'; data: boolean }
  | {
      type: 'setNotification';
      data: {
        hasNotification: boolean;
        notificationType: string;
        notificationMessage: string[];
      };
    }
  | {
      type: 'setPendingInUse';
      data: {
        add: number[];
        remove: number[];
      };
    }
  | {
      type: 'setCurrentFCCallAndPendingInUse';
      data: {
        currentFCCall: CallObj;
        pendingAdd: number[];
        pendingRemove: number[];
      };
    }
  | {
      type: 'setAssigneeListAndPendingInUse';
      data: {
        assigneeList: { id: number; name: string }[];
        pendingAdd: number[];
        pendingRemove: number[];
      };
    }
  | {
      type: 'resetProcessAndApproved';
      data: {
        process: boolean;
        approved: boolean;
      };
    }
  | { type: 'setCallMsg'; data: string }
  | {
      type: 'refreshCallsAndTechs';
      data: {
        techs: DispatchableTech[];
        newFormData: FormData;
        scheduledOff: { id: number; name: string }[];
        calls: DispatchCall[];
        available: DispatchCall[];
        assigned: DispatchCall[];
        requested: DispatchCall[];
      };
    }
  | { type: 'setUserHasApiKey'; data: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setUsers':
      return {
        ...state,
        users: action.data.users,
      };
    case 'setTechs':
      return {
        ...state,
        techs: action.data.techs,
      };
    case 'setTechRefresh':
      return {
        ...state,
        techs: action.data.techs,
        formData: action.data.formData,
        scheduledOff: action.data.scheduledOff,
      };
    case 'setModal': {
      if (action.data.selectedCall && action.data.assigneeList) {
        return {
          ...state,
          openModal: action.data.openModal,
          modalKey: action.data.modalKey,
          selectedCall: action.data.selectedCall,
          assigneeList: action.data.assigneeList,
          savedFirstCall: action.data.currentFC,
          callMsg: action.data.callMsg,
        };
      } else {
        return {
          ...state,
          openModal: action.data.openModal,
          modalKey: action.data.modalKey,
          savedFirstCall: action.data.currentFC,
          callMsg: action.data.callMsg,
        };
      }
    }
    case 'setCalls': {
      return {
        ...state,
        calls: action.data.calls,
        availableCalls: action.data.available,
        assignedCalls: action.data.assigned,
        requestedCalls: action.data.requested,
        saveCall: false,
        refreshCalls: false,
      };
    }
    case 'setCallsOnly':
      return {
        ...state,
        calls: action.data.calls,
      };
    case 'setAssignedCalls':
      return {
        ...state,
        assignedCalls: action.data,
      };
    case 'setApiKey':
      return {
        ...state,
        googleApiKey: action.data,
      };
    case 'setLoaded':
      return {
        ...state,
        loaded: action.data,
      };
    case 'setInitialValues':
      return {
        ...state,
        users: action.data.users,
        techs: action.data.techs,
        calls: action.data.calls,
        jobTypeList: action.data.jobTypes,
        availableCalls: action.data.availableCalls,
        assignedCalls: action.data.assignedCalls,
        requestedCalls: action.data.requestedCalls,
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
        firstCallScheduledOff: action.data.firstCall.scheduledOff,
        loaded: true,
        saveTime: action.data.saveTime,
        firstCallId: action.data.firstCallId,
        meetingTechs: action.data.meetingList,
        classTechs: action.data.classList,
        offTechs: action.data.offList,
        scheduledOff: action.data.scheduledOffList,
        formData: action.data.initialFormData,
      };
    case 'setTimes':
      return {
        ...state,
        meetingTime: action.data.meetingTime,
        classTime: action.data.classTime,
      };
    case 'setSelectedCall':
      return {
        ...state,
        selectedCall: action.data,
        saveCall: true,
      };
    case 'setProcessing':
      return {
        ...state,
        isProcessing: action.data,
      };
    case 'setFirstCallCalls':
      return {
        ...state,
        firstCallCalls: action.data,
        save: true,
        assigneeList: [],
      };
    case 'setFirstCallMeeting':
      return {
        ...state,
        firstCallMeeting: action.data,
        save: true,
      };
    case 'setFirstCallMessage':
      return {
        ...state,
        firstCallMessage: action.data,
        save: true,
      };
    case 'setFirstCallOnCall':
      return {
        ...state,
        firstCallOnCall: action.data,
        save: true,
      };
    case 'setFirstCallExpires':
      return {
        ...state,
        firstCallExpires: action.data,
        save: true,
      };
    case 'setFirstCallClass':
      return {
        ...state,
        firstCallClass: action.data,
        save: true,
      };
    case 'setFirstCallInUse':
      return {
        ...state,
        firstCallInUse: action.data,
      };
    case 'setFirstCallManualOff':
      return {
        ...state,
        firstCallManualOff: action.data,
        save: true,
        isProcessing: false,
      };
    case 'setFCCallsAndInUse':
      return {
        ...state,
        firstCallCalls: action.data.calls,
        firstCallInUse: action.data.inUse,
        save: true,
        assigneeList: [],
      };
    case 'setSave':
      return {
        ...state,
        save: action.data.save,
        saveTime: action.data.saveTime,
        firstCallId: action.data.firstCallId,
        newFirstCall: action.data.isNew,
        isProcessing: false,
      };
    case 'setFormData':
      return {
        ...state,
        formData: action.data.formData,
      };
    case 'setFailedSave':
      return {
        ...state,
        save: action.data.save,
        errorMessage: action.data.error,
      };
    case 'setOffTechs':
      return {
        ...state,
        offTechs: action.data,
      };
    case 'setCenter':
      return {
        ...state,
        center: action.data.center,
        zoom: action.data.zoom,
      };
    case 'setSaveCall':
      return {
        ...state,
        saveCall: action.data,
      };
    case 'setAssigneesAndCall':
      return {
        ...state,
        assigneeList: action.data.assigneeList,
        selectedCall: action.data.selectedCall,
        saveCall: true,
        isProcessing: false,
      };
    case 'setShowAddTech':
      return {
        ...state,
        showAddTech: action.data,
      };
    case 'setRefreshCalls':
      return {
        ...state,
        refreshCalls: action.data,
      };
    case 'setSectorList':
      return {
        ...state,
        sectorList: action.data,
      };
    case 'setFinalApproval':
      return {
        ...state,
        isApproved: action.data,
      };
    case 'setNotification':
      return {
        ...state,
        hasNotification: action.data.hasNotification,
        notificationType: action.data.notificationType,
        notificationMessage: action.data.notificationMessage,
      };
    case 'setPendingInUse':
      return {
        ...state,
        pendingAddInUse: action.data.add,
        pendingRemoveInUse: action.data.remove,
      };
    case 'setCurrentFCCallAndPendingInUse':
      return {
        ...state,
        currentFCCall: action.data.currentFCCall,
        pendingAddInUse: action.data.pendingAdd,
        pendingRemoveInUse: action.data.pendingRemove,
      };
    case 'setAssigneeListAndPendingInUse':
      return {
        ...state,
        assigneeList: action.data.assigneeList,
        pendingAddInUse: action.data.pendingAdd,
        pendingRemoveInUse: action.data.pendingRemove,
      };
    case 'resetProcessAndApproved':
      return {
        ...state,
        isProcessing: action.data.process,
        isApproved: action.data.approved,
      };
    case 'setCallMsg':
      return {
        ...state,
        callMsg: action.data,
      };
    case 'setUserHasApiKey':
      return {
        ...state,
        userHasApiKey: action.data,
        checkUser: true,
      };
    case 'refreshCallsAndTechs':
      return {
        ...state,
        techs: action.data.techs,
        formData: action.data.newFormData,
        scheduledOff: action.data.scheduledOff,
        calls: action.data.calls,
        availableCalls: action.data.available,
        assignedCalls: action.data.assigned,
        requestedCalls: action.data.requested,
        saveCall: false,
        refreshCalls: false,
      };
    default:
      return {
        ...state,
      };
  }
};
