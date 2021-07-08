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
  loadCallbackReportByFilter,
  getCurrDate,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type CallbackReportType = {
  property: string;
  job: string;
  originalJob: string;
  date: string;
  disposition: string;
  timestamp: string;
};

interface Props {
  onClose?: () => void;
  dateStart: string;
  dateEnd: string;
}

const EXPORT_COLUMNS = [
  {
    label: 'Property',
    value: 'property',
  },
  {
    label: 'Job',
    value: 'job',
  },
  {
    label: 'Original Job',
    value: 'originalJob',
  },
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'Disposition',
    value: 'disposition',
  },
  {
    label: 'Timestamp',
    value: 'timestamp',
  },
];

const COLUMNS = EXPORT_COLUMNS.map(({ label }) => label);

export const CallbackReport: FC<Props> = ({ dateStart, dateEnd, onClose }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<CallbackReportType[]>([]);
  const [printEntries, setPrintEntries] = useState<CallbackReportType[]>([]);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const getFilter = useCallback(
    () => ({
      dateStart,
      dateEnd,
    }),
    [dateStart, dateEnd],
  );
  const load = useCallback(async () => {
    setLoading(true);
    const { results, totalCount } = await loadCallbackReportByFilter({
      page,
      filter: getFilter(),
    });
    setEntries(results);
    setCount(totalCount);
    setLoading(false);
  }, [setLoading, getFilter, page]);
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
    const { results } = await loadCallbackReportByFilter({
      page: -1,
      filter: getFilter(),
    });
    setPrintEntries(results);
  }, [setPrintEntries, getFilter, printEntries, count]);
  const handleExport = useCallback(async () => {
    setExportStatus('loading');
    await loadPrintEntries();
    setExportStatus('loaded');
  }, [loadPrintEntries, setExportStatus]);
  const handleExported = useCallback(() => setExportStatus('idle'), [
    setExportStatus,
  ]);
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(() => setPrintStatus('idle'), [
    setPrintStatus,
  ]);
  const getData = (entries: CallbackReportType[]): Data =>
    loading
      ? makeFakeRows(3, 5)
      : entries.map(entry => {
          const {
            property,
            job,
            originalJob,
            date,
            disposition,
            timestamp,
          } = entry;
          return [
            { value: property },
            { value: job },
            { value: originalJob },
            { value: date },
            { value: disposition },
            { value: timestamp },
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
        title="Callback Report"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
        asideContent={
          <>
            <ExportJSON
              json={allPrintData ? entries : printEntries}
              fields={EXPORT_COLUMNS}
              filename={`Callback_Report_${getCurrDate()}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />
            <PrintPage
              headerProps={{
                title: 'Callback Report',
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
      <InfoTable
        columns={COLUMNS.map(name => ({ name }))}
        data={getData(entries)}
        loading={loading}
        skipPreLine
      />
    </div>
  );
};
