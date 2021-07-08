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
  getCurrDate,
  loadPerformanceMetricsByFilter,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type PerformanceMetricsType = {
  technician: string;
  incomePerHour: number;
  percentageBillable: number;
  serviceCallbackRate?: number;
  installCallbackRate: string;
  driveTime: number;
};

interface Props {
  onClose?: () => void;
  dateStart: string;
  dateEnd: string;
}

const EXPORT_COLUMNS = [
  {
    label: 'Technician',
    value: 'technician',
  },
  {
    label: 'Income per hour',
    value: 'incomePerHour',
  },
  {
    label: 'Percentage Billable',
    value: 'percentageBillable',
  },
  {
    label: 'Service Callback rate',
    value: 'serviceCallbackRate',
  },
  {
    label: 'Install Callback rate',
    value: 'installCallbackRate',
  },
  {
    label: 'Drive Time',
    value: 'driveTime',
  },
];

const COLUMNS = EXPORT_COLUMNS.map(({ label }) => label);

export const PerformanceMetrics: FC<Props> = ({
  dateStart,
  dateEnd,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<PerformanceMetricsType[]>([]);
  const [printEntries, setPrintEntries] = useState<PerformanceMetricsType[]>(
    [],
  );
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
    const { results, totalCount } = await loadPerformanceMetricsByFilter({
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
    const { results } = await loadPerformanceMetricsByFilter({
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
  const getData = (entries: PerformanceMetricsType[]): Data =>
    loading
      ? makeFakeRows(3, 5)
      : entries.map(entry => {
          const {
            technician,
            incomePerHour,
            percentageBillable,
            serviceCallbackRate,
            installCallbackRate,
            driveTime,
          } = entry;
          return [
            { value: technician },
            { value: incomePerHour },
            { value: percentageBillable },
            { value: serviceCallbackRate },
            { value: installCallbackRate },
            { value: driveTime },
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
        title="Performance Metrics"
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
              filename={`Performance_Metrics_Report_${getCurrDate()}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />
            <PrintPage
              headerProps={{
                title: 'Performance Metrics',
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
