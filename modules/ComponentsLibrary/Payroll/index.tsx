import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import Alert from '@material-ui/lab/Alert';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import {
  UserClientService,
  UserType,
  loadTimesheetDepartments,
  TimesheetDepartmentType,
  getDepartmentName,
  loadTechnicians,
  getCustomerName,
  getWeekOptions,
  getPerDiemRowIds,
  PerDiemClientService,
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { PerDiem } from './components/PerDiem';
import { Timesheet } from './components/Timesheet';
import { TimeoffRequests } from './components/TimeoffRequests';
import { Spiffs } from './components/Spiffs';
import { ToolLogs } from './components/ToolLogs';
import './styles.less';
import { TripSummary } from '../TripSummary';
import {
  PerDiemList,
  PerDiem as pd,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { dateTimePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';

interface Props {
  userID: number;
}

type FilterData = {
  departmentId: number;
  employeeId: number;
  week: string;
};

export const Payroll: FC<Props> = ({ userID }) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [initiatedRole, setInitiatedRole] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterData>({
    departmentId: 0,
    employeeId: 0,
    week: OPTION_ALL,
  });

  const handleSetFilter = (d: FilterData) => {
    if (!d.week) {
      d.week = OPTION_ALL;
    }
    if (!d.departmentId) {
      d.departmentId = 0;
    }
    if (!d.employeeId) {
      d.employeeId = 0;
    }
    setFilter(d);
    // {departmentId: 18, week: undefined, employeeId: undefined}
  };

  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [loggedUser, setLoggedUser] = useState<UserType>();
  const [role, setRole] = useState<string>('');
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [loadedPerDiemIds, setLoadedPerDiemIds] = useState<number[]>([]);
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const handleSelectNewWeek = useCallback(async dateString => {
    let ids: number[] | undefined = [];
    if (dateString == '-- All --') {
      ids = (await PerDiemClientService.BatchGet(new pd()))
        .getResultsList()
        .filter(perdiem =>
          filter.employeeId != 0
            ? perdiem.getUserId() == filter.employeeId
            : true,
        )
        .map(perdiem => {
          return perdiem.getId();
        });
      setLoadedPerDiemIds(ids);
    } else {
      let date = new Date(dateString);
      date.setDate(date.getDate() + 1);
      let pdList = await getPerDiemRowIds(date);
      ids = pdList
        ?.getResultsList()
        .filter(perdiem =>
          filter.employeeId != 0 ? perdiem.getUserId() == userID : true,
        )
        .map(pd => pd.getId());
      ids ? setLoadedPerDiemIds(ids) : setLoadedPerDiemIds([]);
    }
  }, []);
  const init = useCallback(async () => {
    const departments = await loadTimesheetDepartments();
    setDepartments(departments);
    const employees = await loadTechnicians();
    setEmployees(employees);
    handleSelectNewWeek('-- All --');
    const loggedUser = await UserClientService.loadUserById(userID);
    setLoggedUser(loggedUser);
    const role = loggedUser.permissionGroupsList.find(p => p.type === 'role');
    if (role) {
      setRole(role.name);
    }
    setInitiated(true);
  }, [userID]);
  useEffect(() => {
    if (!initiated) {
      init();
    }
  }, [initiated]);
  let departmentOptions: Option[] = [
    { label: OPTION_ALL, value: 0 },
    ...departments.map(el => ({
      label: getDepartmentName(el),
      value: el.id,
    })),
  ];
  if (loggedUser && role === 'Manager') {
    const departments = loggedUser.permissionGroupsList
      .filter(p => p.type === 'department')
      .reduce(
        (aggr, item) => [...aggr, +JSON.parse(item.filterData).value],
        [] as number[],
      );
    if (departments.length > 0) {
      departmentOptions = departmentOptions.filter(p =>
        departments.includes(+p.value),
      );
    } else {
      departmentOptions = departmentOptions.filter(
        p => +p.value === loggedUser.employeeDepartmentId,
      );
    }
  }
  useEffect(() => {
    if (!initiatedRole && role !== '') {
      setInitiatedRole(true);
      if (departmentOptions[0]) {
        setFilter({ ...filter, departmentId: +departmentOptions[0].value });
      }
    }
  }, [initiatedRole, role, filter]);
  const SCHEMA: Schema<FilterData> = [
    [
      {
        name: 'departmentId',
        label: 'Select Department',
        options: departmentOptions,
      },
      {
        name: 'employeeId',
        label: 'Select Employee',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...employees
            .filter(el => {
              if (filter.departmentId === 0) return true;
              return el.employeeDepartmentId === filter.departmentId;
            })
            .map(el => ({
              label: getCustomerName(el),
              value: el.id,
            })),
        ],
      },
      ...(role === 'Manager'
        ? [
            {
              name: 'week' as const,
              label: 'Select Week',
              options: weekOptions,
              onChange: async (date: React.ReactText) =>
                handleSelectNewWeek(date),
            },
          ]
        : []),
    ],
  ];
  let isTimesheet = true;
  let isTimeoffRequests = true;
  let isSpiffs = true;
  let isToolLogs = true;
  let isPerDiem = true;
  let isTrips = true;
  if (role === 'Auditor') {
    isTimesheet = false;
    isTimeoffRequests = false;
  } else if (role === 'Manager') {
    isSpiffs = false;
    isTrips = false;
  }

  return (
    <div>
      <SectionBar title="Payroll" />
      {initiated ? (
        role ? (
          <>
            <PlainForm
              data={filter}
              onChange={handleSetFilter}
              schema={SCHEMA}
              className="PayrollFilter"
            />
            <Tabs
              tabs={[
                ...(isTimesheet
                  ? [
                      {
                        label: 'Timesheet',
                        content: (
                          <Timesheet
                            departmentId={filter.departmentId}
                            employeeId={filter.employeeId}
                            week={filter.week}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isTimeoffRequests
                  ? [
                      {
                        label: 'Timeoff Requests',
                        content: (
                          <TimeoffRequests
                            departmentId={filter.departmentId}
                            employeeId={filter.employeeId}
                            week={filter.week}
                            role={role}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isSpiffs
                  ? [
                      {
                        label: 'Spiffs',
                        content: (
                          <Spiffs
                            employeeId={filter.employeeId}
                            week={filter.week}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isToolLogs
                  ? [
                      {
                        label: 'Tool Logs',
                        content: (
                          <ToolLogs
                            employeeId={filter.employeeId}
                            week={filter.week}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isPerDiem
                  ? [
                      {
                        label: 'Per Diem',
                        content: (
                          <PerDiem
                            departmentId={filter.departmentId}
                            employeeId={filter.employeeId}
                            week={filter.week}
                            loggedUserId={userID}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isTrips
                  ? [
                      {
                        label: 'Trips',
                        content: (
                          <TripSummary
                            loggedUserId={filter.employeeId}
                            perDiemRowIds={loadedPerDiemIds}
                            key={
                              loadedPerDiemIds.toString() + filter.employeeId
                            }
                            searchable
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </>
        ) : (
          <Alert severity="error">
            You don&apos;t have persmission to view Payroll
          </Alert>
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};
