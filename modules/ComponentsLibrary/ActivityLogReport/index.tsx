import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Data } from '../InfoTable';
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

export const ActivityLog: FC<Props> = ({
  status,
  activityDateStart,
  activityDateEnd,
  onClose,
}) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<ActivityLogType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<ActivityLogsSort>({
    orderBy: 'activity_date',
    orderByField: 'activityDate',
    orderDir: 'DESC',
  });
  const load = useCallback(async () => {
    setLoading(true);
    const filter: ActivityLogsFilter = {
      activityDate: activityDateStart,
    };
    if (status) {
      filter.activityName = status + ' % Notification';
    } else {
      filter.activityName = 'Notification';
    }
    const { results, totalCount } = await loadActivityLogsByFilter({
      page,
      filter,
      sort,
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, activityDateStart, status, sort, page]);
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
    },
    {
      name: 'Notification',
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
  return (
    <div>
      <SectionBar
        title="Notifications Report"
        actions={[
          { label: 'Export to Excel' },
          { label: 'Tasks' },
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
      />
      <InfoTable columns={COLUMNS} data={getData(entries)} loading={loading} />
    </div>
  );
};
