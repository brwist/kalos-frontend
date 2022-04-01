import { User } from '../../../@kalos-core/kalos-rpc/User';
import {
  PermissionGroup,
  PermissionGroupUser,
} from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import React, { FC, useState, useEffect, useCallback, useReducer } from 'react';
import { UserClientService } from '../../../helpers';
import { reducer } from './reducer';
import { Loader } from '../../Loader/main';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { VerticalTabs } from '../VerticalTabs';
import Tab from '@material-ui/core/Tab';
import { Schema } from '../Form';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import { userOption, FormData } from './reducer';
import { Confirm } from '../Confirm';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { PlainForm } from '../PlainForm';
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
    selectedUsers: { userIds: [], permissionId: 0 },
    departments: undefined,
    fetchedPermissions: undefined,
    isSU: false,
    fetchedUsersWithoutPermission: undefined,
    viewPermission: undefined,
    removePermission: undefined,
    isOwnerSU: false,
    activeTab: 'Roles',
  });
  const {
    init,
    loaded,
    roles,
    privileges,
    departments,
    fetchedUsersWithoutPermission,
    viewPermission,
    activeTab,
    selectedUsers,
    removePermission,
    fetchedPermissions,
    isOwnerSU,
    isSU,
  } = state;

  const refreshPermissions = () => {
    dispatch({ type: 'setViewPermission', data: undefined });
    dispatch({ type: 'setRemovePermission', data: undefined });
    dispatch({ type: 'setInit', data: true });
  };
  const RemovePermissionFromUser = async (removeReq: PermissionGroupUser) => {
    const req = new PermissionGroupUser();
    req.setUserId(removeReq.getUserId());
    req.setPermissionGroupId(removeReq.getPermissionGroupId());
    await UserClientService.RemoveUserFromPermissionGroup(req);
    refreshPermissions();
  };
  const fetchUsersWithPermission = async (permissionId: number) => {
    const req = new PermissionGroupUser();
    req.setPermissionGroupId(permissionId);
    req.setNotEqualsList(['PermissionGroupUserId']);
    req.setPermissionGroupUserId(0);
    const result = await UserClientService.BatchGetPermissionGroupUser(req);
    dispatch({ type: 'setFetchedPermissions', data: result.getResultsList() });
  };
  const fetchUsersWithoutPermission = async (
    permissionId: number,
    permissionType: string,
  ) => {
    const req = new PermissionGroupUser();
    req.setPermissionGroupId(permissionId);
    req.setPermissionGroupUserId(0);

    const result = (
      await UserClientService.BatchGetPermissionGroupUser(req)
    ).getResultsList();
    if (permissionType === 'role') {
      //we should find every user with a role, and filter them out
      const roleReq = new PermissionGroupUser();
      roleReq.setPermissionGroupUserId(0);
      roleReq.setPermissionGroupType('role');
      roleReq.setNotEqualsList(['PermissionGroupUserId']);
      const roleResult = (
        await UserClientService.BatchGetPermissionGroupUser(roleReq)
      ).getResultsList();
      console.log(roleResult);
      const filteredResults = result.filter(r => {
        const temp = roleResult.find(j => j.getUserId() === r.getUserId());
        if (temp) {
          return false;
        } else {
          return true;
        }
      });
      console.log(filteredResults);
      const mappedResults = filteredResults.map(r => ({
        label: r.getUserFirstname() + ' ' + r.getUserLastname(),
        value: r.getUserId(),
        permissionId: permissionId,
      }));
      dispatch({
        type: 'setFetchedUsersWithoutPermission',
        data: mappedResults,
      });
    } else {
      const mappedResults = result.map(r => ({
        label: r.getUserFirstname() + ' ' + r.getUserLastname(),
        value: r.getUserId(),
        permissionId: permissionId,
      }));
      dispatch({
        type: 'setFetchedUsersWithoutPermission',
        data: mappedResults,
      });
    }
  };
  const AddPermission = async (usersToAdd: number[], permissionId: number) => {
    for (let i = 0; i < usersToAdd.length; i++) {
      const req = new PermissionGroupUser();
      req.setUserId(usersToAdd[i]);
      req.setPermissionGroupId(permissionId);
      await UserClientService.AddUserToPermissionGroup(req);
      dispatch({ type: 'setFetchedUsersWithoutPermission', data: undefined });
      dispatch({
        type: 'setSelectedUsers',
        data: { userIds: [], permissionId: 0 },
      });
    }
  };
  const SCHEMA_PRINT: Schema<FormData> = [
    [
      {
        name: 'userIds',
        label: 'User(s)',
        type: 'multiselect',
        options: fetchedUsersWithoutPermission,
      },
    ],
  ];
  const load = useCallback(async () => {
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
    const loggedUserReq = new User();
    loggedUserReq.setId(loggedUserId);
    const loggedUserResult = await UserClientService.Get(loggedUserReq);
    const isSU = loggedUserResult
      .getPermissionGroupsList()
      .find(p => p.getName() === 'SU');
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
                        <IconButton
                          key="view"
                          onClick={() => {
                            fetchUsersWithPermission(role.getId());
                            dispatch({
                              type: 'setViewPermission',
                              data: role,
                            });
                          }}
                          size="small"
                        >
                          <Search />
                        </IconButton>,
                        <IconButton
                          key="Add"
                          onClick={() => {
                            dispatch({
                              type: 'setSelectedUsers',
                              data: {
                                userIds: [],
                                permissionId: role.getId(),
                              },
                            });
                            fetchUsersWithoutPermission(role.getId(), 'role');
                          }}
                          size="small"
                        >
                          <Add />
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
                          onClick={() => {
                            fetchUsersWithPermission(department.getId());
                            dispatch({
                              type: 'setViewPermission',
                              data: department,
                            });
                          }}
                          size="small"
                        >
                          <Search />
                        </IconButton>,
                        <IconButton
                          key="Add"
                          onClick={() => {
                            dispatch({
                              type: 'setSelectedUsers',
                              data: {
                                userIds: [],
                                permissionId: department.getId(),
                              },
                            });
                            fetchUsersWithoutPermission(
                              department.getId(),
                              'department',
                            );
                          }}
                          size="small"
                        >
                          <Add />
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
                          onClick={() => {
                            fetchUsersWithPermission(privilege.getId());
                            dispatch({
                              type: 'setViewPermission',
                              data: privilege,
                            });
                          }}
                          size="small"
                          disabled={privilege.getName() == 'SU' && !isOwnerSU}
                        >
                          <Search />
                        </IconButton>,
                        <IconButton
                          key="Add"
                          onClick={() => {
                            dispatch({
                              type: 'setSelectedUsers',
                              data: {
                                userIds: [],
                                permissionId: privilege.getId(),
                              },
                            });
                            fetchUsersWithoutPermission(
                              privilege.getId(),
                              'privilege',
                            );
                          }}
                          size="small"
                          disabled={privilege.getName() == 'SU' && !isOwnerSU}
                        >
                          <Add />
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
        open={viewPermission != undefined && fetchedPermissions != undefined}
        onClose={() => {
          dispatch({
            type: 'setViewPermission',
            data: undefined,
          });
          dispatch({
            type: 'setFetchedPermissions',
            data: undefined,
          });
        }}
      >
        <InfoTable
          columns={[
            { name: 'User' },
            { name: 'Permission' },
            { name: 'Permission Type' },
          ]}
          styles={{ width: '100%' }}
          loading={fetchedPermissions == undefined}
          data={
            fetchedPermissions
              ? fetchedPermissions.map(permission => {
                  return [
                    {
                      value:
                        permission.getUserFirstname() +
                        ' ' +
                        permission.getUserLastname(),
                    },
                    {
                      value: permission.getPermissionGroupName(),
                    },
                    {
                      value: permission.getPermissionGroupType(),
                      actions: [
                        <IconButton
                          key="view"
                          disabled={
                            permission.getPermissionGroupType() === 'role' &&
                            !isSU
                          }
                          onClick={() => {
                            dispatch({
                              type: 'setRemovePermission',
                              data: permission,
                            });
                          }}
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
        <Modal
          open={removePermission != undefined}
          onClose={() =>
            dispatch({
              type: 'setRemovePermission',
              data: undefined,
            })
          }
        >
          <Confirm
            title="Remove Permission"
            open={removePermission != undefined}
            onClose={() =>
              dispatch({
                type: 'setRemovePermission',
                data: undefined,
              })
            }
            onConfirm={() => RemovePermissionFromUser(removePermission!)}
            submitLabel="Confirm"
          >
            Are you sure you want to remove this Permission?
          </Confirm>
        </Modal>
      </Modal>
      <Modal
        open={fetchedUsersWithoutPermission != undefined}
        onClose={() =>
          dispatch({
            type: 'setFetchedUsersWithoutPermission',
            data: undefined,
          })
        }
      >
        <SectionBar title="Add Permission" uncollapsable={true}>
          <PlainForm
            schema={SCHEMA_PRINT}
            data={selectedUsers}
            onChange={e =>
              dispatch({
                type: 'setSelectedUsers',
                data: {
                  userIds: e.userIds,
                  permissionId: selectedUsers.permissionId,
                },
              })
            }
          ></PlainForm>
          <Button
            disabled={selectedUsers.userIds.length == 0}
            label={'Add Selected Permissions'}
            onClick={() =>
              AddPermission(selectedUsers.userIds, selectedUsers.permissionId)
            }
          ></Button>
        </SectionBar>
      </Modal>

      {onClose && <Button key="close" label="Close" onClick={onClose}></Button>}
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};
