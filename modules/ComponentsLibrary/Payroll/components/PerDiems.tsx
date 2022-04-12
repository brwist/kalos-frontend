import React, { FC, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import Visibility from '@material-ui/icons/Visibility';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { Modal } from '../../Modal';
import { SectionBar } from '../../SectionBar';
import { PerDiemComponent } from '../../PerDiem';
import { InfoTable } from '../../InfoTable';
import { startOfWeek, subDays } from 'date-fns';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { Tooltip } from '../../Tooltip';
import { Confirm } from '../../Confirm';
import { Button } from '../../Button';
import { PerDiemManager } from '../../PerDiemManager';
import { TimesheetDepartment } from '../../../../@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  makeFakeRows,
  formatDate,
  PerDiemClientService,
  getSlackID,
  slackNotify,
  usd,
  timestamp,
  checkPerDiemRowIsEarliestOrLatest,
} from '../../../../helpers';
import { NULL_TIME, OPTION_ALL, ROWS_PER_PAGE } from '../../../../constants';
import { RoleType } from '../index';
import { getDepartmentName } from '../../../../@kalos-core/kalos-rpc/Common';
import { PerDiem, PerDiemRow } from '../../../../@kalos-core/kalos-rpc/PerDiem';
import { result } from 'lodash';
import { RowingSharp } from '@material-ui/icons';

interface Props {
  loggedUserId: number;
  departmentId: number;
  employeeId: number;
  week: string;
  role: RoleType;
  departmentList: TimesheetDepartment[];
}

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'MMMM')}, ${format(d, 'do')}`;
};

export const PerDiems: FC<Props> = ({
  loggedUserId,
  departmentId,
  employeeId,
  departmentList,
  week,
  role,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiem>();
  const [pendingApprove, setPendingApprove] = useState<PerDiem>();
  const [pendingAudited, setPendingAudited] = useState<PerDiem>();
  const [pendingDeny, setPendingDeny] = useState<PerDiem>();
  const [rejectionMessage, setRejectionMessage] = useState<string>('');
  const [toggleButton, setToggleButton] = useState<boolean>(false);
  const [openManagerPerDiem, setOpenManagerPerDiem] = useState<boolean>(false);
  const [pendingPayroll, setPendingPayroll] = useState<PerDiem>();
  const [pendingPayrollSendBackToManager, setPendingPayrollSendBackToManager] =
    useState<PerDiem>();
  const [pendingPayrollUnprocess, setPendingPayrollUnprocess] =
    useState<PerDiem>();
  const managerFilter = role === 'Manager';
  const auditorFilter = role == 'Auditor';
  const payrollFilter = role == 'Payroll';
  const load = useCallback(async () => {
    setLoading(true);
    const perDiems = await PerDiemClientService.loadPerDiemsForPayroll(
      page,
      auditorFilter,
      payrollFilter,
      managerFilter,
      departmentId,
      employeeId,
      week === OPTION_ALL ? undefined : week,
      toggleButton,
      'date_submitted',
      'DESC',
    );
    const results = perDiems.getResultsList();
    for (let i = 0; i < results.length; i++) {
      if (results[i].getPayrollProcessed() == false) {
        const year = +format(
          new Date(parseISO(results[i].getDateStarted())),
          'yyyy',
        );
        const month = +format(
          new Date(parseISO(results[i].getDateStarted())),
          'M',
        );
        const zipCodes = results[i].getRowsList().map(pd => pd.getZipCode());
        const govPerDiems = await PerDiemClientService.loadGovPerDiem(
          zipCodes,
          year,
          month,
        );
        let totalLodging = 0;
        let totalMeals = 0;
        for (let j = 0; j < results[i].getRowsList().length; j++) {
          let row = results[i].getRowsList()[j];
          if (row.getMealsOnly() == false) {
            totalLodging += govPerDiems[row.getZipCode()].lodging;
          }
          if (
            checkPerDiemRowIsEarliestOrLatest(results[i].getRowsList(), row)
          ) {
            totalMeals += govPerDiems[row.getZipCode()].meals * 0.75;
          } else {
            totalMeals += govPerDiems[row.getZipCode()].meals;
          }
        }
        results[i].setAmountProcessedLodging(totalLodging);
        results[i].setAmountProcessedMeals(totalMeals);
      }
    }
    setPerDiems(results);
    setCount(perDiems.getTotalCount());
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
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiem) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  const handlePendingApproveToggle = useCallback(
    (perDiem?: PerDiem) => () => setPendingApprove(perDiem),
    [setPendingApprove],
  );
  const handlePendingDenyToggle = useCallback(
    (perDiem?: PerDiem) => () => setPendingDeny(perDiem),
    [setPendingDeny],
  );
  const handlePendingAuditedToggle = useCallback(
    (perDiem?: PerDiem) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handlePendingPayrollToggle = useCallback(
    (perDiem?: PerDiem) => () => setPendingPayroll(perDiem),
    [setPendingPayroll],
  );
  const handlePendingPayrollToggleUnprocess = useCallback(
    (perDiem?: PerDiem) => () => {
      setPendingPayrollUnprocess(perDiem);
    },
    [setPendingPayrollUnprocess],
  );
  const handlePendingPayrollToggleSendBackToManager = useCallback(
    (perDiem?: PerDiem) => () => {
      setPendingPayrollSendBackToManager(perDiem);
    },
    [setPendingPayrollSendBackToManager],
  );
  const handleToggleButton = useCallback(() => {
    setToggleButton(!toggleButton);
    setPage(0);
  }, [toggleButton]);
  const handleApprove = useCallback(async () => {
    if (!pendingApprove) return;
    const id = pendingApprove.getId();
    setLoading(true);
    setPendingApprove(undefined);
    await PerDiemClientService.approvePerDiemById(id, loggedUserId);
    load();
  }, [load, loggedUserId, pendingApprove]);
  const handleDeny = useCallback(async () => {
    if (!pendingDeny) return;
    const id = pendingDeny.getId();
    const slackID = await getSlackID(pendingDeny.getOwnerName());
    if (slackID != '0') {
      slackNotify(
        slackID,
        `Your PerDiem for ${formatWeek(
          pendingDeny.getDateStarted(),
        )} was denied by Manager for the following reason:` + rejectionMessage,
      );
    } else {
      console.log('We could not find the user, but we will still reject');
    }
    const req = new PerDiem();
    req.setId(id);
    req.setDateSubmitted(NULL_TIME);
    req.setFieldMaskList(['DateSubmitted']);
    setLoading(true);
    setPendingDeny(undefined);
    await PerDiemClientService.Update(req);
    load();
  }, [load, pendingDeny, rejectionMessage]);
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const id = pendingAudited.getId();
      setLoading(true);
      setPendingAudited(undefined);
      await PerDiemClientService.updatePerDiemNeedsAudit(id);
      load();
    }
  }, [load, pendingAudited]);
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      console.log('handle process perdiem');
      const id = pendingPayroll.getId();
      setLoading(true);
      const perDiemReq = new PerDiem();
      perDiemReq.setId(id);
      perDiemReq.setPayrollProcessed(true);
      perDiemReq.setAmountProcessedLodging(
        pendingPayroll.getAmountProcessedLodging(),
      );
      perDiemReq.setAmountProcessedMeals(
        pendingPayroll.getAmountProcessedMeals(),
      );

      perDiemReq.setDateProcessed(timestamp());
      perDiemReq.setFieldMaskList([
        'AmountProcessedLodging',
        'AmountProcessedMeals',
        'DateProcessed',
        'PayrollProcessed',
      ]);
      await PerDiemClientService.Update(perDiemReq);

      setPendingPayroll(undefined);
      load();
    }
  }, [load, pendingPayroll]);
  const handlePayrollUnprocess = useCallback(async () => {
    if (pendingPayrollUnprocess) {
      const id = pendingPayrollUnprocess.getId();
      setLoading(true);
      setPendingPayrollUnprocess(undefined);
      const req = new PerDiem();
      req.setPayrollProcessed(false);
      req.setId(id);
      req.setAmountProcessedLodging(0);
      req.setAmountProcessedMeals(0);
      req.setDateProcessed(NULL_TIME);
      req.setFieldMaskList([
        'AmountProcessedLodging',
        'AmountProcessedMeals',
        'PayrollProcessed',
        `DateProcessed`,
      ]);
      await PerDiemClientService.Update(req);
    }
    load();
  }, [load, pendingPayrollUnprocess]);
  const handlePayrollSendBackToManager = useCallback(async () => {
    if (pendingPayrollSendBackToManager) {
      const id = pendingPayrollSendBackToManager.getId();
      setLoading(true);
      setPendingPayrollSendBackToManager(undefined);
      const req = new PerDiem();
      req.setPayrollProcessed(false);
      req.setId(id);
      req.setDateApproved(NULL_TIME);
      req.setDateProcessed(NULL_TIME);
      req.setAmountProcessedLodging(0);
      req.setAmountProcessedMeals(0);
      req.setApprovedById(0);
      req.setFieldMaskList([
        'DateApproved',
        'ApprovedById',
        'AmountProcessedLodging',
        'AmountProcessedMeals',
        'PayrollProcessed',
        'DateProcessed',
      ]);
      await PerDiemClientService.Update(req);
    }
    load();
  }, [load, pendingPayrollSendBackToManager]);
  return (
    <div>
      <SectionBar
        title="Per Diems"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: setPage,
        }}
      />
      {(role === 'Payroll' || role == 'Manager') && (
        <Button
          label={
            role === 'Manager'
              ? toggleButton === false
                ? 'Show Approved Records'
                : 'Show Unapproved Records'
              : toggleButton === false
              ? 'Show Processed Records'
              : 'Show Unprocessed Records'
          }
          onClick={() => handleToggleButton()}
        ></Button>
      )}
      {role === 'Manager' && (
        <Button
          //label={'Manage PerDiems'}
          label={'Manage PerDiems Disabled Pending Update'}
          onClick={() => setOpenManagerPerDiem(true)}
          disabled={true}
        ></Button>
      )}
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Week' },
          { name: `Total Lodging ${toggleButton ? 'Processed' : ''}` },
          { name: `Total Meals ${toggleButton ? 'Processed' : ''}` },
          { name: 'Date' },
        ]}
        data={
          loading
            ? makeFakeRows(6, 3)
            : perDiems.map(el => {
                return [
                  {
                    value: el.getOwnerName(),
                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: formatWeek(el.getDateStarted()),
                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: usd(el.getAmountProcessedLodging()),

                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: usd(el.getAmountProcessedMeals()),

                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: `${formatDate(
                      el.getDateApproved(),
                    )} by ${el.getApprovedByName()}`,
                    onClick: handlePerDiemViewedToggle(el),
                    actions: [
                      <Tooltip
                        key="view"
                        content="View Per Diem"
                        placement="bottom"
                      >
                        <IconButton
                          size="small"
                          onClick={handlePerDiemViewedToggle(el)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>,
                      role === 'Manager' ? (
                        <Tooltip
                          key="approve"
                          content="Approve"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingApproveToggle(el)}
                              disabled={el.getApprovedById() != 0}
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      role === 'Manager' ? (
                        <Tooltip key="deny" content="Deny" placement="bottom">
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingDenyToggle(el)}
                              disabled={el.getApprovedById() != 0}
                            >
                              <NotInterestedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      role === 'Auditor' ? (
                        <Tooltip
                          key="audit"
                          content="Auditing"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingAuditedToggle(el)}
                            >
                              <FlashOff />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      /*
                      role === 'Payroll' ? (
                        <Tooltip
                          key="payroll process"
                          content="Payroll Process"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggle(el)}
                              disabled={
                                el.getPayrollProcessed() ||
                                el.getDateApproved() === NULL_TIME
                              }
                            >
                              <AccountBalanceWalletIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      */
                      role === 'Payroll' ? (
                        <Tooltip
                          key={'unprocess' + el.getId()}
                          content="Unprocess"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggleUnprocess(el)}
                              disabled={el.getPayrollProcessed() == false}
                            >
                              <KeyboardReturnIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                      role === 'Payroll' ? (
                        <Tooltip
                          key={'sendBack' + el.getId()}
                          content="Send Back To Manager/Coordinator"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggleSendBackToManager(
                                el,
                              )}
                              disabled={el.getPayrollProcessed()}
                            >
                              <NotInterestedIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : null,
                    ],
                  },
                ];
              })
        }
        loading={loading}
      />
      {perDiemViewed && (
        <Modal open onClose={handlePerDiemViewedToggle(undefined)} fullScreen>
          <SectionBar
            title={`Per Diem: ${perDiemViewed.getOwnerName()}`}
            subtitle={
              <>
                Department: {getDepartmentName(perDiemViewed.getDepartment())}
                <br />
                {formatWeek(perDiemViewed.getDateStarted())}
              </>
            }
            actions={[
              { label: 'Close', onClick: handlePerDiemViewedToggle(undefined) },
            ]}
            fixedActions
            className="PerDiemNeedsAuditingModalBar"
          />
          <PerDiemComponent
            onClose={handlePerDiemViewedToggle(undefined)}
            perDiem={perDiemViewed}
            ownerId={perDiemViewed.getUserId()}
            loggedUserId={loggedUserId}
          />
        </Modal>
      )}

      <Modal
        open={openManagerPerDiem}
        fullScreen
        onClose={() => setOpenManagerPerDiem(false)}
      >
        <PerDiemManager
          loggedUserId={loggedUserId}
          departmentsInit={departmentList}
          onClose={() => setOpenManagerPerDiem(false)}
        ></PerDiemManager>
      </Modal>
      {pendingApprove && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingApproveToggle()}
          onConfirm={handleApprove}
        >
          Are you sure you want to approve this Per Diem?
        </Confirm>
      )}
      {pendingDeny && (
        <Confirm
          title="Confirm Deny"
          open
          onClose={handlePendingDenyToggle()}
          onConfirm={handleDeny}
        >
          Are you sure you want to deny this Per Diem?
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
      {pendingAudited && (
        <Confirm
          title="Confirm Auditing"
          open
          onClose={handlePendingAuditedToggle()}
          onConfirm={handleAudit}
        >
          Are you sure this Per Diem no longer needs auditing?
        </Confirm>
      )}
      {pendingPayroll && (
        <Confirm
          title="Confirm Process"
          open
          onClose={handlePendingPayrollToggle()}
          onConfirm={handlePayroll}
        >
          Are you sure you want to process payroll for this Per Diem?
        </Confirm>
      )}
      {pendingPayrollUnprocess && (
        <Confirm
          title="Confirm Unprocess"
          open={pendingPayrollUnprocess != undefined}
          onClose={handlePendingPayrollToggleUnprocess()}
          onConfirm={handlePayrollUnprocess}
        >
          Are you sure you want to Un-process this Per Diem?
        </Confirm>
      )}
      {pendingPayrollSendBackToManager && (
        <Confirm
          open
          onClose={handlePendingPayrollToggleSendBackToManager()}
          onConfirm={handlePayrollSendBackToManager}
        >
          Are you sure you want to send this Per Diem back to the
          Manager/Coordinator?
          <br></br>
        </Confirm>
      )}
    </div>
  );
};
