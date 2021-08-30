import { User } from '@kalos-core/kalos-rpc/User';
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

interface Props {
  userId: number;
  loggedUserId: number;
  user?: User;
  loggedUser?: User;
}

export const EmployeePermissions: FC<Props> = ({
  userId,
  loggedUserId,
  loggedUser,
  user,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    userData: user ? user : undefined,
    loggedUserData: loggedUser ? loggedUser : undefined,
    init: true,
    loaded: false,
    privileges: undefined,
    roles: undefined,
    departments: undefined,
  });
  const {
    userData,
    loggedUserData,
    init,
    loaded,
    roles,
    privileges,
    departments,
  } = state;
  const load = useCallback(async () => {
    if (loggedUserData == undefined) {
      const req = new User();
      req.setId(loggedUserId);
      const result = await UserClientService.Get(req);
      dispatch({ type: 'setLoggedUser', data: result });
    }
    if (userData == undefined) {
      const req = new User();
      req.setId(userId);
      console.log('we are here');
      const result = await UserClientService.Get(req);
      dispatch({ type: 'setUser', data: result });
      dispatch({ type: 'setLoaded', data: true });
      const roles = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'role');
      const departments = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'department');
      const privileges = result
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'privilege');
      dispatch({ type: 'setRoles', data: roles });
      dispatch({ type: 'setPrivileges', data: privileges });
      dispatch({ type: 'setDepartments', data: departments });
    }
  }, [loggedUserId, userId, loggedUserData, userData]);
  useEffect(() => {
    if (init) {
      load();
      dispatch({ type: 'setInit', data: false });
    }
  }, [load, init]);

  return loaded && userData ? (
    <SectionBar
      title={`Permissions for ${userData.getFirstname()} ${userData.getLastname()}`}
      uncollapsable={true}
    >
      <VerticalTabs
        vertical={true}
        tabs={[
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
                          },
                        ];
                      })
                    : []
                }
              />
            ),
          },
        ]}
      ></VerticalTabs>
    </SectionBar>
  ) : (
    <Loader></Loader>
  );
};