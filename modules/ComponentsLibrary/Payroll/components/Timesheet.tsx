import React, { FC, useState, useEffect, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { Timesheet as TimesheetComponent } from '../../../Timesheet/main';
import {
  loadTimesheetLine,
  TimesheetLineType,
  makeFakeRows,
  formatDateTime,
} from '../../../../helpers';
import { ROWS_PER_PAGE } from '../../../../constants';

interface Props {
  departmentId: number;
  employeeId: number;
}

export const Timesheet: FC<Props> = ({ departmentId, employeeId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [timesheets, setTimesheets] = useState<TimesheetLineType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TimesheetLineType>();
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList, totalCount } = await loadTimesheetLine({
      page,
      departmentId,
      technicianUserId: employeeId,
    });
    setTimesheets(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, departmentId, employeeId]);
  console.log({ timesheets });
  useEffect(() => {
    load();
  }, [page, departmentId, employeeId]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TimesheetLineType) => () => setPendingView(pendingView),
    [],
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
          { name: 'Employee ID' },
          { name: 'Department ID' },
          { name: 'Time Started' },
          { name: 'Time Finished' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(4, 3)
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
                    value: formatDateTime(e.timeStarted),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatDateTime(e.timeFinished),
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
            timesheetOwnerId={pendingView.technicianUserId}
            userId={pendingView.technicianUserId}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};
