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
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadEventsByFilter({
      page,
      filter: {
        dateStarted: startDate,
        dateEnded: endDate,
      },
      sort: {
        orderBy: 'date_started',
        orderByField: 'dateStarted',
        orderDir: 'DESC',
      },
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, page, setEntries, setCount, status, startDate, endDate]);
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
  const COLUMNS: Columns = [
    { name: 'Property' },
    { name: 'Customer Name' },
    { name: 'Job #' },
    { name: 'Date' },
    { name: 'Job Status' },
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
          { value: getCustomerName(customer) },
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
