import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import { parseISO, getMonth, getYear, getDaysInMonth } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { SpiffTool } from '../../../SpiffToolLogs/components/SpiffTool';
import { makeFakeRows, formatWeek } from '../../../../helpers';
import {
  TaskClient,
  Task,
  GetPendingSpiffConfig,
} from '@kalos-core/kalos-rpc/Task';
import { ROWS_PER_PAGE, OPTION_ALL, ENDPOINT } from '../../../../constants';
const TaskClientService = new TaskClient(ENDPOINT);
interface Props {
  employeeId: number;
  week: string;
  role: string;
  departmentId: number;
  userId: number;
}

export const ToolLogs: FC<Props> = ({
  employeeId,
  week,
  role,
  departmentId,
  userId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [toolLogs, setToolLogs] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<Task>();
  const [startDay, setStartDay] = useState<Date>(
    startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 }),
  );
  const [endDay, setEndDay] = useState<Date>(addDays(new Date(startDay), 6));

  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      employeeId,
      role,
      departmentId,
    };
    const startMonth = getMonth(new Date()) - 1;
    const startYear = getYear(new Date());
    const startDate = format(new Date(startYear, startMonth), 'yyyy-MM-dd');
    const endDate = format(
      addDays(
        new Date(startYear, startMonth),
        getDaysInMonth(new Date(startYear, startMonth)) - 1,
      ),
      'yyyy-MM-dd',
    );
    Object.assign(filter, {
      startDate: startDate,
      endDate: endDate,
    });
    if (week !== OPTION_ALL && role != 'Payroll') {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 6), 'yyyy-MM-dd'),
      });
    }

    const results = await TaskClientService.loadPendingToolLogs(filter);
    setToolLogs(results.getResultsList());
    setCount(results.getTotalCount());
    setLoading(false);
  }, [page, employeeId, week, role, departmentId]);
  useEffect(() => {
    load();
  }, [page, employeeId, week, load]);
  const handleTogglePendingView = useCallback(
    (pendingView?: Task) => () => setPendingView(pendingView),
    [],
  );
  return (
    <div>
      <SectionBar
        title="Tool Logs"
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
                    value: e.getOwnerName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.getTimeDue()
                      ? formatWeek(
                          format(
                            startOfWeek(parseISO(e.getTimeDue()), {
                              weekStartsOn: 6,
                            }),
                            'yyyy-MM-dd',
                          ),
                        )
                      : e.getTimeDue(),
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
            loggedUserId={userId}
            ownerId={pendingView.getExternalId()}
            type="Tool"
            needsManagerAction={role === 'Manager' ? true : false}
            needsPayrollAction={role === 'Payroll' ? true : false}
            needsAuditAction={role === 'Auditor' ? true : false}
            role={role}
            toggle
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};
