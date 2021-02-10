import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {
  TimeoffRequest,
  TimeoffRequestClient,
} from '@kalos-core/kalos-rpc/TimeoffRequest';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { Tooltip } from '../../Tooltip';
import { TimeOff } from '../../../ComponentsLibrary/Timeoff';
import FlashOff from '@material-ui/icons/FlashOff';
import { Confirm } from '../../Confirm';

import { Timesheet as TimesheetComponent } from '../../../ComponentsLibrary/Timesheet';
import {
  loadTimeoffRequests,
  TimeoffRequestType,
  makeFakeRows,
  formatWeek,
  TimeoffRequestClientService,
  GetTimesheetConfig,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';
import { TimeoffRequestServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb_service';

interface Props {
  departmentId: number;
  employeeId: number;
  week: string;
  role: string;
  loggedUserId: number;
}

export const TimeoffRequests: FC<Props> = ({
  departmentId,
  employeeId,
  week,
  role,
  loggedUserId,
}) => {
  const client = new TimeoffRequestClient();

  //const makeProcessTimeoffRequest = (id: number) => {
  //  return async () => {
  //    return await client.processTimeoffRequest(id);
  //  };
  //};

  const [loading, setLoading] = useState<boolean>(false);
  const [timeoffRequests, setTimeoffRequests] = useState<TimeoffRequestType[]>(
    [],
  );
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TimeoffRequestType>();
  const [pendingPayroll, setPendingPayroll] = useState<TimeoffRequestType>();
  const [pendingApproval, setPendingApproval] = useState<TimeoffRequestType>();
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
  }, [load]);
  const closeApproval = function closeApproval() {
    setPendingApproval(undefined);
  };
  const handleTogglePendingView = useCallback(
    (pendingView?: TimeoffRequestType) => () => setPendingView(pendingView),
    [],
  );
  const handlePendingPayrollToggle = useCallback(
    (pendingPayroll?: TimeoffRequestType) => () =>
      setPendingPayroll(pendingPayroll),
    [setPendingPayroll],
  );
  const handlePendingApprovalToggle = useCallback(
    (pendingApproval?: TimeoffRequestType) => () =>
      setPendingApproval(pendingApproval),
    [setPendingApproval],
  );
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const { id } = pendingPayroll;
      console.log(id);
      setLoading(true);
      setPendingPayroll(undefined);
      const req = new TimeoffRequest();
      req.setId(id);
      req.setFieldMaskList(['PayrollProcessed']);
      req.setPayrollProcessed(true);
      await TimeoffRequestClientService.Update(req);
      load();
    }
  }, [load, pendingPayroll]);

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
          { name: 'Start Date' },
          { name: 'End Date' },
        ]}
        loading={loading}
        data={
          loading
            ? makeFakeRows(3, 3)
            : timeoffRequests.map(e => {
                console.log(e.timeStarted);
                const startDate = parseISO(e.timeStarted);
                const endDate = parseISO(e.timeFinished);
                //console.log(startDate);
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
                    value: format(startDate, 'MMM do, YYY'),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: format(endDate, 'MMM do, YYY'),
                    onClick: handleTogglePendingView(e),
                    actions: [
                      <IconButton
                        key="view"
                        onClick={handleTogglePendingView(e)}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>,
                      role === 'Payroll' ? (
                        <Tooltip
                          key="payroll"
                          content="Payroll Process"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggle(e)}
                              disabled={!!e.payrollProcessed}
                            >
                              <AccountBalanceWalletIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      role === 'Manager' ? (
                        <Tooltip
                          key="manager"
                          content="Approve/Deny Timeoff"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingApprovalToggle(e)}
                            >
                              <ThumbsUpDownIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
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
      {pendingPayroll && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingPayrollToggle()}
          onConfirm={handlePayroll}
        >
          Are you sure, you want to process payroll for this Timeoff Request?
        </Confirm>
      )}
      {pendingApproval && (
        <Modal open={!!pendingApproval} onClose={closeApproval}>
          <TimeOff
            loggedUserId={loggedUserId}
            onCancel={closeApproval}
            onSaveOrDelete={closeApproval}
            onAdminSubmit={closeApproval}
            submitDisabled
            requestOffId={pendingApproval.id}
          />
        </Modal>
      )}
    </div>
  );
};
