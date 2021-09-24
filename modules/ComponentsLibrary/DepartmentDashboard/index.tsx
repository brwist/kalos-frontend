/* 

  Design Specification: 

*/

import React, { useReducer, useEffect, useCallback, useMemo, FC } from 'react';
import { reducer, ACTIONS, FilterData } from './reducer';
import Alert from '@material-ui/lab/Alert';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import {
  UserClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { User } from '@kalos-core/kalos-rpc/User';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { PermissionsManager } from '../PermissionsManager';

// add any prop types here
interface props {
  userId: number;
}

export const DepartmentDashboard: FC<props> = function DepartmentDashboard({
  userId,
}) {
  const [state, dispatch] = useReducer(reducer, {
    isLoaded: false,
    departments: [],
    filter: { departmentId: 0 },
    role: '',
    loggedUser: new User(),
    departmentOptions: [],
  });
  const {
    isLoaded,
    departments,
    filter,
    role,
    loggedUser,
    departmentOptions,
  } = state;

  const handleSetFilter = (d: FilterData) => {
    if (!d.departmentId) {
      d.departmentId = 0;
    }

    dispatch({ type: ACTIONS.SET_FILTER, data: d });
  };
  const getDepartmentOptions = (departments: TimesheetDepartment[]) => {
    return [
      { label: OPTION_ALL, value: 0 },
      ...departments.map(el => ({
        label: TimesheetDepartmentClientService.getDepartmentName(el),
        value: el.getId(),
      })),
    ];
  };

  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'departmentId',
        label: 'Select Department',
        options: departmentOptions,
      },
    ],
  ];

  const load = useCallback(async () => {
    // RPCs that are in here should be stubbed in the tests at least 9 times out of 10.
    // This ensures that the fake data gets "loaded" instantly and the tests can progress quickly and without RPC errors
    // For some examples, check out /test/modules/Teams or /test/modules/Payroll

    const depReq = new TimesheetDepartment();
    depReq.setIsActive(1);
    const departments = await (
      await TimesheetDepartmentClientService.BatchGet(depReq)
    ).getResultsList();

    let temp = getDepartmentOptions(departments);
    dispatch({ type: ACTIONS.SET_DEPARTMENTS, data: departments });

    const loggedUser = await UserClientService.loadUserById(userId);
    dispatch({ type: ACTIONS.SET_LOGGED_USER, data: loggedUser });

    const role = loggedUser
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');
    if (role) {
      dispatch({ type: ACTIONS.SET_ROLE, data: role.getName() });
    }
    if (loggedUser) {
      const departments = loggedUser
        .getPermissionGroupsList()
        .filter(p => p.getType() === 'department')
        .reduce(
          (aggr, item) => [...aggr, +JSON.parse(item.getFilterData()).value],
          [] as number[],
        );
      if (departments.length > 0) {
        temp = temp.filter(p => departments.includes(+p.value));
      } else {
        temp = temp.filter(
          p => +p.value === loggedUser.getEmployeeDepartmentId(),
        );
      }
      dispatch({ type: ACTIONS.SET_DEPARTMENT_OPTIONS, data: temp });
    }
    dispatch({ type: ACTIONS.SET_LOADED, data: true });
  }, [userId]);

  const cleanup = useCallback(() => {
    // TODO clean up your function calls here (called once the component is unmounted, prevents "Can't perform a React state update on an unmounted component" errors)
    // This is important for long-term performance of our components
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      load();
    }

    return () => {
      cleanup();
    };
  }, [load, isLoaded, cleanup]);

  return (
    <div>
      <SectionBar title="Department Dashboard" />
      {isLoaded ? (
        <>
          <PlainForm
            data={filter}
            onChange={handleSetFilter}
            schema={SCHEMA}
            className="PayrollFilter"
          />

          <Tabs
            tabs={[
              {
                label: 'Permission Manager',
                content: (
                  <PermissionsManager
                    loggedUserId={userId}
                    onClose={() => console.log('No close pls')}
                  ></PermissionsManager>
                ),
              },
            ]}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
