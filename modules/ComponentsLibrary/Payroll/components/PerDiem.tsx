import React, { FC, useCallback, useEffect, useState } from 'react';
import { InfoTable } from '../../InfoTable';
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
}

export const PerDiem: FC<Props> = ({ departmentId, employeeId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
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
  return (
    <div>
      <InfoTable
        columns={[
          { name: 'Employee' },
          { name: 'Department' },
          { name: 'Date Started' },
          { name: 'Date Approved' },
          { name: 'Approved By' },
          { name: '' },
        ]}
        data={
          loading
            ? makeFakeRows(5, 3)
            : perDiems.map(el => {
                return [
                  {
                    value: el.ownerName,
                  },
                  {
                    value: getDepartmentName(el.department),
                  },
                  {
                    value: formatDate(el.dateStarted),
                  },
                  {
                    value: formatDate(el.dateApproved),
                  },
                  {
                    value: el.approvedByName,
                  },
                  {
                    value: <div />,
                  },
                ];
              })
        }
        loading={loading}
      />
    </div>
  );
};
