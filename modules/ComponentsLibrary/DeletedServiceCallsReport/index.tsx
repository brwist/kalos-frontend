import React, { FC, useState, useCallback, useEffect } from 'react';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { PlainForm, Schema } from '../PlainForm';
import { Button } from '../Button';
import {
  makeFakeRows,
  getCurrDate,
  loadDeletedServiceCallsByFilter,
  EventType,
  formatDate,
  getPropertyAddress,
  getCustomerName,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

interface Props {
  onClose?: () => void;
  dateStart: string;
  dateEnd: string;
}

type FilterForm = {
  dateStart: string;
  dateEnd: string;
};

const COLUMNS = ['Property', 'Customer Name', 'Job', 'Date', 'Job Status'];

export const DeletedServiceCallsReport: FC<Props> = ({
  dateStart,
  dateEnd,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<EventType[]>([]);
  const [printEntries, setPrintEntries] = useState<EventType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [form, setForm] = useState<FilterForm>({ dateStart, dateEnd });
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadDeletedServiceCallsByFilter({
      page,
      filter: form,
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, form, page]);
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
    const { results } = await loadDeletedServiceCallsByFilter({
      page: -1,
      filter: form,
    });
    setPrintEntries(results);
  }, [setPrintEntries, form, printEntries, count]);
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(() => setPrintStatus('idle'), [
    setPrintStatus,
  ]);
  const handleSearch = useCallback(() => setLoaded(false), [setForm]);
  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'dateStart',
        label: 'Start Date',
        type: 'date',
      },
      {
        name: 'dateEnd',
        label: 'End Date',
        type: 'date',
        actions: [{ label: 'Search', onClick: handleSearch }],
      },
    ],
  ];
  const getData = (entries: EventType[]): Data =>
    loading
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
  const allPrintData = entries.length === count;
  const printHeaderSubtitle = (
    <>
      {dateStart && (
        <PrintHeaderSubtitleItem label="Start date" value={dateStart} />
      )}
      {dateEnd && <PrintHeaderSubtitleItem label="End date" value={dateEnd} />}
    </>
  );
  return (
    <div>
      <SectionBar
        title="Deleted Service Calls Report"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
        }}
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Deleted Service Calls Report',
                subtitle: printHeaderSubtitle,
              }}
              onPrint={allPrintData ? undefined : handlePrint}
              onPrinted={handlePrinted}
              status={printStatus}
            >
              <PrintTable
                columns={COLUMNS}
                data={getData(allPrintData ? entries : printEntries).map(row =>
                  row.map(({ value }) => value),
                )}
              />
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      <PlainForm schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable
        columns={COLUMNS.map(name => ({ name }))}
        data={getData(entries)}
        loading={loading}
        skipPreLine
      />
    </div>
  );
};
