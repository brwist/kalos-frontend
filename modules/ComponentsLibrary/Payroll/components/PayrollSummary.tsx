import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import {
  TimesheetLineType,
  makeFakeRows,
  TimesheetLineClientService,
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

export const PayrollSummary: FC<Props> = ({
  employeeId,
  departmentId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);
  const [idList, setIDList] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const toggle = false;
  const [pendingView, setPendingView] = useState<TimesheetLineType>();
  const startDay = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const load = useCallback(async () => {
    const filter = {
      page,
      employeeId,
      departmentId,
      type: type,
      toggle,
      startDate: format(startDay, 'yyyy-MM-dd'),
      endDate: format(endDay, 'yyyy-MM-dd'),
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }
    const getTimesheets = createTimesheetFetchFunction(filter);
    const { resultsList, totalCount } = (await getTimesheets()).toObject();
    const compare = (a: TimesheetLine.AsObject, b: TimesheetLine.AsObject) => {
      const splitA = a.technicianUserName.split(' ');
      const splitB = b.technicianUserName.split(' ');
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
    setCount(totalCount);
    setLoading(false);
  }, [page, employeeId, week, type, toggle, departmentId, endDay, startDay]);
  useEffect(() => {
    if (loading) load();
  }, [load, loading]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimesheetLineType) => () => {
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
          timesheets[i].technicianUserId === tempPendingView.technicianUserId
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
          timesheets[i].technicianUserId === tempPendingView.technicianUserId
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
          onChangePage: setPage,
        }}
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
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
                    value: e.technicianUserName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.searchUser?.employeeDepartmentId
                      ? e.searchUser.employeeDepartmentId
                      : e.departmentName,
                    onClick: handleTogglePendingView(e),
                  },

                  {
                    value:
                      e.adminApprovalDatetime === NULL_TIME_VALUE
                        ? 'Not Approved'
                        : formatWeek(e.adminApprovalDatetime),
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
              employeeId === 0 ? pendingView.technicianUserId : employeeId
            }
            username={pendingView.technicianUserName}
            onClose={handleTogglePendingView(undefined)}
            loggedUserId={loggedUser}
            notReady={toggle}
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
}

const createTimesheetFetchFunction = (config: GetTimesheetConfig) => {
  const req = new TimesheetLine();
  req.setPageNumber(config.page || 0);
  req.setOrderBy('time_started');
  req.setGroupBy('technician_user_id');
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
