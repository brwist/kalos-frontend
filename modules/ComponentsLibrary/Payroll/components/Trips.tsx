import React, { FC, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import Visibility from '@material-ui/icons/Visibility';
import {
  Trip,
  TripList,
} from '@kalos-core/kalos-rpc/compiled-protos/perdiem_pb';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Modal } from '../../Modal';
import { SectionBar } from '../../SectionBar';
import { InfoTable } from '../../InfoTable';
import { PlainForm, Schema } from '../../PlainForm';
import { TripSummaryNew } from '../../TripSummaryNew';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { Tooltip } from '../../Tooltip';
import { Confirm } from '../../Confirm';
import { Button } from '../../Button';
import {
  makeFakeRows,
  formatDate,
  PerDiemClientService,
  getSlackID,
  slackNotify,
  UserClientService,
} from '../../../../helpers';
import { NULL_TIME, OPTION_ALL, ROWS_PER_PAGE } from '../../../../constants';
import { RoleType } from '../index';
import { getDepartmentName } from '@kalos-core/kalos-rpc/Common';

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

export const Trips: FC<Props> = ({
  loggedUserId,
  departmentId,
  employeeId,
  week,
  role,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [Trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [TripViewed, setTripViewed] = useState<Trip>();
  const [toggleButton, setToggleButton] = useState<boolean>(false);
  const managerFilter = role === 'Manager';
  const auditorFilter = role == 'Auditor';
  const payrollFilter = role == 'Payroll';
  const load = useCallback(async () => {
    setLoading(true);
    const tripReq = new Trip();
    if (departmentId) {
      tripReq.setDepartmentId(departmentId);
    }
    if (employeeId) {
      tripReq.setUserId(employeeId);
    }
    if (payrollFilter && toggleButton) {
      tripReq.setPayrollProcessed(true);
      tripReq.addNotEquals('PayrollProcessed');
    }
    if (payrollFilter && !toggleButton) {
      tripReq.setPayrollProcessed(false);
      tripReq.addNotEquals('PayrollProcessed');
    }
    if (managerFilter) {
      tripReq.addFieldMask('Approved');
    }
    const trips = await PerDiemClientService.BatchGetTrips(tripReq);
    setTrips(trips.getResultsList());
    setCount(trips.getTotalCount());
    setLoading(false);
  }, [
    departmentId,
    employeeId,
    week,
    page,
    managerFilter,
    payrollFilter,
    auditorFilter,
    toggleButton,
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
        title="Per Diems"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: setPage,
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
            checkboxes={true}
          />
        </Modal>
      )}
    </div>
  );
};
