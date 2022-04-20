import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { ExportJSON } from '../ExportJSON';
import { Button } from '../Button';
import {
  makeFakeRows,
  loadActivityLogsByFilter,
  ActivityLogsSort,
  ActivityLogsFilter,
  formatDateTime,
  getCurrDate,
  UserClientService,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';
import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';

interface Props {
  onClose?: () => void;
  status?: string;
  activityDateStart: string;
  activityDateEnd: string;
}

const EXPORT_COLUMNS = [
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Notification',
    value: 'notification',
  },
];

export const ActivityLogReport: FC<Props> = ({
  status,
  activityDateStart,
  activityDateEnd,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<ActivityLog[]>([]);
  const [printEntries, setPrintEntries] = useState<ActivityLog[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [sort, setSort] = useState<ActivityLogsSort>({
    orderBy: 'activity_date',
    orderByField: 'getActivityDate',
    orderDir: 'DESC',
  });
  const getFilter = useCallback(() => {
    const filter: ActivityLogsFilter = {
      activityDateStart,
      activityDateEnd,
      withUser: true,
    };
    if (status) {
      filter.activityName = status + ' % Notification';
    } else {
      filter.activityName = 'Notification';
    }
    return filter;
  }, [activityDateStart, activityDateEnd, status]);
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadActivityLogsByFilter({
      page,
      filter: getFilter(),
      sort,
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, getFilter, sort, page]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [setLoaded, loaded, load]);
  const reload = useCallback(() => setLoaded(false), [setLoaded]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      reload();
    },
    [setPage, reload],
  );
  const loadPrintEntries = useCallback(async () => {
    if (printEntries.length === count) return;
    const { results } = await loadActivityLogsByFilter({
      page: -1,
      filter: getFilter(),
      sort,
    });
    setPrintEntries(results);
  }, [setPrintEntries, sort, getFilter, printEntries, count]);
  const handleExport = useCallback(async () => {
    setExportStatus('loading');
    await loadPrintEntries();
    setExportStatus('loaded');
  }, [loadPrintEntries, setExportStatus]);
  const handleExported = useCallback(
    () => setExportStatus('idle'),
    [setExportStatus],
  );
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );
  const handleSortChange = useCallback(
    (sort: ActivityLogsSort) => () => {
      setSort(sort);
      setPage(0);
      reload();
    },
    [setSort, reload],
  );
  const COLUMNS: Columns = [
    {
      name: 'Date',
      width: 150,
      ...(sort.orderByField === 'getActivityDate'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'getActivityDate',
        orderBy: 'activity_date',
        orderDir:
          sort.orderByField === 'getActivityDate' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'User',
      width: 200,
      ...(sort.orderByField === 'getLastname'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'getLastname',
        orderBy: 'userz.user_lastname',
        orderDir:
          sort.orderByField === 'getLastname' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Notification',
      width: -1,
      ...(sort.orderByField === 'getActivityName'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'getActivityName',
        orderBy: 'activity_name',
        orderDir:
          sort.orderByField === 'getActivityName' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
  ];
  const getData = (entries: ActivityLog[]): Data =>
    loading
      ? makeFakeRows(3, 5)
      : entries.map(entry => {
          const activityDate = entry.getActivityDate();
          const user = entry.getUser();
          const activityName = entry.getActivityName();
          return [
            {
              value: formatDateTime(activityDate),
            },
            {
              value: UserClientService.getCustomerName(user!, true),
            },
            {
              value: activityName,
            },
          ];
        });
  const allPrintData = entries.length === count;
  const printHeaderSubtitle = (
    <>
      {status && (
        <PrintHeaderSubtitleItem label="Status" value="Deletions only" />
      )}
      {activityDateStart && (
        <PrintHeaderSubtitleItem label="Start date" value={activityDateStart} />
      )}
      {activityDateEnd && (
        <PrintHeaderSubtitleItem label="End date" value={activityDateEnd} />
      )}
    </>
  );
  return (
    <div>
      <SectionBar
        title="Notifications Report"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
        asideContent={
          <>
            <ExportJSON
              json={(allPrintData ? entries : printEntries).map(entry => ({
                date: formatDateTime(entry.getActivityDate()),
                user: UserClientService.getCustomerName(entry.getUser()!, true),
                notification: entry.getActivityName(),
              }))}
              fields={EXPORT_COLUMNS}
              filename={`Notification_Status_Report_${getCurrDate()}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />
            <PrintPage
              headerProps={{
                title: 'Notifications Report',
                subtitle: printHeaderSubtitle,
              }}
              onPrint={allPrintData ? undefined : handlePrint}
              onPrinted={handlePrinted}
              status={printStatus}
            >
              <PrintTable
                columns={['Date', 'User', 'Notification']}
                nowraps={[true, true]}
                data={getData(allPrintData ? entries : printEntries).map(row =>
                  row.map(({ value }) => value),
                )}
              />
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      <InfoTable
        columns={COLUMNS}
        data={getData(entries)}
        loading={loading}
        skipPreLine
      />
    </div>
  );
};
