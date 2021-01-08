import React, { FC, useEffect, useCallback, useState } from 'react';
import {
  loadPerDiemsNeedsAuditing,
  PerDiemType,
  makeFakeRows,
  formatDate,
} from '../../../helpers';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { PerDiemComponent } from '../../ComponentsLibrary/PerDiem';

type Props = {
  departmentId: number;
  userId: number;
  dateStarted: string;
};

export const PerDiem: FC<Props> = ({ departmentId, userId, dateStarted }) => {
  const [initiated, setInitiated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const perDiems = await loadPerDiemsNeedsAuditing(
      0,
      false,
      false,
      departmentId,
      userId,
      dateStarted,
    );
    setPerDiems(perDiems.resultsList);
    setLoading(false);
  }, []);
  useEffect(() => {
    if (!initiated) {
      setInitiated(true);
      load();
    }
  }, [initiated]);
  return (
    <div>
      <InfoTable
        columns={[
          { name: 'Date Started' },
          { name: 'Date Submited' },
          { name: 'Date Approved' },
          { name: 'Approved By' },
          { name: 'Notes' },
        ]}
        data={
          loading
            ? makeFakeRows(5, 1)
            : perDiems.map(p => {
                return [
                  {
                    value: formatDate(p.dateStarted),
                  },
                  {
                    value: formatDate(p.dateSubmitted),
                  },
                  {
                    value: formatDate(p.dateApproved),
                  },
                  {
                    value: p.approvedByName,
                  },
                  {
                    value: p.notes,
                  },
                ];
              })
        }
        loading={loading}
      />
    </div>
  );
};
