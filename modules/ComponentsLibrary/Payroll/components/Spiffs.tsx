import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { SpiffTool } from '../../../SpiffToolLogs/components/SpiffTool';
import {
  loadPendingSpiffs,
  TaskType,
  makeFakeRows,
  formatWeek,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';

interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
}

export const Spiffs: FC<Props> = ({ departmentId, employeeId, week }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [spiffs, setSpiffs] = useState<TaskType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TaskType>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      departmentId,
      employeeId,
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 6), 'yyyy-MM-dd'),
      });
    }
    const { resultsList, totalCount } = await loadPendingSpiffs(filter);
    console.log({ resultsList });
    setSpiffs(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, departmentId, employeeId, week]);
  useEffect(() => {
    load();
  }, [page, departmentId, employeeId, week]);
  const handleTogglePendingView = useCallback(
    (pendingView?: TaskType) => () => setPendingView(pendingView),
    [],
  );
  return (
    <div>
      <SectionBar
        title="Spiffs"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: setPage,
        }}
      />
      <InfoTable
        columns={[{ name: 'Employee' }, { name: 'Week' }]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(2, 3)
            : spiffs.map(e => {
                return [
                  {
                    value: e.ownerName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: formatWeek(
                      format(
                        startOfWeek(parseISO(e.datePerformed), {
                          weekStartsOn: 6,
                        }),
                        'yyyy-MM-dd',
                      ),
                    ),
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
          <SpiffTool
            loggedUserId={pendingView.externalId}
            type="Spiff"
            kind="Weekly"
            week={format(
              startOfWeek(parseISO(pendingView.datePerformed), {
                weekStartsOn: 6,
              }),
              'yyyy-MM-dd',
            )}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};
