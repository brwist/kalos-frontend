import { User } from '../../../@kalos-core/kalos-rpc/User';
import {
  PermissionGroup,
  PermissionGroupUser,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import React, { FC, useEffect, useCallback, useReducer } from 'react';
import { UserClientService } from '../../../helpers';
import { reducer } from './reducer';
import { Loader } from '../../Loader/main';
import { Form, Schema } from '../Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Button } from '../Button';
import { FormData } from './reducer';
import { RoleType } from '../Payroll';
import { PlainForm } from '../PlainForm';
interface Props {
  userId: number;
  permissionType: string;
  userPermissions: PermissionGroup[];
  loggedUserPermissions: PermissionGroup[];
  limitMultiSelect: boolean;
  onClose?: () => void;
}

export const AddPermission: FC<Props> = ({
  userId,
  loggedUserPermissions,
  permissionType,
  userPermissions,
  onClose,
  limitMultiSelect,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    init: true,
    loaded: false,
    permissionsLoaded: [],
    selectedPermissions: { permissionIds: [] },
  });
  const { init, loaded, permissionsLoaded, selectedPermissions } = state;
  console.log('disable mui?', limitMultiSelect);
  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'permissionIds',
        label: 'Permission(s)',
        options: state.permissionsLoaded.map(permission => ({
          key: permission.getId() + permission.getDescription(),
          label: permission.getName() + '-' + permission.getDescription(),
          value: permission.getId(),
        })),
        type: limitMultiSelect ? 'number' : 'multiselect',
      },
    ],
  ];
  const AddPermission = async (permissionIdsToAdd: number[]) => {
    for (let i = 0; i < permissionIdsToAdd.length; i++) {
      const req = new PermissionGroupUser();
      req.setUserId(userId);
      req.setPermissionGroupId(permissionIdsToAdd[i]);
      await UserClientService.AddUserToPermissionGroup(req);
    }
    if (onClose) {
      onClose();
    }
  };

  const load = useCallback(async () => {
    const req = new PermissionGroup();
    req.setIsActive(true);
    if (permissionType.toLowerCase().includes('privilege')) {
      req.setType('privilege');
    }
    if (permissionType.toLowerCase().includes('department')) {
      req.setType('department');
    }
    if (permissionType.toLowerCase().includes('role')) {
      req.setType('role');
    }
    const loggedUserIsSU = loggedUserPermissions.find(
      p => p.getName() === 'SU',
    );

    const res = await UserClientService.BatchGetPermission(req);
    const resultList = res.getResultsList();
    let filteredList = resultList.filter(function (e) {
      return userPermissions.find(a => a.getId() === e.getId()) === undefined;
    });
    if (loggedUserIsSU === undefined) {
      filteredList = filteredList.filter(p => p.getName() != 'SU');
    }
    dispatch({ type: 'setPermissionsLoaded', data: filteredList });
    dispatch({ type: 'setLoaded', data: true });
  }, [permissionType, loggedUserPermissions, userPermissions]);
  useEffect(() => {
    if (init) {
      load();
      dispatch({ type: 'setInit', data: false });
    }
  }, [load, init]);

  return loaded ? (
    <SectionBar title="Add Permission" uncollapsable={true}>
      <PlainForm
        schema={SCHEMA_PRINT}
        data={selectedPermissions}
        onChange={e => dispatch({ type: 'setSelectedPermissions', data: e })}
      ></PlainForm>
      <Button
        disabled={selectedPermissions.permissionIds.length == 0}
        label={'Add Selected Permissions'}
        onClick={() => AddPermission(selectedPermissions.permissionIds)}
      ></Button>
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};
