import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import Alert from '@material-ui/lab/Alert';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { Loader } from '../../Loader/main';
import { Tabs } from '../Tabs';
import {
  UserClientService,
  UserType,
  TimesheetDepartmentType,
  getWeekOptions,
  PerDiemClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import { OPTION_ALL } from '../../../constants';
import { PayrollSummary } from './components/PayrollSummary';
import { PerDiem } from './components/PerDiem';
import { Timesheet } from './components/Timesheet';
import { TimeoffRequests } from './components/TimeoffRequests';
import { TimesheetPendingApproval } from './components/TimesheetPendingApproval';
import { Spiffs } from './components/Spiffs';
import { ToolLogs } from './components/ToolLogs';
import './styles.less';
import { TripSummary } from '../TripSummary';
import { Button } from '../Button';
import { CostReportForEmployee } from '../CostReportForEmployee';
import {
  PerDiemList,
  PerDiem as pd,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { dateTimePickerDefaultProps } from '@material-ui/pickers/constants/prop-types';
import { Modal } from '@material-ui/core';

export type RoleType =
  | 'Manager'
  | 'Payroll'
  | 'Auditor'
  | 'Accounts_Payable'
  | '';

interface Props {
  userID: number;
}

export type FilterData = {
  departmentId: number;
  employeeId: number;
  week: string;
  vendor?: string;
  accepted?: boolean;
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
  const [role, setRole] = useState<RoleType>('');
  const [employees, setEmployees] = useState<UserType[]>([]);
  const [loadedPerDiemIds, setLoadedPerDiemIds] = useState<number[]>([]);
  const [viewReport, setViewReport] = useState<boolean>(false);
  const weekOptions = useMemo(
    () => [
      { label: OPTION_ALL, value: OPTION_ALL },
      ...getWeekOptions(52, 0, -1),
    ],
    [],
  );
  const handleSelectNewWeek = useCallback(
    async dateString => {
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
        let pdList = await PerDiemClientService.getPerDiemRowIds(date);
        ids = pdList
          ?.getResultsList()
          .filter(perdiem =>
            filter.employeeId != 0 ? perdiem.getUserId() == userID : true,
          )
          .map(pd => pd.getId());
        ids ? setLoadedPerDiemIds(ids) : setLoadedPerDiemIds([]);
      }
    },
    [filter.employeeId, userID],
  );
  const init = useCallback(async () => {
    const departments = await TimesheetDepartmentClientService.loadTimeSheetDepartments();
    setDepartments(departments);
    const employees = await UserClientService.loadTechnicians();
    let sortedEmployeeList = employees.sort((a, b) =>
      a.lastname > b.lastname ? 1 : -1,
    );
    setEmployees(sortedEmployeeList);
    handleSelectNewWeek('-- All --');
    const loggedUser = await UserClientService.loadUserById(userID);
    setLoggedUser(loggedUser);
    const role = loggedUser.permissionGroupsList.find(p => p.type === 'role');
    if (role) {
      setRole(role.name as RoleType);
    }
    setInitiated(true);
  }, [handleSelectNewWeek, userID]);

  useEffect(() => {
    if (!initiated) {
      init();
    }
  }, [initiated, init]);
  const getDepartmentOptions = () => {
    return [
      { label: OPTION_ALL, value: 0 },
      ...departments.map(el => ({
        label: TimesheetDepartmentClientService.getDepartmentName(el),
        value: el.id,
      })),
    ];
  };
  let departmentOptions: Option[] = useMemo(getDepartmentOptions, [
    departments,
  ]);
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
  }, [departmentOptions, filter, initiatedRole, role]);
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
              label: UserClientService.getCustomerName(el),
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
  let isEmployeeReport = false;
  let isToolLogs = true;
  let isPerDiem = true;
  let isTrips = true;
  let isPendingTimesheet = false;
  let isPayrollSummary = false;
  if (role === 'Payroll') {
    isPayrollSummary = true;
    isPendingTimesheet = true;
  }
  if (role === 'Auditor') {
    isTimesheet = false;
    isTimeoffRequests = false;
  }
  if (role === 'Manager') {
    isEmployeeReport = true;
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
                            type={role}
                            loggedUser={userID}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isPayrollSummary
                  ? [
                      {
                        label: 'Payroll Summary',
                        content: (
                          <PayrollSummary
                            departmentId={filter.departmentId}
                            employeeId={filter.employeeId}
                            week={filter.week}
                            type={role}
                            loggedUser={userID}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isPendingTimesheet
                  ? [
                      {
                        label: 'Pending Timesheets',
                        content: (
                          <TimesheetPendingApproval
                            departmentId={filter.departmentId}
                            employeeId={filter.employeeId}
                            week={filter.week}
                            type={'Manager'}
                            loggedUser={userID}
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
                            loggedUserId={userID}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isSpiffs
                  ? [
                      {
                        label: 'Spiff/Bonus/Commission',
                        content: (
                          <Spiffs
                            employeeId={filter.employeeId}
                            week={filter.week}
                            role={role}
                            loggedUserId={userID}
                            departmentId={filter.departmentId}
                            key={filter.departmentId + 'key'}
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
                            userId={userID}
                            role={role}
                            departmentId={filter.departmentId}
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
                            role={role}
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
                            role={role}
                            loggedUserId={loggedUser ? loggedUser!.id : 0}
                            userId={filter.employeeId}
                            perDiemRowIds={loadedPerDiemIds}
                            key={
                              loadedPerDiemIds.toString() +
                              filter.employeeId +
                              filter.departmentId +
                              loggedUser
                            }
                            canProcessPayroll={role === 'Payroll'}
                            canApprove={role === 'Manager'}
                            canSlackMessageUsers
                            hoverable
                            departmentId={filter.departmentId}
                          />
                        ),
                      },
                    ]
                  : []),
                ...(isEmployeeReport
                  ? [
                      {
                        label: 'Employee Report',
                        content:
                          filter.employeeId != 0 &&
                          filter.week != OPTION_ALL ? (
                            <div>
                              <CostReportForEmployee
                                key={userID.toString() + filter.week}
                                userId={filter.employeeId}
                                onClose={() => setViewReport(false)}
                                loggedUserId={loggedUser!.id}
                                week={filter.week}
                                username={filter.employeeId.toString()}
                              ></CostReportForEmployee>
                            </div>
                          ) : (
                            <div>No Filter Detected</div>
                          ),
                      },
                    ]
                  : []),
              ]}
            />
          </>
        ) : (
          <Alert severity="error">
            You don&apos;t have permission to view Payroll
          </Alert>
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};
