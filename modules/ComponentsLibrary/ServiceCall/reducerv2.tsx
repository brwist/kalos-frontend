import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobTypeSubtype } from '@kalos-core/kalos-rpc/JobTypeSubtype';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { ContractFrequency } from '@kalos-core/kalos-rpc/ContractFrequency';
import { Option } from '../Field';
import { ServiceItem } from '@kalos-core/kalos-rpc/ServiceItem';
import { Payment } from '@kalos-core/kalos-rpc/Payment';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';

export interface State {
  userList: User[];
  requestFields: string[];
  departmentList: TimesheetDepartment[];
  serviceCallId: number;
  openModal: boolean;
  modalType: string;
  showCustInfo: boolean;
  showPropertyInfo: boolean;
  showContractInfo: boolean;
  entry: Event;
  property: Property;
  customer: User;
  paidServices: Payment[];
  propertyEvents: Event[];
  contract: Contract;
  contractFrequencyTypes: ContractFrequency[];
  jobTypes: JobType[];
  jobSubtypes: JobSubtype[];
  jobTypeSubtypes: JobTypeSubtype[];
  servicesRendered: ServicesRendered[];
  loggedUser: User;
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  cardSortOrder: {name: string, display: boolean}[];
  showRequest: boolean;
  showServiceItems: boolean;
  showServices: boolean;
  showProposals: boolean;
  selectedServiceItems: ServiceItem[];
  pendingSave: boolean;
  propertyServiceItems: ServiceItem[];
}

export type Action = 
  | {type: "setModalType" ; data: string}
  | {type: 'setEntry'; data: Event}
  | {type: "setShowContractInfo" ; data: boolean}
  | {type: "setShowCustInfo" ; data: boolean}
  | {
    type: 'setChangeEntry';
    data: {
      entry: Event;
      pendingSave: boolean;
    };
  }
  | {
    type: 'setHandleSave';
    data: {
      pendingSave: boolean;
      requestValid: boolean;
    };
  }
  | {
    type: 'setServicesRendered';
    data: {
      servicesRendered: ServicesRendered[];
      loading: boolean;
    };
  }
  | {type: "setLoading"; data: boolean}
  | { type: 'setPaidServices'; data: Payment[] }
  | {
    type: 'setData';
    data: {
      userList: User[];
      departmentList: TimesheetDepartment[];
      property: Property;
      customer: User;
      propertyEvents: Event[];
      jobTypes: JobType[];
      jobSubtypes: JobSubtype[];
      jobTypeSubtypes: JobTypeSubtype[];
      loggedUser: User;
      entry: Event;
      servicesRendered: ServicesRendered[];
      loaded: boolean;
      loading: boolean;
      contractInfo: Contract;
      frequencyTypes: ContractFrequency[];
      propertyServiceItems: ServiceItem[];
    };
  }
  | {type: 'setRequestValid'; data: boolean}
  | {type: 'setRequestFields'; data: string[]}
  | {type: 'setPendingSave'; data: boolean}
  | {type: 'setShowRequest'; data: boolean}
  | {type: 'setShowServiceItems'; data: boolean}
  | {type: 'setShowServices'; data: boolean}
  | {type: 'setShowProposals'; data: boolean}
  | {type: 'setCardSortOrder'; data: {name:string, display:boolean}[]}
  | {type: 'setSelectedServiceItems'; data: ServiceItem[]}
  | {type: 'setPropertyServiceItems'; data: ServiceItem[]}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setModalType":
      return {
        ...state,
        modalType: action.data,
      };
    case "setShowContractInfo":
      return {
        ...state,
        showContractInfo: action.data,
      };
    case "setShowCustInfo":
      return {
        ...state,
        showCustInfo: action.data,
      };
    case 'setChangeEntry':
      return {
        ...state,
        entry: action.data.entry,
        pendingSave: action.data.pendingSave,
      };
    case 'setHandleSave':
      return {
        ...state,
        pendingSave: action.data.pendingSave,
        requestValid: action.data.requestValid,
      };
    case 'setServicesRendered':
      return {
        ...state,
        servicesRendered: action.data.servicesRendered,
        loading: action.data.loading,
      };
    case 'setLoading':
      return {
        ...state,
        loading: action.data,
      }
    case 'setPaidServices':
      console.log('what we got in reducer', action.data);
      return {
        ...state,
        paidServices: action.data,
      };
    case 'setData': {
      let roleType = '';
      let role = action.data.loggedUser
        .getPermissionGroupsList()
        .find(permission => permission.getType() == 'role');
      if (role) {
        roleType = role.getName();
      }
      return {
        ...state,
        userList: action.data.userList,
        departmentList: action.data.departmentList,
        property: action.data.property,
        customer: action.data.customer,
        propertyEvents: action.data.propertyEvents,
        jobTypes: action.data.jobTypes,
        jobSubtypes: action.data.jobSubtypes,
        jobTypeSubtypes: action.data.jobTypeSubtypes,
        loggedUser: action.data.loggedUser,
        entry: action.data.entry,
        servicesRendered: action.data.servicesRendered,
        loaded: action.data.loaded,
        loading: action.data.loading,
        contract: action.data.contractInfo,
        contractFrequencyTypes: action.data.frequencyTypes,
        loggedUserRole: roleType,
        propertyServiceItems: action.data.propertyServiceItems,
      };
    }
    case 'setRequestValid':
      return {
        ...state,
        requestValid: action.data,
      };
    case 'setRequestFields':
      return {
        ...state,
        requestFields: action.data,
      };
    case 'setPendingSave':
      return {
        ...state,
        pendingSave: action.data,
      };
    case 'setEntry':
      return {
        ...state,
        entry: action.data,
      };
    case 'setShowRequest':
      return {
        ...state,
        showRequest: action.data,
      }
    case 'setShowServiceItems':
      return {
        ...state,
        showServiceItems: action.data,
      }
    case 'setShowServices':
      return {
        ...state,
        showServices: action.data,
      }
    case 'setShowProposals':
      return {
        ...state,
        showProposals: action.data,
      }
    case 'setCardSortOrder':
      return {
        ...state,
        cardSortOrder: action.data,
      }
    case 'setSelectedServiceItems':
      return {
        ...state,
        selectedServiceItems: action.data,
      };
    case 'setPropertyServiceItems':
      return {
        ...state,
        propertyServiceItems: action.data,
      }
    default:
      return state
  }
}