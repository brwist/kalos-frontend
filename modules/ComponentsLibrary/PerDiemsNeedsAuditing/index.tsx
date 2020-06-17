import React, { FC, useState, useEffect, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import FlashOff from '@material-ui/icons/FlashOff';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { Confirm } from '../Confirm';
import {
  loadPerDiemsNeedsAuditing,
  PerDiemType,
  makeFakeRows,
  getDepartmentName,
  formatDate,
} from '../../../helpers';

interface Props {}

const COLUMNS: Columns = [
  { name: 'Week' },
  { name: 'Technician' },
  { name: 'Department' },
];

export const PerDiemsNeedsAuditing: FC<Props> = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [perDiems, setPerDiems] = useState<PerDiemType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [pendingAudited, setPendingAudited] = useState<PerDiemType>();
  const load = useCallback(async () => {
    setLoading(true);
    const { resultsList, totalCount } = await loadPerDiemsNeedsAuditing();
    setPerDiems(resultsList);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handlePendingAuditedToggle = useCallback(
    (perDiem?: PerDiemType) => () => setPendingAudited(perDiem),
    [setPendingAudited],
  );
  const handleAudit = useCallback(() => {}, []);
  console.log({ perDiems, count });
  const data: Data = loading
    ? makeFakeRows(3, 5)
    : perDiems.map(entry => {
        const { dateStarted, ownerName, department } = entry;
        return [
          { value: formatDate(dateStarted) },
          { value: ownerName },
          {
            value: getDepartmentName(department),
            actions: [
              <IconButton
                key="audit"
                size="small"
                onClick={handlePendingAuditedToggle(entry)}
              >
                <FlashOff />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <div>
      <SectionBar title="Per Diems Needs Auditing" />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {pendingAudited && (
        <Confirm
          title="Confirm Per Diem"
          open
          onClose={handlePendingAuditedToggle()}
          onConfirm={handleAudit}
          // submitLabel="Custom label"
        >
          Are you sure, this Per Diem no longer needs auditing?
        </Confirm>
      )}
    </div>
  );
};
