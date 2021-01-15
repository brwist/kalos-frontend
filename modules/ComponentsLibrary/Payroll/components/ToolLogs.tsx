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
  loadPendingToolLogs,
  TaskType,
  makeFakeRows,
  formatWeek,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';

interface Props {
  employeeId: number;
  week: string;
}

export const ToolLogs: FC<Props> = ({ employeeId, week }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [toolLogs, setToolLogs] = useState<TaskType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TaskType>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      employeeId,
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 6), 'yyyy-MM-dd'),
      });
    }
    const { resultsList, totalCount } = await loadPendingToolLogs(filter);
    console.log({ resultsList });
    setToolLogs(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, employeeId, week]);
  useEffect(() => {
    load();
  }, [page, employeeId, week]);
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
            : toolLogs.map(e => {
                return [
                  {
                    value: e.ownerName,
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.timeDue
                      ? formatWeek(
                          format(
                            startOfWeek(parseISO(e.timeDue), {
                              weekStartsOn: 6,
                            }),
                            'yyyy-MM-dd',
                          ),
                        )
                      : e.timeDue,
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
            type="Tool"
            kind="Weekly"
            week={
              pendingView.timeDue
                ? format(
                    startOfWeek(parseISO(pendingView.timeDue), {
                      weekStartsOn: 6,
                    }),
                    'yyyy-MM-dd',
                  )
                : undefined
            }
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};
