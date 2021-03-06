import React, { FC, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { Trip } from '../../../../@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import { Modal } from '../../Modal';
import { SectionBar } from '../../SectionBar';
import { InfoTable } from '../../InfoTable';
import { TripSummaryNew } from '../../TripSummaryNew';
import { Tooltip } from '../../Tooltip';
import { Button } from '../../Button';
import {
  makeFakeRows,
  formatDate,
  PerDiemClientService,
} from '../../../../helpers';
import { NULL_TIME, OPTION_ALL, ROWS_PER_PAGE } from '../../../../constants';
import { RoleType } from '../index';
import { startOfWeek, subDays, addDays } from 'date-fns';
import { truncate } from 'lodash';
import { NULL_TIME_VALUE } from '../../Timesheet/constants';

interface Props {
  loggedUserId: number;
  departmentId: number;
  employeeId: number;
  week: string;
  role: RoleType;
}

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'MMMM')}, ${format(d, 'do')}`;
};
const formatDateFns = (date: Date) => format(date, 'yyyy-MM-dd');

export const Trips: FC<Props> = ({
  loggedUserId,
  departmentId,
  employeeId,
  week,
  role,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [Trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [TripViewed, setTripViewed] = useState<Trip>();
  const [toggleButton, setToggleButton] = useState<boolean>(false);
  const managerFilter = role === 'Manager';
  const auditorFilter = role == 'Auditor';
  const payrollFilter = role == 'Payroll';
  const today = new Date();
  const startDay = startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
  const endDay = addDays(startDay, 7);
  const load = useCallback(async () => {
    setLoading(true);
    const today = new Date();
    const startDay = startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
    const endDay = addDays(startDay, 7);
    const tripReq = new Trip();
    tripReq.setPage(page);
    tripReq.setGroupBy('user_id');
    tripReq.setIsActive(true);
    if (departmentId) {
      tripReq.setDepartmentId(departmentId);
    }
    if (employeeId) {
      tripReq.setUserId(employeeId);
    }
    if (payrollFilter && !toggleButton) {
      tripReq.addFieldMask('PayrollProcessed');
      tripReq.setApproved(true);
      tripReq.addNotEquals('AdminActionDate');
      tripReq.setAdminActionDate(NULL_TIME_VALUE);
    }
    if (payrollFilter && toggleButton) {
      tripReq.setPayrollProcessed(true);
      tripReq.setApproved(true);
      tripReq.addNotEquals('AdminActionDate');
      tripReq.setAdminActionDate(NULL_TIME_VALUE);
    }
    if (managerFilter) {
      tripReq.setAdminActionDate(NULL_TIME);
      tripReq.setDateRangeList([
        '>=',
        '0001-01-01',
        '<',
        formatDateFns(endDay),
      ]);
      tripReq.setDateTargetList(['date']);
    }
    console.log({ tripReq });
    const trips = await PerDiemClientService.BatchGetTrips(tripReq);
    console.log(trips.getResultsList());
    setTrips(trips.getResultsList());
    setCount(trips.getTotalCount());
    setLoading(false);
    setLoaded(true);
  }, [
    departmentId,
    employeeId,
    page,
    payrollFilter,
    toggleButton,
    managerFilter,
  ]);

  useEffect(() => {
    load();
  }, [load]);
  const handleTripViewedToggle = useCallback(
    (Trip?: Trip) => () => setTripViewed(Trip),
    [setTripViewed],
  );

  const handleToggleButton = useCallback(() => {
    setToggleButton(!toggleButton);
    setPage(0);
  }, [toggleButton]);
  return (
    <div>
      <SectionBar
        title="Trips"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: setPage,
        }}
      />
      {role === 'Payroll' && (
        <Button
          label={
            toggleButton === false
              ? 'Show Processed Records'
              : 'Show Unprocessed Records'
          }
          onClick={() => handleToggleButton()}
        ></Button>
      )}
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Date' },
          { name: 'Week' },
        ]}
        data={
          loading
            ? makeFakeRows(6, 3)
            : Trips.map(el => {
                return [
                  {
                    value: el.getUserName(),
                    onClick: handleTripViewedToggle(el),
                  },
                  {
                    value: el.getDepartmentName(),
                    onClick: handleTripViewedToggle(el),
                  },
                  {
                    value: formatDate(el.getDate()),
                    onClick: handleTripViewedToggle(el),
                  },
                  {
                    value: formatWeek(el.getDate()),
                    onClick: handleTripViewedToggle(el),
                    actions: [
                      <Tooltip
                        key="view"
                        content="View Trips"
                        placement="bottom"
                      >
                        <IconButton
                          size="small"
                          onClick={handleTripViewedToggle(el)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>,
                    ],
                  },
                ];
              })
        }
        loading={loading}
      />
      {TripViewed && (
        <Modal open onClose={handleTripViewedToggle(undefined)} fullScreen>
          <SectionBar
            actions={[
              { label: 'Close', onClick: handleTripViewedToggle(undefined) },
            ]}
            fixedActions
            className="TripNeedsAuditingModalBar"
          />
          <TripSummaryNew
            perDiemRowIds={[]}
            role={role}
            loggedUserId={loggedUserId}
            canApprove={role === 'Manager'}
            canProcessPayroll={role === 'Payroll'}
            userId={TripViewed.getUserId()}
            toggle={role === 'Payroll' ? toggleButton : undefined}
            checkboxes={role === 'Payroll'}
            managerView={role === 'Manager'}
          />
        </Modal>
      )}
    </div>
  );
};
