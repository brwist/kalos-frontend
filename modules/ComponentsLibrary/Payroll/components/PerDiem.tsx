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
import { PlainForm, Schema } from '../../PlainForm';
import { TripInfoTable } from '../../TripInfoTable';
import { Tooltip } from '../../Tooltip';
import { Confirm } from '../../Confirm';
import {
  loadPerDiemsNeedsAuditing,
  loadPerDiemsForPayroll,
  PerDiemType,
  makeFakeRows,
  formatDate,
  getDepartmentName,
  PerDiemClientService,
  approvePerDiemById,
} from '../../../../helpers';
import { OPTION_ALL, ROWS_PER_PAGE } from '../../../../constants';
import { RoleType } from '../index';

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

export const PerDiem: FC<Props> = ({
  loggedUserId,
  departmentId,
  employeeId,
  week,
  role,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiemType>();
  const [pendingApprove, setPendingApprove] = useState<PerDiemType>();
  const [pendingAudited, setPendingAudited] = useState<PerDiemType>();
  const [pendingPayroll, setPendingPayroll] = useState<PerDiemType>();
  const [managerFilter, setManagerFilter] = useState<boolean>(
    role == 'Manager' ? true : false,
  );
  const [payrollFilter, setPayrollFilter] = useState<boolean>(
    role == 'Payroll' ? true : false,
  );
  const [auditorFilter, setAuditorFilter] = useState<boolean>(
    role == 'Auditor' ? true : false,
  );
  const load = useCallback(async () => {
    setLoading(true);
    const perDiems = await loadPerDiemsForPayroll(
      page,
      auditorFilter,
      payrollFilter,
      managerFilter,
      departmentId,
      employeeId,
      week === OPTION_ALL ? undefined : week,
    );
    setPerDiems(perDiems.resultsList);
    setCount(perDiems.totalCount);
    setLoading(false);
  }, [
    departmentId,
    employeeId,
    week,
    page,
    managerFilter,
    payrollFilter,
    auditorFilter,
    role,
  ]);
  useEffect(() => {
    load();
  }, [load]);
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  const handlePendingApproveToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingApprove(perDiem),
    [setPendingApprove],
  );
  const handlePendingAuditedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handlePendingPayrollToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingPayroll(perDiem),
    [setPendingPayroll],
  );
  const handleApprove = useCallback(async () => {
    if (!pendingApprove) return;
    const { id } = pendingApprove;
    setLoading(true);
    setPendingApprove(undefined);
    await approvePerDiemById(id, loggedUserId);
    load();
  }, [load, loggedUserId, pendingApprove]);
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const { id } = pendingAudited;
      setLoading(true);
      setPendingAudited(undefined);
      await PerDiemClientService.updatePerDiemNeedsAudit(id);
      load();
    }
  }, [load, pendingAudited]);
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const { id } = pendingPayroll;
      setLoading(true);
      setPendingPayroll(undefined);
      await PerDiemClientService.updatePerDiemPayrollProcessed(id);
      load();
    }
  }, [load, pendingPayroll]);
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
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Week' },
          { name: 'Date' },
          //         { name: 'Approved' },
          //         { name: 'Needs Auditing' },
          //          { name: 'Payroll Processed' },
        ]}
        data={
          loading
            ? makeFakeRows(6, 3)
            : perDiems.map(el => {
                return [
                  {
                    value: el.ownerName,
                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: getDepartmentName(el.department),
                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: formatWeek(el.dateStarted),
                    onClick: handlePerDiemViewedToggle(el),
                  },
                  {
                    value: `${formatDate(el.dateApproved)} by ${
                      el.approvedByName
                    }`,
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
                              disabled={!!el.approvedById}
                            >
                              <CheckCircleOutlineIcon />
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
                          key="payroll"
                          content="Payroll Process"
                          placement="bottom"
                        >
                          <span>
                            <IconButton
                              size="small"
                              onClick={handlePendingPayrollToggle(el)}
                              disabled={!!el.payrollProcessed}
                            >
                              <AccountBalanceWalletIcon />
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
            title={`Per Diem: ${perDiemViewed.ownerName}`}
            subtitle={
              <>
                Department: {getDepartmentName(perDiemViewed.department)}
                <br />
                {formatWeek(perDiemViewed.dateStarted)}
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
            loggedUserId={loggedUserId}
          />
          {/* {perDiemViewed.rowsList.map(row => { // FIXME
            return (
              <TripInfoTable
                canAddTrips={false}
                cannotDeleteTrips
                perDiemRowId={row.perDiemId}
                loggedUserId={perDiemViewed.userId}
                key={row.id}
              />
            );
          })} */}
        </Modal>
      )}
      {pendingApprove && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingApproveToggle()}
          onConfirm={handleApprove}
        >
          Are you sure, you want to approve this Per Diem?
        </Confirm>
      )}
      {pendingAudited && (
        <Confirm
          title="Confirm Auditing"
          open
          onClose={handlePendingAuditedToggle()}
          onConfirm={handleAudit}
        >
          Are you sure, this Per Diem no longer needs auditing?
        </Confirm>
      )}
      {pendingPayroll && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingPayrollToggle()}
          onConfirm={handlePayroll}
        >
          Are you sure, you want to process payroll for this Per Diem?
        </Confirm>
      )}
    </div>
  );
};
