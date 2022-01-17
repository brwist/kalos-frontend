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

export interface State {
  serviceCallId: number;
  openModal: boolean;
  modalType: string;
  showCustInfo: boolean;
  showPropertyInfo: boolean;
  showContractInfo: boolean;
  entry: Event;
  property: Property;
  customer: User;
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
  cardSortOrder: string[];
}

export type Action = 
  | {type: "setModalType" ; data: string}
  | {type: "setShowContractInfo" ; data: boolean}
  | {type: "setShowCustInfo" ; data: boolean}
  | {
    type: 'setServicesRendered';
    data: {
      servicesRendered: ServicesRendered[];
      loading: boolean;
    };
  }
  | {type: "setLoading"}
  | {
    type: 'setData';
    data: {
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
    };
  }

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
    case 'setServicesRendered':
      return {
        ...state,
        servicesRendered: action.data.servicesRendered,
        loading: action.data.loading,
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
      };
    }
    default:
      return state
  }
}