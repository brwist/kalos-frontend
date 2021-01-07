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
  PerDiemType,
  makeFakeRows,
  formatDate,
  getDepartmentName,
  PerDiemClientService,
  approvePerDiemById,
} from '../../../../helpers';
import { OPTION_ALL, ROWS_PER_PAGE } from '../../../../constants';

interface Props {
  loggedUserId: number;
  departmentId: number;
  employeeId: number;
  week: string;
}

type FilterType = {
  approved: number;
  needsAuditing: number;
  payrollProcessed: number;
};

const formatWeek = (date: string) => {
  const d = parseISO(date);
  return `Week of ${format(d, 'MMMM')}, ${format(d, 'do')}`;
};

const SCHEMA: Schema<FilterType> = [
  [
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved',
    },
    {
      name: 'needsAuditing',
      type: 'checkbox',
      label: 'Needs Auditing',
    },
    {
      name: 'payrollProcessed',
      type: 'checkbox',
      label: 'Payroll Processed',
    },
  ],
];

export const PerDiem: FC<Props> = ({
  loggedUserId,
  departmentId,
  employeeId,
  week,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiemType>();
  const [pendingApprove, setPendingApprove] = useState<PerDiemType>();
  const [pendingAudited, setPendingAudited] = useState<PerDiemType>();
  const [pendingPayroll, setPendingPayroll] = useState<PerDiemType>();
  const [filter, setFilter] = useState<FilterType>({
    approved: 0,
    needsAuditing: 0,
    payrollProcessed: 0,
  });
  const load = useCallback(async () => {
    setLoading(true);
    const perDiems = await loadPerDiemsNeedsAuditing(
      page,
      !!filter.needsAuditing,
      !!filter.payrollProcessed,
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
    filter.needsAuditing,
    filter.payrollProcessed,
  ]);
  useEffect(() => {
    load();
  }, [
    departmentId,
    employeeId,
    week,
    page,
    filter.needsAuditing,
    filter.payrollProcessed,
  ]);
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
  }, [pendingApprove, loggedUserId]);
  const handleAudit = useCallback(async () => {
    if (pendingAudited) {
      const { id } = pendingAudited;
      setLoading(true);
      setPendingAudited(undefined);
      await PerDiemClientService.updatePerDiemNeedsAudit(id);
      load();
    }
  }, [pendingAudited, setLoading, setPendingAudited]);
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const { id } = pendingPayroll;
      setLoading(true);
      setPendingPayroll(undefined);
      // await PerDiemClientService.updatePerDiemNeedsAudit(id);
      load();
    }
  }, [pendingPayroll, setLoading, setPendingPayroll]);
  return (
    <div>
      <PlainForm<FilterType>
        schema={SCHEMA}
        data={filter}
        onChange={setFilter}
        className="PayrollFilter"
      />
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
          { name: 'Approved' },
          { name: 'Needs Auditing' },
          { name: 'Payroll Processed' },
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
                  },
                  {
                    value: el.needsAuditing ? 'Yes' : 'No',
                  },
                  {
                    value: el.payrollProcessed ? 'Yes' : 'No',
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
                      </Tooltip>,
                      <Tooltip
                        key="audit"
                        content="Auditing"
                        placement="bottom"
                      >
                        <span>
                          <IconButton
                            size="small"
                            onClick={handlePendingAuditedToggle(el)}
                            disabled={!el.needsAuditing || !el.approvedById}
                          >
                            <FlashOff />
                          </IconButton>
                        </span>
                      </Tooltip>,
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
                      </Tooltip>,
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
          {perDiemViewed.rowsList.map(row => {
            return (
              <TripInfoTable
                canAddTrips={false}
                cannotDeleteTrips
                perDiemRowId={row.perDiemId}
                loggedUserId={perDiemViewed.userId}
                key={row.id}
              />
            );
          })}
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
          Are you sure, Per Diem of <strong>{pendingAudited.ownerName}</strong>{' '}
          for department{' '}
          <strong>{getDepartmentName(pendingAudited.department)}</strong> for{' '}
          <strong>{formatWeek(pendingAudited.dateStarted)}</strong> no longer
          needs auditing?
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
