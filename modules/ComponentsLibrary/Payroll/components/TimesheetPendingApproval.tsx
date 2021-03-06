import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../SectionBar';
import { InfoTable } from '../../InfoTable';
import { Modal } from '../../Modal';
import { Confirm } from '../../Confirm';
import PageviewIcon from '@material-ui/icons/Pageview';
import { Timesheet as TimesheetComponent } from '../../Timesheet';
import { makeFakeRows } from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '../../../../@kalos-core/kalos-rpc/TimesheetLine';
import { User } from '../../../../@kalos-core/kalos-rpc/User';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { RoleType } from '../index';
import { TimesheetSummary } from './TimesheetSummary';
import AddIcon from '@material-ui/icons/Add';
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

export const TimesheetPendingApproval: FC<Props> = ({
  departmentId,
  employeeId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timesheets, setTimesheets] = useState<TimesheetLine[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const [timesheetSummaryToggle, setTimesheetSummaryToggle] =
    useState<TimesheetLine>();
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 7));
  const [pendingView, setPendingView] = useState<TimesheetLine>();
  const [pendingCreateEmptyTimesheetLine, setPendingCreateEmptyTimesheetLine] =
    useState<TimesheetLine>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      departmentId,
      employeeId,
      type: type,
      startDate: format(startDay, 'yyyy-MM-dd'),
      endDate: format(endDay, 'yyyy-MM-dd'),
    };
    if (week !== OPTION_ALL && type != 'Payroll') {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }

    const getTimesheets = createTimesheetFetchFunction(filter, type);
    const results = await getTimesheets();
    const resultsList = results.getResultsList();
    let sortedResultsLists = resultsList.sort((a, b) =>
      a.getTechnicianUserName().split(' ')[1] >
      b.getTechnicianUserName().split(' ')[1]
        ? 1
        : -1,
    );
    setTimesheets(sortedResultsLists);
    setCount(sortedResultsLists.length);
    setLoading(false);
  }, [page, departmentId, employeeId, week, endDay, startDay, type]);
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

  return (
    <div>
      <SectionBar
        title="Timesheet"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: setPage,
        }}
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: type === 'Manager' ? 'Status' : 'Week Approved' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timesheets.map(e => {
                return [
                  {
                    value: e.getTechnicianUserName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.getDepartmentName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value:
                      type === 'Manager'
                        ? e.getUserApprovalDatetime() === NULL_TIME
                          ? e.getReferenceNumber() === 'auto'
                            ? 'No Timesheet Submitted'
                            : 'Timesheet Pending'
                          : 'Submitted'
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
                      type === 'Payroll' && (
                        <IconButton
                          key="summary"
                          onClick={() => setTimesheetSummaryToggle(e)}
                          size="small"
                          disabled={type != 'Payroll'}
                        >
                          <PageviewIcon />
                        </IconButton>
                      ),
                      e.getReferenceNumber() === 'auto' && (
                        <IconButton
                          key="createEmpty"
                          onClick={() => setPendingCreateEmptyTimesheetLine(e)}
                          size="small"
                          disabled={type != 'Manager'}
                        >
                          <AddIcon />
                        </IconButton>
                      ),
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal open onClose={handleTogglePendingView(undefined)} fullScreen>
          <TimesheetComponent
            timesheetOwnerId={pendingView.getTechnicianUserId()}
            userId={loggedUser}
            week={pendingView.getTimeStarted()}
            onClose={handleTogglePendingView(undefined)}
            startOnWeek={type === 'Payroll' || type === 'Manager'}
          />
        </Modal>
      )}
      {timesheetSummaryToggle && (
        <Modal
          open
          onClose={() => setTimesheetSummaryToggle(undefined)}
          fullScreen
        >
          <TimesheetSummary
            userId={timesheetSummaryToggle.getTechnicianUserId()}
            loggedUserId={loggedUser}
            notReady={false}
            onClose={() => setTimesheetSummaryToggle(undefined)}
            username={timesheetSummaryToggle.getTechnicianUserName()}
          ></TimesheetSummary>
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
  type: RoleType;
}

const createTimesheetFetchFunction = (
  config: GetTimesheetConfig,
  role: RoleType,
) => {
  const req = new TimesheetLine();
  req.setGroupBy('technician_user_id');
  req.setIsActive(1);
  req.setWithoutLimit(true);

  if (config.type != 'Payroll' && config.page) {
    req.setPageNumber(config.page);
  }
  const client = new TimesheetLineClient(ENDPOINT);
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<', config.endDate]);
  }
  if (config.departmentId) {
    //req.setDepartmentCode(config.departmentId); for class code
    const tempUser = new User();
    tempUser.setEmployeeDepartmentId(config.departmentId);
    req.setSearchUser(tempUser);
  }
  if (config.employeeId) {
    req.setTechnicianUserId(config.employeeId);
  }

  if (config.type === 'Payroll') {
    req.setNotEqualsList(['AdminApprovalUserId']);
    req.setFieldMaskList(['PayrollProcessed']);
  } else if (config.type === 'Manager') {
    req.setFieldMaskList(['AdminApprovalUserId']);
  }
  req.addFieldMask('ClassCode');
  if (config.type == 'Manager') {
    return () => client.BatchGetManager(req); // Goes to the manager View in the database instead of the combined view from before, speed gains
  } else {
    return () => client.BatchGetPayroll(req); // Payroll does the same but to a specific Payroll view
  }
};

const getManagerTimesheets = () => {};

const getPayrollTimesheets = () => {};
