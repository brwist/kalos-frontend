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
import { Tooltip } from '../../Tooltip';
import { Confirm } from '../../Confirm';
import { Button } from '../../Button';
import { PerDiemManager } from '../../PerDiemManager';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import {
  makeFakeRows,
  formatDate,
  PerDiemClientService,
  getSlackID,
  slackNotify,
  usd,
  timestamp,
} from '../../../../helpers';
import {
  NULL_TIME,
  OPTION_ALL,
  ROWS_PER_PAGE,
  MEALS_RATE,
} from '../../../../constants';
import { RoleType } from '../index';
import { getDepartmentName } from '@kalos-core/kalos-rpc/Common';
import { PerDiem, PerDiemRow } from '@kalos-core/kalos-rpc/PerDiem';

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
  const [pendingPayrollReject, setPendingPayrollReject] = useState<PerDiem>();
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
      'ASC',
    );
    const startDay = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 6 });
    const results = perDiems.getResultsList();
    const year = +format(startDay, 'yyyy');
    const month = +format(startDay, 'M');
    const zipCodesList = [];
    for (let i = 0; i < results.length; i++) {
      let zipCodes = [results[i]]
        .reduce(
          (aggr, pd) => [...aggr, ...pd.getRowsList()],
          [] as PerDiemRow[],
        )
        .map(pdr => pdr.getZipCode());
      for (let j = 0; j < zipCodes.length; j++) {
        zipCodesList.push(zipCodes[j]);
      }
    }

    const govPerDiemsTemp = await PerDiemClientService.loadGovPerDiem(
      zipCodesList,
      year,
      month,
    );

    function govPerDiemByZipCode(zipCode: string) {
      const govPerDiem = govPerDiemsTemp[zipCode];
      if (govPerDiem) return govPerDiem;
      return {
        meals: MEALS_RATE,
        lodging: 0,
      };
    }
    for (let i = 0; i < results.length; i++) {
      const year = +format(startDay, 'yyyy');
      const month = +format(startDay, 'M');
      const zipCodesList = [];
      for (let i = 0; i < results.length; i++) {
        let zipCodes = [results[i]]
          .reduce(
            (aggr, pd) => [...aggr, ...pd.getRowsList()],
            [] as PerDiemRow[],
          )
          .map(pdr => pdr.getZipCode());
        for (let j = 0; j < zipCodes.length; j++) {
          zipCodesList.push(zipCodes[j]);
        }
      }
      const govPerDiemsTemp = await PerDiemClientService.loadGovPerDiem(
        zipCodesList,
        year,
        month,
      );
      let totalMeals = results[i]
        .getRowsList()
        .reduce(
          (aggr, pdr) => aggr + govPerDiemByZipCode(pdr.getZipCode()).meals,
          0,
        );

      let totalLodging = results[i]
        .getRowsList()
        .reduce(
          (aggr, pdr) =>
            aggr +
            (pdr.getMealsOnly()
              ? 0
              : govPerDiemByZipCode(pdr.getZipCode()).lodging),
          0,
        );
      results[i].setAmountProcessedLodging(totalLodging);
      results[i].setAmountProcessedMeals(totalMeals);
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
  const handlePendingPayrollToggleReject = useCallback(
    (perDiem?: PerDiem) => () => {
      setPendingPayrollReject(perDiem);
    },
    [setPendingPayrollReject],
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
  const handlePayrollRejected = useCallback(async () => {
    if (pendingPayrollReject) {
      const id = pendingPayrollReject.getId();
      const slackID = await getSlackID(pendingPayrollReject.getOwnerName());
      if (slackID != '0') {
        slackNotify(
          slackID,
          `Your PerDiem for ${formatWeek(
            pendingPayrollReject.getDateStarted(),
          )} was rejected by Payroll for the following reason:` +
            rejectionMessage,
        );
      } else {
        console.log('We could not find the user, but we will still reject');
      }
      setLoading(true);
      setPendingPayrollReject(undefined);
      const req = new PerDiem();
      req.setPayrollProcessed(false);
      req.setId(id);
      req.setDateApproved(NULL_TIME);
      req.setApprovedById(0);
      req.setFieldMaskList([
        'DateApproved',
        'ApprovedById',
        'PayrollProcessed',
      ]);
      await PerDiemClientService.Update(req);
    }
    load();
  }, [load, pendingPayrollReject, rejectionMessage]);
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
      {role === 'Manager' && (
        <Button
          label={'Manage PerDiems'}
          onClick={() => setOpenManagerPerDiem(true)}
        ></Button>
      )}
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Week' },
          { name: 'Total Lodging' },
          { name: 'Total Meals' },
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
                    value: getDepartmentName(el.getDepartment()),
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
                      role === 'Payroll' ? (
                        <Tooltip
                          key="payroll reject "
                          content="Reject"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggleReject(el)}
                              disabled={
                                el.getPayrollProcessed() ||
                                el.getDateApproved() === NULL_TIME
                              }
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
      {pendingPayrollReject && (
        <Confirm
          title="Confirm Rejection"
          open
          onClose={handlePendingPayrollToggleReject()}
          onConfirm={handlePayrollRejected}
        >
          Are you sure you want to reject this Per Diem?
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
    </div>
  );
};
