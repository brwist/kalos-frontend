import React, { FC, useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import Visibility from '@material-ui/icons/Visibility';
import { Modal } from '../../Modal';
import { SectionBar } from '../../SectionBar';
import { PerDiemComponent } from '../../PerDiem';
import { InfoTable } from '../../InfoTable';
import { PlainForm, Schema } from '../../PlainForm';
import { TripInfoTable } from '../../TripInfoTable';
import {
  loadPerDiemsNeedsAuditing,
  PerDiemType,
  makeFakeRows,
  formatDate,
  getDepartmentName,
} from '../../../../helpers';

interface Props {
  departmentId: number;
  employeeId: number;
  loggedUserId: number;
}

type FilterType = {
  approved: boolean;
  needsAuditing: boolean;
  payrollProcessed: boolean;
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
  departmentId,
  employeeId,
  loggedUserId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [perDiemViewed, setPerDiemViewed] = useState<PerDiemType>();
  const [filter, setFilter] = useState<FilterType>({
    approved: false,
    needsAuditing: false,
    payrollProcessed: false,
  });
  const load = useCallback(async () => {
    setLoading(true);
    const perDiems = await loadPerDiemsNeedsAuditing(
      0,
      false,
      false,
      departmentId,
      employeeId,
      undefined,
    );
    setPerDiems(perDiems.resultsList);
    setLoading(false);
  }, [departmentId, employeeId]);
  useEffect(() => {
    load();
  }, [departmentId, employeeId]);
  const handlePerDiemViewedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPerDiemViewed(perDiem),
    [setPerDiemViewed],
  );
  return (
    <div>
      <PlainForm<FilterType>
        schema={SCHEMA}
        data={filter}
        onChange={setFilter}
        className="PayrollFilter"
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
            ? makeFakeRows(5, 3)
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
                      <IconButton
                        key="view"
                        size="small"
                        onClick={handlePerDiemViewedToggle(el)}
                      >
                        <Visibility />
                      </IconButton>,
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
    </div>
  );
};
