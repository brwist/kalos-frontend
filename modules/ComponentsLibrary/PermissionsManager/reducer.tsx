import { User } from '../../../@kalos-core/kalos-rpc/User';
import { UserClientService } from '../../../helpers';
import {
  PermissionGroup,
  PermissionGroupUserList,
  PermissionGroupUser,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
export type FormData = {
  userIds: number[];
  permissionId: number;
};
export type State = {
  init: boolean;
  loaded: boolean;
  roles: PermissionGroup[] | undefined;
  privileges: PermissionGroup[] | undefined;
  departments: PermissionGroup[] | undefined;
  activeTab: string;
  isSU: boolean;
  isOwnerSU: boolean;
  removePermission: PermissionGroupUser | undefined;
  fetchedPermissions: PermissionGroupUser[] | undefined;
  viewPermission: PermissionGroup | undefined;
  fetchedUsersWithoutPermission: userOption[] | undefined;
  selectedUsers: FormData;
};
export interface userOption {
  label: string;
  value: number;
  permissionId: number;
}

export type Action =
  | { type: 'setInit'; data: boolean }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setRoles'; data: PermissionGroup[] }
  | { type: 'setPrivileges'; data: PermissionGroup[] }
  | { type: 'setDepartments'; data: PermissionGroup[] }
  | { type: 'setFetchedPermissions'; data: PermissionGroupUser[] | undefined }
  | { type: 'setFetchedUsersWithoutPermission'; data: userOption[] | undefined }
  | { type: 'setActiveTab'; data: string }
  | { type: 'setSelectedUsers'; data: FormData }
  | { type: 'setIsSU'; data: boolean }
  | { type: 'setOwnerIsSU'; data: boolean }
  | { type: 'setRemovePermission'; data: PermissionGroupUser | undefined }
  | {
      type: 'setViewPermission';
      data: PermissionGroup | undefined;
    };
export const reducer = (state: State, action: Action) => {
  switch (action.type) {
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
    case 'setActiveTab': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        activeTab: data,
      };
    }
    case 'setIsSU': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        isSU: data,
      };
    }
    case 'setViewPermission': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        viewPermission: data,
      };
    }
    case 'setOwnerIsSU': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        isOwnerSU: data,
      };
    }
    case 'setFetchedPermissions': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        fetchedPermissions: data,
      };
    }
    case 'setRemovePermission': {
      const data = action.data;
      console.log(data);
      return {
        ...state,
        removePermission: data,
      };
    }
    case 'setFetchedUsersWithoutPermission': {
      const data = action.data;
      console.log('setting users without permission');
      console.log(data);
      return {
        ...state,
        fetchedUsersWithoutPermission: data,
      };
    }
    case 'setSelectedUsers': {
      const data = action.data;
      console.log('setting user');
      console.log(data);
      return {
        ...state,
        selectedUsers: data,
      };
    }
    default:
      return state;
  }
};
