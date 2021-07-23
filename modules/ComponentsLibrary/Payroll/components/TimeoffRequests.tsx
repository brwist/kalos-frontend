import React, { FC, useState, useEffect, useCallback } from 'react';
import { format, addDays } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import {
  TimeoffRequest,
  TimeoffRequestClient,
  GetTimesheetConfig,
} from '@kalos-core/kalos-rpc/TimeoffRequest';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import { SectionBar } from '../../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../../ComponentsLibrary/InfoTable';
import { Modal } from '../../../ComponentsLibrary/Modal';
import { Tooltip } from '../../Tooltip';
import { TimeOff } from '../../../ComponentsLibrary/Timeoff';
import FlashOff from '@material-ui/icons/FlashOff';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { Confirm } from '../../Confirm';
import { Button } from '../../Button';
import { Timesheet as TimesheetComponent } from '../../../ComponentsLibrary/Timesheet';
import {
  makeFakeRows,
  formatWeek,
  TimeoffRequestClientService,
  slackNotify,
  getSlackID,
} from '../../../../helpers';
import { ROWS_PER_PAGE, OPTION_ALL } from '../../../../constants';
import { TimeoffRequestServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb_service';
import { NULL_TIME } from '@kalos-core/kalos-rpc/constants';

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
  const [timeoffRequests, setTimeoffRequests] = useState<TimeoffRequest[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rejectionMessage, setRejectionMessage] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [pendingView, setPendingView] = useState<TimeoffRequest>();
  const [pendingPayroll, setPendingPayroll] = useState<TimeoffRequest>();
  const [pendingPayrollReject, setPendingPayrollReject] =
    useState<TimeoffRequest>();
  const [toggleButton, setToggleButton] = useState<boolean>(true);
  const [pendingApproval, setPendingApproval] = useState<TimeoffRequest>();
  const load = useCallback(async () => {
    setLoading(true);
    //Lets grab the Timeoff requests,
    //for managers, we should show all fo their departments
    //For Payroll/Auditor, just PTO thats approved
    const filter: GetTimesheetConfig = {
      page,
      departmentID: departmentId,
      approved: role != 'Manager' ? true : false,
      payrollProcessed: role === 'Payroll' ? toggleButton : undefined,
      technicianUserID: employeeId,
      requestType: role === 'Payroll' ? 9 : 0,
    };
    if (week !== OPTION_ALL) {
      Object.assign(filter, {
        startDate: week,
        endDate: format(addDays(new Date(week), 7), 'yyyy-MM-dd'),
      });
    }
    if (role === 'Payroll') {
      Object.assign(filter, { requestType: 9 });
    }
    const results = await TimeoffRequestClientService.loadTimeoffRequestProtos(
      filter,
    );
    setTimeoffRequests(results.getResultsList());
    setCount(results.getTotalCount());
    setLoading(false);
  }, [page, role, departmentId, toggleButton, employeeId, week]);
  useEffect(() => {
    load();
  }, [load]);
  const closeApproval = function closeApproval() {
    setPendingApproval(undefined);
  };
  const handleTogglePendingView = useCallback(
    (pendingView?: TimeoffRequest) => () => setPendingView(pendingView),
    [],
  );
  const handlePendingPayrollToggle = useCallback(
    (pendingPayroll?: TimeoffRequest) => () =>
      setPendingPayroll(pendingPayroll),
    [setPendingPayroll],
  );
  const handlePendingPayrollToggleReject = useCallback(
    (pendingPayrollReject?: TimeoffRequest) => () =>
      setPendingPayrollReject(pendingPayrollReject),
    [setPendingPayrollReject],
  );
  const handlePendingApprovalToggle = useCallback(
    (pendingApproval?: TimeoffRequest) => () =>
      setPendingApproval(pendingApproval),
    [setPendingApproval],
  );
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const id = pendingPayroll.getId();
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

  const handlePayrollReject = useCallback(async () => {
    if (pendingPayrollReject) {
      const id = pendingPayrollReject.getId();
      const slackID = await getSlackID(pendingPayrollReject.getUserName());
      if (slackID != '0') {
        slackNotify(
          slackID,
          `Your PTO for ${formatWeek(
            pendingPayrollReject.getTimeStarted(),
          )} was rejected by Payroll for the following reason:` +
            rejectionMessage,
        );
      } else {
        console.log('We could not find the user, but we will still reject');
      }
      setLoading(true);
      setPendingPayrollReject(undefined);
      const req = new TimeoffRequest();
      req.setId(id);
      req.setAdminApprovalUserId(0);
      req.setAdminApprovalDatetime(NULL_TIME);
      req.setFieldMaskList([
        'PayrollProcessed',
        'AdminApprovalDatetime',
        'AdminApprovalUserId',
      ]);
      req.setPayrollProcessed(false);
      await TimeoffRequestClientService.Update(req);
      load();
    }
  }, [load, pendingPayrollReject, rejectionMessage]);

  return (
    <div>
      <SectionBar
        title="Timeoff Requests"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: setPage,
        }}
      />
      {role === 'Payroll' && (
        <Button
          label={
            toggleButton === true
              ? 'Show Unprocesssed Timeoff'
              : 'Show Processed Timeoff'
          }
          onClick={() => setToggleButton(!toggleButton)}
        ></Button>
      )}
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
                const startDate = parseISO(e.getTimeStarted());
                const endDate = parseISO(e.getTimeFinished());
                return [
                  {
                    value: e.getUserName(),
                    onClick: handleTogglePendingView(e),
                  },
                  {
                    value: e.getDepartmentName(),
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
                          key="payroll process"
                          content="Payroll Process"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggle(e)}
                              disabled={
                                e.getPayrollProcessed() ||
                                e.getAdminApprovalUserId() === 0
                              }
                            >
                              <AccountBalanceWalletIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      role === 'Payroll' ? (
                        <Tooltip
                          key="payroll reject"
                          content="Reject TimeOff"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggleReject(e)}
                              disabled={
                                e.getPayrollProcessed() ||
                                e.getAdminApprovalUserId() === 0
                              }
                            >
                              <NotInterestedIcon />
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
            timesheetOwnerId={pendingView.getUserId()}
            userId={loggedUserId}
            week={pendingView.getTimeStarted()}
            startOnWeek={true}
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
          Are you sure you want to process payroll for this Timeoff Request?
        </Confirm>
      )}
      {pendingPayrollReject && (
        <Confirm
          title="Confirm Reject"
          open
          onClose={handlePendingPayrollToggleReject()}
          onConfirm={handlePayrollReject}
        >
          Are you sure you want to Reject this Timeoff Request?
          <br></br>
          <label>
            <strong>Reason:</strong>
          </label>
          <input
            type="text"
            value={rejectionMessage}
            autoFocus
            size={35}
            placeholder="Enter a rejection reason"
            onChange={e => setRejectionMessage(e.target.value)}
          />
        </Confirm>
      )}
      {pendingApproval && (
        <Modal open={!!pendingApproval} onClose={closeApproval}>
          <TimeOff
            loggedUserId={loggedUserId}
            userId={pendingApproval.getUserId()}
            onCancel={closeApproval}
            onSaveOrDelete={closeApproval}
            onAdminSubmit={closeApproval}
            submitDisabled
            requestOffId={pendingApproval.getId()}
          />
        </Modal>
      )}
    </div>
  );
};
