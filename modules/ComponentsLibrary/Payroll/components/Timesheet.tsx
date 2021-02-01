import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
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

  const [pendingView, setPendingView] = useState<TimesheetLineType>();
  const load = useCallback(async () => {
    setLoading(true);
    const filter = {
      page,
      departmentId,
      employeeId,
      type: type,
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 6), 'yyyy-MM-dd'),
      });
    }
    const getTimesheets = createTimesheetFetchFunction(filter);
    const { resultsList, totalCount } = (await getTimesheets()).toObject();
    setTimesheets(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [page, departmentId, employeeId, week, type]);
  useEffect(() => {
    load();
  }, [load]);
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
                    value: formatWeek(e.weekStart),
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
            userId={loggedUser}
            week={pendingView.timeStarted}
            onClose={handleTogglePendingView(undefined)}
          />
        </Modal>
      )}
    </div>
  );
};

interface GetTimesheetConfig {
  page?: number;
  departmentID?: number;
  technicianUserID?: number;
  startDate?: string;
  endDate?: string;
  type: RoleType;
}

const createTimesheetFetchFunction = (config: GetTimesheetConfig) => {
  const req = new TimesheetLine();
  req.setPageNumber(config.page || 0);
  req.setOrderBy('time_started');
  req.setGroupBy('technician_user_id');
  req.setIsActive(1);
  req.setNotEqualsList(['UserApprovalDatetime']);
  req.setUserApprovalDatetime(NULL_TIME);

  const client = new TimesheetLineClient(ENDPOINT);

  if (config.startDate && config.endDate) {
    req.setDateRangeList(['>=', config.startDate, '<=', config.endDate]);
  }
  if (config.departmentID) {
    req.setDepartmentCode(config.departmentID);
  }
  if (config.technicianUserID) {
    req.setTechnicianUserId(config.technicianUserID);
  }

  if (config.type === 'Payroll') {
    req.setNotEqualsList(['UserApprovalDatetime', 'AdminApprovalUserId']);
  } else if (config.type === 'Manager') {
    req.setFieldMaskList(['AdminApprovalUserId']);
  }

  return () => client.BatchGet(req);
};

const getManagerTimesheets = () => {};

const getPayrollTimesheets = () => {};
