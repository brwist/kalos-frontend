//reducer file for PerDiem
import { PerDiem } from '@kalos-core/kalos-rpc/PerDiem';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  loadPerDiemByUserIdsAndDateStarted,
  UserType,
  PerDiemType,
  PerDiemRowType,
  TimesheetDepartmentType,
} from '../../../helpers';
export interface GovPerDiems {
  [key: string]: {
    meals: number;
    lodging: number;
  };
}
export interface managerPerDiemsOther {
  [key: number]: PerDiemType[];
}
export type Action =
  | { type: 'loaded'; value: boolean }
  | { type: 'loading'; value: boolean }
  | { type: 'saving'; value: boolean }
  | { type: 'initializing'; value: boolean }
  | { type: 'initialized'; value: boolean }
  | { type: 'govPerDiems'; value: GovPerDiems }
  | { type: 'setUser'; value: UserType | undefined }
  | { type: 'setPerDiems'; value: PerDiemType[] }
  | { type: 'setManagerPerDiems'; value: PerDiemType[] }
  | { type: 'setCheckLodging'; value: boolean }
  | { type: 'setManagerPerDiemsOther'; value: managerPerDiemsOther }
  | { type: 'setManagerDepartmentIds'; value: number[] }
  | { type: 'setManagerFilterDepartmentId'; value: number }
  | { type: 'setPendingPerDiemSubmit'; value: PerDiemType | undefined }
  | { type: 'setPendingPerDiemApprove'; value: PerDiemType | undefined }
  | { type: 'setPendingPerDiemDelete'; value: PerDiemType | undefined }
  | { type: 'setPendingPerDiemEdit'; value: PerDiemType | undefined }
  | { type: 'setPendingPerDiemRowDelete'; value: boolean }
  | { type: 'setPendingPerDiemEditDuplicated'; value: boolean }
  | { type: 'setPendingPerDiemRowEdit'; value: PerDiemRowType | undefined }
  | { type: 'setDepartments'; value: TimesheetDepartmentType[] }
  | { type: 'setDateStarted'; value: Date };

export type State = {
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  initialized: boolean;
  initializing: boolean;
  govPerDiems: GovPerDiems;
  user: UserType | undefined;
  perDiems: PerDiemType[];
  managerPerDiems: PerDiemType[];
  checkLodging: boolean;
  managerPerDiemsOther: managerPerDiemsOther;
  managerDepartmentIds: number[];
  managerFilterDepartmentId: number;
  pendingPerDiemApprove: PerDiemType | undefined;
  pendingPerDiemSubmit: PerDiemType | undefined;
  pendingPerDiemDelete: PerDiemType | undefined;
  pendingPerDiemEdit: PerDiemType | undefined;
  pendingPerDiemRowDelete: boolean;
  pendingPerDiemEditDuplicated: boolean;
  pendingPerDiemRowEdit: PerDiemRowType | undefined;
  departments: TimesheetDepartmentType[];
  dateStarted: Date;
};
export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loaded':
      return {
        ...state,
        loaded: action.value,
      };
    case 'loading':
      return {
        ...state,
        loading: action.value,
      };
    case 'govPerDiems':
      return {
        ...state,
        govPerDiem: action.value,
      };
    case 'saving':
      return {
        ...state,
        saving: action.value,
      };
    case 'initialized':
      return {
        ...state,
        initialized: action.value,
      };
    case 'initializing':
      return {
        ...state,
        initializing: action.value,
      };
    case 'setUser':
      return {
        ...state,
        user: action.value,
      };
    case 'setPerDiems':
      return {
        ...state,
        perDiems: action.value,
      };
    case 'setManagerPerDiems':
      return {
        ...state,
        managerPerDiems: action.value,
      };
    case 'setCheckLodging':
      return {
        ...state,
        checkLodging: action.value,
      };
    case 'setManagerPerDiemsOther':
      return {
        ...state,
        managerPerDiemsOther: action.value,
      };
    case 'setManagerDepartmentIds':
      return {
        ...state,
        managerDepartmentIds: action.value,
      };
    case 'setManagerFilterDepartmentId':
      return {
        ...state,
        managerFilterDepartmentId: action.value,
      };
    case 'setPendingPerDiemSubmit':
      return {
        ...state,
        pendingPerDiemSubmit: action.value,
      };
    case 'setPendingPerDiemApprove':
      return {
        ...state,
        pendingPerDiemApprove: action.value,
      };
    case 'setPendingPerDiemDelete':
      return {
        ...state,
        pendingPerDiemDelete: action.value,
      };
    case 'setPendingPerDiemEdit':
      return {
        ...state,
        pendingPerDiemEdit: action.value,
      };
    case 'setPendingPerDiemRowDelete':
      return {
        ...state,
        pendingPerDiemRowDelete: action.value,
      };
    case 'setDepartments':
      return {
        ...state,
        departments: action.value,
      };
    case 'setDateStarted':
      return {
        ...state,
        dateStarted: action.value,
      };
    case 'setPendingPerDiemRowEdit':
      return {
        ...state,
        pendingPerDiemRowEdit: action.value,
      };
    case 'setPendingPerDiemEditDuplicated':
      return {
        ...state,
        pendingPerDiemEditDuplicated: action.value,
      };
    default:
      return state;
  }
};
