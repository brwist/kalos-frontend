import { User } from '@kalos-core/kalos-rpc/User';
import {
  PermissionGroup,
  PermissionGroupUser,
} from '@kalos-core/kalos-rpc/compiled-protos/user_pb';
import React, { FC, useState, useEffect, useCallback, useReducer } from 'react';
import { UserClientService } from '../../../helpers';
import { reducer } from './reducer';
import { Loader } from '../../Loader/main';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Title } from '@material-ui/icons';
import { VerticalTabs } from '../VerticalTabs';
import Tab from '@material-ui/core/Tab';
import { Schema } from '../Form';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { AddPermission } from '../AddPermission';
import { Button } from '../Button';
import { Tooltip } from '@material-ui/core';
interface Props {
  loggedUserId: number;
  onClose: () => void;
}
export interface PermissionType {
  permissionType: 'department' | 'role' | 'privilege';
}

export interface PermissionData {
  permissionName: string;
  permissionDescription: string;
  permissionType: PermissionType;
}
export const PermissionsManager: FC<Props> = ({ loggedUserId, onClose }) => {
  const [state, dispatch] = useReducer(reducer, {
    init: true,
    loaded: false,
    privileges: undefined,
    roles: undefined,
    departments: undefined,
    isSU: false,
    openAddPermission: false,
    openRemovePermission: false,
    pendingRemovePermission: undefined,
    isOwnerSU: false,
    activeTab: 'Roles',
  });
  const {
    init,
    loaded,
    roles,
    privileges,
    departments,
    openRemovePermission,
    openAddPermission,
    pendingRemovePermission,
    activeTab,
    isOwnerSU,
    isSU,
  } = state;

  const SCHEMA: Schema<PermissionData> = [
    [
      {
        name: 'permissionName',
        label: 'Permission Name',
        type: 'text',
      },
    ],
    [
      {
        name: 'permissionDescription',
        label: 'Description of Permission',
        type: 'text',
        multiline: true,
      },
    ],
    [
      {
        name: 'permissionType',
        label: 'Permission Type',
        options: ['department', 'role', ''],
      },
    ],
  ];
  const refreshPermissions = () => {
    dispatch({ type: 'setOpenAddPermission', data: false });
    dispatch({ type: 'setInit', data: true });
  };

  const load = useCallback(async () => {
    console.log('we are here');
    const req = new PermissionGroup();
    req.setIsActive(true);
    const result = await UserClientService.BatchGetPermission(req);
    const roles = result.getResultsList().filter(p => p.getType() === 'role');
    const departments = result
      .getResultsList()
      .filter(p => p.getType() === 'department');
    const privileges = result
      .getResultsList()
      .filter(p => p.getType() === 'privilege');
    const isSU = privileges.find(p => p.getName() == 'SU');
    dispatch({ type: 'setRoles', data: roles });
    dispatch({ type: 'setPrivileges', data: privileges });
    dispatch({ type: 'setDepartments', data: departments });
    dispatch({
      type: 'setOwnerIsSU',
      data: isSU === undefined ? false : true,
    });

    dispatch({ type: 'setLoaded', data: true });
  }, []);
  useEffect(() => {
    if (init) {
      load();
      dispatch({ type: 'setInit', data: false });
    }
  }, [load, init]);
  const tabs = [
    {
      label: 'Roles',
      content: (
        <InfoTable
          styles={{ width: '100%', padding: 10 }}
          columns={[{ name: 'Role Name' }, { name: 'Description' }]}
          data={
            roles
              ? roles.map(role => {
                  return [
                    {
                      value: role.getName(),
                    },
                    {
                      value: role.getDescription(),
                      actions: [
                        <Tooltip key="roleDelete" title={'Delete Role'}>
                          <IconButton
                            key="view"
                            onClick={() =>
                              dispatch({
                                type: 'setOpenRemovePermission',
                                flag: true,
                                pendingPermissionGroup: role,
                              })
                            }
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>,
                      ],
                    },
                  ];
                })
              : []
          }
        />
      ),
    },

    {
      label: 'Departments',
      content: (
        <InfoTable
          styles={{ width: '100%', padding: 10 }}
          columns={[{ name: 'Department' }, { name: 'Description' }]}
          data={
            departments
              ? departments.map(department => {
                  return [
                    {
                      value: department.getName(),
                    },
                    {
                      value: department.getDescription(),
                      actions: [
                        <IconButton
                          key={'view' + department.getId()}
                          onClick={() =>
                            dispatch({
                              type: 'setOpenRemovePermission',
                              flag: true,
                              pendingPermissionGroup: department,
                            })
                          }
                          size="small"
                        >
                          <Delete />
                        </IconButton>,
                      ],
                    },
                  ];
                })
              : []
          }
        />
      ),
    },
    {
      label: 'Privileges',
      content: (
        <InfoTable
          styles={{ width: '100%', padding: 10 }}
          columns={[{ name: 'Name' }, { name: 'Description' }]}
          data={
            privileges
              ? privileges.map(privilege => {
                  return [
                    {
                      value: privilege.getName(),
                    },
                    {
                      value: privilege.getDescription(),
                      actions: [
                        <IconButton
                          key="view"
                          onClick={() =>
                            dispatch({
                              type: 'setOpenRemovePermission',
                              flag: true,
                              pendingPermissionGroup: privilege,
                            })
                          }
                          size="small"
                          disabled={privilege.getName() == 'SU' && !isOwnerSU}
                        >
                          <Delete />
                        </IconButton>,
                      ],
                    },
                  ];
                })
              : []
          }
        />
      ),
    },
  ];
  return loaded ? (
    <SectionBar title={`Permissions`} uncollapsable={true}>
      <VerticalTabs
        onChange={e =>
          dispatch({
            type: 'setActiveTab',
            data: tabs[e].label,
          })
        }
        vertical={true}
        tabs={tabs}
      ></VerticalTabs>
      <Modal
        open={openRemovePermission}
        onClose={() =>
          dispatch({
            type: 'setOpenRemovePermission',
            flag: false,
            pendingPermissionGroup: undefined,
          })
        }
      >
        <Confirm
          title="Remove Permission"
          open={openRemovePermission}
          onClose={() =>
            dispatch({
              type: 'setOpenRemovePermission',
              flag: false,
              pendingPermissionGroup: undefined,
            })
          }
          onConfirm={() => console.log('We would like to delete a permission')}
          submitLabel="Confirm"
        >
          Are you sure you want to remove this Permission?
        </Confirm>
      </Modal>
      {onClose && <Button key="close" label="Close" onClick={onClose}></Button>}
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};
