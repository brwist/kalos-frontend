import { User } from '../../../@kalos-core/kalos-rpc/User';
import { UserClientService } from '../../../helpers';
import { PermissionGroup } from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import { isArray } from 'lodash';
export type FormData = {
  permissionIds: number[];
};
export type State = {
  init: boolean;
  loaded: boolean;
  permissionsLoaded: PermissionGroup[];
  selectedPermissions: FormData;
};

export type Action =
  | { type: 'setInit'; data: boolean }
  | { type: 'setLoaded'; data: boolean }
  | { type: 'setPermissionsLoaded'; data: PermissionGroup[] }
  | { type: 'setSelectedPermissions'; data: FormData };

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
    case 'setPermissionsLoaded': {
      const data = action.data;
      return {
        ...state,
        permissionsLoaded: data,
      };
    }
    case 'setSelectedPermissions': {
      let data = action.data;
      if (!isArray(data.permissionIds)) {
        let tempData = data.permissionIds;
        data.permissionIds = [tempData];
      }
      console.log('selected permissions', data);
      return {
        ...state,
        selectedPermissions: data,
      };
    }
    default:
      return state;
  }
};
