import React, { FC, useState, useEffect, useCallback } from 'react';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
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
                    value: e.technicianUserId,
                  },
                  {
                    value: e.departmentCode,
                  },
                  {
                    value: formatDateTime(e.timeStarted),
                  },
                  {
                    value: formatDateTime(e.timeFinished),
                  },
                ];
              })
        }
      />
    </div>
  );
};
