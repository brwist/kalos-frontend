import { User } from '@kalos-core/kalos-rpc/User';
import { UserClientService } from '../../../helpers';
import { PermissionGroup } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

export type State = {
  userData: User | undefined;
  loggedUserData: User | undefined;
  init: boolean;
  loaded: boolean;
  roles: PermissionGroup[] | undefined;
  privileges: PermissionGroup[] | undefined;
  departments: PermissionGroup[] | undefined;
  openRemovePermission: boolean;
  openAddPermission: boolean;
};

export type Action =
  | { type: 'setUser'; data: User }
  | { type: 'setLoggedUser'; data: User }
  | { type: 'setInit'; data: boolean }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setRoles'; data: PermissionGroup[] }
  | { type: 'setPrivileges'; data: PermissionGroup[] }
  | { type: 'setDepartments'; data: PermissionGroup[] }
  | { type: 'setOpenRemovePermission'; data: boolean }
  | { type: 'setOpenAddPermission'; data: boolean };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setUser': {
      const data = action.data;
      return {
        ...state,
        userData: data,
      };
    }
    case 'setLoggedUser': {
      const data = action.data;
      return {
        ...state,
        loggedUserData: data,
      };
    }
    case 'setInit': {
      const data = action.data;
      return {
        ...state,
        init: data,
      };
    }
    case 'setLoaded': {
      const data = action.data;
      return {
        ...state,
        loaded: data,
      };
    }
    case 'setRoles': {
      const data = action.data;
      return {
        ...state,
        roles: data,
      };
    }
    case 'setPrivileges': {
      const data = action.data;
      return {
        ...state,
        privileges: data,
      };
    }
    case 'setDepartments': {
      const data = action.data;
      return {
        ...state,
        departments: data,
      };
    }
    case 'setOpenRemovePermission': {
      const data = action.data;
      console.log('got called to updatae', action.data);
      return {
        ...state,
        openRemovePermission: data,
      };
    }
    case 'setOpenAddPermission': {
      const data = action.data;
      return {
        ...state,
        openAddPermission: data,
      };
    }

    default:
      return state;
  }
};
