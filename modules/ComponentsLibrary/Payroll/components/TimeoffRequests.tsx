import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { Timesheet as TimesheetComponent } from '../../../ComponentsLibrary/Timesheet';
import {
  loadTimeoffRequests,
  TimeoffRequestType,
  makeFakeRows,
  formatWeek,
  GetTimesheetConfig,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';

interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
  role: string;
}

export const TimeoffRequests: FC<Props> = ({
  departmentId,
  employeeId,
  week,
  role,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timeoffRequests, setTimeoffRequests] = useState<TimeoffRequestType[]>(
    [],
  );
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TimeoffRequestType>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter: GetTimesheetConfig = {
      page,
      departmentID: departmentId,
      technicianUserID: employeeId,
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 6), 'yyyy-MM-dd'),
      });
    }
    if (role === 'Payroll') {
      Object.assign(filter, { requestType: 9 });
    }
    const { resultsList, totalCount } = await loadTimeoffRequests(filter);
    setTimeoffRequests(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, departmentId, employeeId, week, role]);
  useEffect(() => {
    load();
  }, [page, departmentId, employeeId, week, role]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimeoffRequestType) => () => setPendingView(pendingView),
    [],
  );
  return (
    <div>
      <SectionBar
        title="Timeoff Requests"
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
            : timeoffRequests.map(e => {
                return [
                  {
                    value: e.userName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.departmentName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatWeek(e.timeStarted),
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
        <Modal open onClose={handleTogglePendingView(undefined)} fullScreen>
          <TimesheetComponent
            timesheetOwnerId={pendingView.userId}
            userId={pendingView.userId}
            week={pendingView.timeStarted}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};
