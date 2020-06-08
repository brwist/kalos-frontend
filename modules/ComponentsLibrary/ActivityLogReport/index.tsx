import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import {
  ActivityLogType,
  makeFakeRows,
  loadActivityLogsByFilter,
  ActivityLogsSort,
  ActivityLogsFilter,
  formatDateTime,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

interface Props {
  onClose?: () => void;
  status?: string;
  activityDateStart: string;
  activityDateEnd: string;
}

const useStyles = makeStyles(theme => ({}));

export const ActivityLogReport: FC<Props> = ({
  status,
  activityDateStart,
  activityDateEnd,
  onClose,
}) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<ActivityLogType[]>([]);
  const [printEntries, setPrintEntries] = useState<ActivityLogType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [sort, setSort] = useState<ActivityLogsSort>({
    orderBy: 'activity_date',
    orderByField: 'activityDate',
    orderDir: 'DESC',
  });
  const getFilter = useCallback(() => {
    const filter: ActivityLogsFilter = {
      activityDate: activityDateStart,
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
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    const { results } = await loadActivityLogsByFilter({
      page: -1,
      filter: getFilter(),
      sort,
    });
    setPrintEntries(results);
    setPrintStatus('loaded');
  }, [setPrintEntries, status, getFilter, sort, setPrintStatus]);
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
      ...(sort.orderByField === 'activityDate'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      // FIXME  whenever ActivityLog is sortable
      // onClick: handleSortChange({
      //   orderByField: 'activityDate',
      //   orderBy: 'activity_date',
      //   orderDir:
      //     sort.orderByField === 'activityDate' && sort.orderDir === 'ASC'
      //       ? 'DESC'
      //       : 'ASC',
      // }),
    },
    {
      name: 'User ID', // FIXME User
      width: 200,
    },
    {
      name: 'Notification',
      width: -1,
    },
  ];
  const getData = (entries: ActivityLogType[]): Data =>
    loading
      ? makeFakeRows(3, 5)
      : entries.map(entry => {
          const { activityDate, userId, activityName } = entry;
          return [
            {
              value: formatDateTime(activityDate),
            },
            {
              value: userId, // FIXME should be user name whenever it's returned in ActivityLog
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
        actions={[
          { label: 'Export to Excel' },
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
        }}
        asideContent={
          <PrintPage
            headerProps={{
              title: 'Notifications Report',
              subtitle: printHeaderSubtitle,
            }}
            onPrint={allPrintData ? undefined : handlePrint}
            status={printStatus}
          >
            <PrintTable
              columns={['Date', 'User ID', 'Notification']}
              nowraps={[true, true]}
              data={getData(allPrintData ? entries : printEntries).map(row =>
                row.map(({ value }) => value),
              )}
            />
          </PrintPage>
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
