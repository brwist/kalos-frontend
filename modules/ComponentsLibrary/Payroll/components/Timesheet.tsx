import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import PageviewIcon from '@material-ui/icons/Pageview';
import { Timesheet as TimesheetComponent } from '../../../ComponentsLibrary/Timesheet';
import { TimesheetLineType, makeFakeRows, UserType } from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';
import {
  TimesheetLine,
  TimesheetLineClient,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { ENDPOINT, NULL_TIME } from '../../../../constants';
import { RoleType } from '../index';
import { PropertyService } from '@kalos-core/kalos-rpc/compiled-protos/property_pb_service';
import { TimesheetSummary } from './TimesheetSummary';

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

export const Timesheet: FC<Props> = ({
  departmentId,
  employeeId,
  week,
  type,
  loggedUser,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [
    timesheetSummaryToggle,
    setTimesheetSummaryToggle,
  ] = useState<TimesheetLineType>();
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(startDay, 6));
  const [pendingView, setPendingView] = useState<TimesheetLineType>();
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

    const getTimesheets = createTimesheetFetchFunction(filter, type);
    const { resultsList, totalCount } = (await getTimesheets()).toObject();
    let sortedResultsLists = resultsList.sort((a, b) =>
      a.technicianUserName.split(' ')[1] > b.technicianUserName.split(' ')[1]
        ? 1
        : -1,
    );

    setTimesheets(sortedResultsLists);
    setCount(totalCount);
    setLoading(false);
  }, [page, departmentId, employeeId, week, type]);
  useEffect(() => {
    load();
  }, [load]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimesheetLineType) => () => {
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
          onChangePage: setPage,
        }}
      />
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Week' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timesheets.map(e => {
                return [
                  {
                    value: e.technicianUserName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.departmentName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatWeek(e.weekEnd),
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,

                      <IconButton
                        key="summary"
                        onClick={() => setTimesheetSummaryToggle(e)}
                        size="small"
                        disabled={type != 'Payroll'}
                      >
                        <PageviewIcon />
                      </IconButton>,
                    ],
                  },
                ];
              })
        }
      />
      {pendingView && (
        <Modal open onClose={handleTogglePendingView(undefined)} fullScreen>
          <TimesheetComponent
            timesheetOwnerId={pendingView.technicianUserId}
            userId={loggedUser}
            week={pendingView.timeStarted}
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
            userId={timesheetSummaryToggle.technicianUserId}
            loggedUserId={loggedUser}
            notReady={false}
            onClose={() => setTimesheetSummaryToggle(undefined)}
            username={timesheetSummaryToggle.technicianUserName}
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
  if (config.type === 'Payroll') {
    req.setWithoutLimit(true);
  }
  if (config.type != 'Payroll' && config.page) {
    req.setPageNumber(config.page);
  }
  req.setNotEqualsList(['UserApprovalDatetime']);
  req.setUserApprovalDatetime(NULL_TIME);
  const client = new TimesheetLineClient(ENDPOINT);
  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
  }
  if (config.departmentId) {
    req.setDepartmentCode(config.departmentId);
  }
  if (config.employeeId) {
    req.setTechnicianUserId(config.employeeId);
  }

  if (config.type === 'Payroll') {
    req.setNotEqualsList(['UserApprovalDatetime', 'AdminApprovalUserId']);
    req.setFieldMaskList(['PayrollProcessed']);
  } else if (config.type === 'Manager') {
    req.addNotEquals('UserApprovalDatetime');
  }
  if (config.type == 'Manager') {
    return () => client.BatchGetManager(req); // Goes to the manager View in the database instead of the combined view from before, speed gains
  } else {
    return () => client.BatchGetPayroll(req); // Payroll does the same but to a specific Payroll view
  }
};

const getManagerTimesheets = () => {};

const getPayrollTimesheets = () => {};
