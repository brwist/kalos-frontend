import React, { FC, useState, useCallback, useEffect } from 'react';
import { FilterForm } from '../Reports';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data, Columns } from '../InfoTable';
import {
  makeFakeRows,
  loadEventsByFilter,
  EventType,
  getPropertyAddress,
  getCustomerName,
  formatDate,
  EventsSort,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type Props = {
  filter: FilterForm;
  onClose?: () => void;
};

export const JobStatusReport: FC<Props> = ({
  filter: { status, startDate, endDate },
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [entries, setEntries] = useState<EventType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [sort, setSort] = useState<EventsSort>({
    orderBy: 'date_started',
    orderByField: 'dateStarted',
    orderDir: 'DESC',
  });
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadEventsByFilter({
      page,
      filter: {
        dateStarted: startDate,
        dateEnded: endDate,
      },
      sort,
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [
    setLoading,
    page,
    setEntries,
    setCount,
    status,
    startDate,
    endDate,
    sort,
  ]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleSortChange = useCallback(
    (sort: EventsSort) => () => {
      setSort(sort);
      setLoaded(false);
    },
    [setSort, setLoaded],
  );
  const COLUMNS: Columns = [
    {
      name: 'Property',
      ...(sort.orderByField === 'address'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'address',
        orderBy: 'property_address',
        orderDir:
          sort.orderByField === 'address' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Customer Name',
      ...(sort.orderByField === 'lastname'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'lastname',
        orderBy: 'user_lastname', // FIXME: RPC doesn't sort properly
        orderDir:
          sort.orderByField === 'lastname' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Job #',
      ...(sort.orderByField === 'logJobNumber'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'logJobNumber',
        orderBy: 'log_jobNumber',
        orderDir:
          sort.orderByField === 'logJobNumber' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Date',
      ...(sort.orderByField === 'dateStarted'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'dateStarted',
        orderBy: 'date_started',
        orderDir:
          sort.orderByField === 'dateStarted' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
    {
      name: 'Job Status',
      ...(sort.orderByField === 'logJobStatus'
        ? {
            dir: sort.orderDir,
          }
        : {}),
      onClick: handleSortChange({
        orderByField: 'logJobStatus',
        orderBy: 'log_jobStatus', // FIXME: RPC doesn't sort properly
        orderDir:
          sort.orderByField === 'logJobStatus' && sort.orderDir === 'ASC'
            ? 'DESC'
            : 'ASC',
      }),
    },
  ];
  const data: Data = loading
    ? makeFakeRows(5, 5)
    : entries.map(entry => {
        const {
          property,
          customer,
          logJobNumber,
          dateStarted,
          logJobStatus,
        } = entry;
        return [
          { value: getPropertyAddress(property) },
          { value: getCustomerName(customer, true) },
          { value: logJobNumber },
          { value: formatDate(dateStarted) },
          { value: logJobStatus },
        ];
      });
  return (
    <>
      <SectionBar
        title="Job Status Report"
        actions={[
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
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
    </>
  );
};
