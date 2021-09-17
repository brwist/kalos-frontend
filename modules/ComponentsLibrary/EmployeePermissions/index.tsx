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
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { AddPermission } from '../AddPermission';
import { Button } from '../Button';
import { Tooltip } from '@material-ui/core';
interface Props {
  userId: number;
  loggedUserId: number;
  user?: User;
  loggedUser?: User;
  onClose?: () => void;
}

export const EmployeePermissions: FC<Props> = ({
  userId,
  loggedUserId,
  loggedUser,
  user,
  onClose,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    userData: user ? user : undefined,
    loggedUserData: loggedUser ? loggedUser : undefined,
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
    activeTab: 'Role',
  });
  const {
    userData,
    loggedUserData,
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
  const RemovePermissionFromUser = async (permissionGroup: PermissionGroup) => {
    const req = new PermissionGroupUser();
    req.setUserId(userId);
    console.log('here to remove pls');
    req.setPermissionGroupId(permissionGroup.getId());
    console.log(req);
    await UserClientService.RemoveUserFromPermissionGroup(req);
    dispatch({
      type: 'setOpenRemovePermission',
      flag: false,
      pendingPermissionGroup: undefined,
    });
    refreshPermissions();
  };
  const refreshPermissions = () => {
    dispatch({ type: 'setOpenAddPermission', data: false });
    dispatch({ type: 'setUser', data: undefined });
    dispatch({ type: 'setInit', data: true });
  };
  const load = useCallback(async () => {
    if (loggedUserData == undefined) {
      const req = new User();
      req.setId(loggedUserId);
      const result = await UserClientService.Get(req);
      const loggedPrivileges = result
        .getPermissionGroupsList()
        .find(p => p.getName() === 'SU');
      dispatch({ type: 'setLoggedUser', data: result });
      dispatch({
        type: 'setIsSU',
        data: loggedPrivileges === undefined ? false : true,
      });
    }
    if (userData == undefined) {
      console.log('our user is undefined');
      const req = new User();
      req.setId(userId);
      console.log('we are here');
      const result = await UserClientService.Get(req);
      dispatch({ type: 'setUser', data: result });
      const roles = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'role');
      const departments = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'department');
      const privileges = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'privilege');
      const isSU = privileges.find(p => p.getName() == 'SU');
      dispatch({ type: 'setRoles', data: roles });
      dispatch({ type: 'setPrivileges', data: privileges });
      dispatch({ type: 'setDepartments', data: departments });
      dispatch({
        type: 'setOwnerIsSU',
        data: isSU === undefined ? false : true,
      });
    }
    dispatch({ type: 'setLoaded', data: true });
  }, [loggedUserId, userId, loggedUserData, userData]);
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
                        <Tooltip
                          key="roleDelete"
                          title={
                            isSU
                              ? 'Delete Role'
                              : 'You lack Permission to Edit Roles'
                          }
                        >
                          <IconButton
                            key="view"
                            onClick={() =>
                              dispatch({
                                type: 'setOpenRemovePermission',
                                flag: true,
                                pendingPermissionGroup: role,
                              })
                            }
                            disabled={!isSU}
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
  return loaded && userData ? (
    <SectionBar
      title={`Permissions for ${userData.getFirstname()} ${userData.getLastname()}`}
      uncollapsable={true}
    >
      <Button
        label={
          activeTab.includes('Role') && roles && roles.length > 0
            ? 'Permission Limit Reached'
            : `Add ${activeTab}`
        }
        onClick={() =>
          dispatch({
            type: 'setOpenAddPermission',
            data: true,
          })
        }
        disabled={activeTab.includes('Role') && roles && roles.length > 0}
      ></Button>
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
        open={openAddPermission}
        onClose={() => dispatch({ type: 'setOpenAddPermission', data: false })}
      >
        <AddPermission
          userId={userId}
          loggedUserPermissions={loggedUserData!.getPermissionGroupsList()}
          permissionType={activeTab}
          limitMultiSelect={activeTab.includes('Role')}
          userPermissions={userData.getPermissionGroupsList()}
          onClose={refreshPermissions}
        ></AddPermission>
      </Modal>
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
          onConfirm={() => RemovePermissionFromUser(pendingRemovePermission!)}
          submitLabel="Confirm"
        >
          Are you sure you want to remove this Permission?
        </Confirm>
      </Modal>
      {onClose && <Button label="Close" onClick={onClose}></Button>}
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};
