import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import {
  makeFakeRows,
  TimesheetLineClientService,
  roundNumber,
  UserClientService,
} from '../../../../helpers';
import { OPTION_ALL } from '../../../../constants';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../../../constants';
import { RoleType } from '../index';
import { NULL_TIME_VALUE } from '../../Timesheet/constants';
import { CostSummary } from '../../CostSummary';
import { differenceInMinutes } from 'date-fns';
interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
  type: RoleType;
  loggedUser: number;
}

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'yyyy')} ${format(d, 'MMMM')}, ${format(
    d,
    'do',
  )}`;
};
type EmployeeHourSum = {
  id: number;
  hours: number;
};
export const PayrollSummary: FC<Props> = ({
  employeeId,
  departmentId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>([]);
  const [processedHours, setProcessedHours] = useState<EmployeeHourSum[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TimesheetLine>();
  const startDay = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const load = useCallback(async () => {
    const filter = {
      employeeId,
      departmentId,
      type: type,
      toggle: false,
      startDate: format(startDay, 'yyyy-MM-dd'),
      endDate: format(endDay, 'yyyy-MM-dd'),
      groupBy: true,
    };
    console.log('got called to load');
    const getTimesheets = createTimesheetFetchFunction(filter);
    filter.groupBy = false;
    const salariedIds = await UserClientService.GetUserIdsInPermissionGroup(41);
    const salariedUsers = (
      await UserClientService.loadUsersByIds(salariedIds, true)
    ).getResultsList();

    const getFullTimesheets = createTimesheetFetchFunction(filter);
    const fullResult = (await getFullTimesheets()).getResultsList();
    let tempList = [];
    for (let i = 0; i < fullResult.length; i++) {
      let found = false;
      for (let j = 0; j < tempList.length; j++) {
        if (tempList[j].id === fullResult[i].getTechnicianUserId()) {
          const timeFinished = fullResult[i].getTimeFinished();
          const timeStarted = fullResult[i].getTimeStarted();
          const subtotal = roundNumber(
            differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
              60,
          );
          found = true;
          tempList[j].hours += subtotal;
          break;
        }
      }
      if (found === false) {
        const timeFinished = fullResult[i].getTimeFinished();
        const timeStarted = fullResult[i].getTimeStarted();
        const subtotal = roundNumber(
          differenceInMinutes(parseISO(timeFinished), parseISO(timeStarted)) /
            60,
        );

        tempList.push({
          id: fullResult[i].getTechnicianUserId(),
          hours: subtotal,
        });
      }
    }

    const result = await getTimesheets();
    const resultsList = result.getResultsList();

    const totalCount = result.getTotalCount();

    for (let i = 0; i < salariedUsers.length; i++) {
      let found = false;
      for (let j = 0; j < resultsList.length; j++) {
        if (salariedUsers[i].getId() === resultsList[j].getTechnicianUserId()) {
          found = true;
          break;
        }
      }
      if (employeeId) {
        if (salariedUsers[i].getId() != employeeId) {
          found = true;
        }
      }
      if (departmentId) {
        if (salariedUsers[i].getEmployeeDepartmentId() != departmentId) {
          found = true;
        }
      }
      if (found === false) {
        let tempTimesheet = new TimesheetLine();
        tempTimesheet.setAdminApprovalDatetime(NULL_TIME_VALUE);
        tempTimesheet.setUserApprovalDatetime(NULL_TIME_VALUE);
        tempTimesheet.setTechnicianUserId(salariedUsers[i].getId());
        tempTimesheet.setReferenceNumber('auto');
        tempTimesheet.setDepartmentName(
          salariedUsers[i].getDepartment()!.getDescription(),
        );
        tempTimesheet.setTechnicianUserName(
          `${salariedUsers[i].getFirstname()}  ${salariedUsers[
            i
          ].getLastname()}`,
        );
        resultsList.push(tempTimesheet);
      }
    }

    const compare = (a: TimesheetLine, b: TimesheetLine) => {
      const splitA = a.getTechnicianUserName().split(' ');
      const splitB = b.getTechnicianUserName().split(' ');
      const lastA = splitA[splitA.length - 1].toLowerCase();
      const lastB = splitB[splitB.length - 1].toLowerCase();
      const firstA = splitA[0].toLowerCase();
      const firstB = splitB[0].toLowerCase();

      if (lastA + firstA < lastB + firstB) return -1;
      if (lastA + firstA > lastB + firstB) return 1;
      return 0;
    };
    const sortedResultsList = resultsList.sort(compare);

    setTimesheets(sortedResultsList);
    setProcessedHours(tempList);
    setCount(sortedResultsList.length);
    setLoading(false);
  }, [employeeId, departmentId]);
  useEffect(() => {
    load();
  }, [load]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimesheetLine) => () => {
      setPendingView(pendingView);
      load();
    },
    [load],
  );
  const handleNextEmployee = () => {
    let tempPendingView = pendingView;
    setPendingView(undefined);
    if (tempPendingView != undefined) {
      for (let i = 0; i < timesheets.length; i++) {
        if (
          timesheets[i].getTechnicianUserId() ===
          tempPendingView.getTechnicianUserId()
        ) {
          tempPendingView = timesheets[i + 1];
          break;
        }
      }
    }

    setTimeout(() => {
      setPendingView(tempPendingView);
    }, 1000);
  };
  const handlePreviousEmployee = () => {
    let tempPendingView = pendingView;
    setPendingView(undefined);
    if (tempPendingView != undefined) {
      for (let i = 0; i < timesheets.length; i++) {
        if (
          timesheets[i].getTechnicianUserId() ===
          tempPendingView.getTechnicianUserId()
        ) {
          tempPendingView = timesheets[i - 1];
          break;
        }
      }
    }

    setTimeout(() => {
      setPendingView(tempPendingView);
    }, 1000);
  };
  return (
    <div>
      <SectionBar
        title="Payroll Summary"
        pagination={{
          count,
          page: count - 1,
          rowsPerPage: 1,
          onPageChange: setPage,
        }}
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Processed Hours' },
          { name: 'Department' },
          { name: 'Admin Approval Date' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 4)
            : timesheets.map(e => {
                return [
                  {
                    value: e.getTechnicianUserName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: processedHours[
                      processedHours.findIndex(
                        i => i.id === e.getTechnicianUserId(),
                      )
                    ]
                      ? processedHours[
                          processedHours.findIndex(
                            i => i.id === e.getTechnicianUserId(),
                          )
                        ].hours
                      : 'No Hours Processed',
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.getSearchUser()?.getEmployeeDepartmentId()
                      ? e.getSearchUser()!.getEmployeeDepartmentId()
                      : e.getDepartmentName(),
                    onClick: handleTogglePendingView(e),
                  },

                  {
                    value:
                      e.getAdminApprovalDatetime() === NULL_TIME_VALUE
                        ? 'Not Approved'
                        : formatWeek(e.getAdminApprovalDatetime()),
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal
          open={pendingView ? true : false}
          onClose={handleTogglePendingView(undefined)}
          fullScreen
        >
          <CostSummary
            userId={
              employeeId === 0 ? pendingView.getTechnicianUserId() : employeeId
            }
            username={pendingView.getTechnicianUserName()}
            onClose={handleTogglePendingView(undefined)}
            loggedUserId={loggedUser}
            notReady={false}
            onNext={() => handleNextEmployee()}
            onPrevious={() => handlePreviousEmployee()}
          ></CostSummary>
        </Modal>
      )}
    </div>
  );
};

interface GetTimesheetConfig {
  page?: number;
  departmentId?: number;
  employeeId: number;
  startDate?: string;
  endDate?: string;
  toggle: boolean;
  groupBy?: boolean;
}

const createTimesheetFetchFunction = (config: GetTimesheetConfig) => {
  const req = new TimesheetLine();
  req.setPageNumber(config.page || 0);
  req.setOrderBy('time_started');
  if (config.groupBy) {
    req.setGroupBy('technician_user_id');
  }
  req.setIsActive(1);
  req.setWithoutLimit(true);
  const client = new TimesheetLineClient(ENDPOINT);
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<', config.endDate]);
    req.setDateTargetList(['time_started', 'time_started']);
  }
  if (config.employeeId) {
    req.setTechnicianUserId(config.employeeId);
  }
  if (config.departmentId) {
    //req.setDepartmentCode(config.departmentId);
    const tempUser = new User();
    tempUser.setEmployeeDepartmentId(config.departmentId);
    req.setSearchUser(tempUser);
  }

  if (config.toggle === true) {
    //look like manager
    req.setUserApprovalDatetime(NULL_TIME_VALUE);
    req.setFieldMaskList(['PayrollProcessed']);
    req.setNotEqualsList(['UserApprovalDatetime']);
  }
  if (config.toggle === false) {
    req.setNotEqualsList(['AdminApprovalUserId', 'PayrollProcessed']);
  }
  if (config.toggle === true) {
    return () => client.BatchGetManager(req);
  } else {
    return () => client.BatchGetPayroll(req);
  }
};
