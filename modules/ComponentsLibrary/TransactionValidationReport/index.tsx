import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { PrintPage, Status } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { PlainForm, Schema } from '../PlainForm';
import { Button } from '../Button';
import { Alert } from '../Alert';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  makeFakeRows,
  formatDate,
  TimesheetLineClientService,
  ReportClientService,
} from '../../../helpers';
import { format, differenceInHours, parseISO } from 'date-fns';
import { ExportJSON } from '../ExportJSON';
import { ROWS_PER_PAGE } from '../../../constants';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { differenceInMinutes } from 'date-fns/esm';
import { TransactionReportLine } from '@kalos-core/kalos-rpc/Report';
import { result } from 'lodash';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  year: string;
}

type FilterForm = {
  year: string;
};

const COLUMNS = [
  'Hours Worked',
  'Employee',
  'Time Started',
  'Time Finished',
  'Approver',
  'Class Code',
  'Job Number',
  'Description',
  'Notes',
  'Billable',
  'Processed',
];
const EXPORT_COLUMNS = [
  {
    label: 'ID',
    value: 'transactionId',
  },
  {
    label: 'Artificial ID',
    value: 'artificialId',
  },
  {
    label: 'Job Number',
    value: 'jobNumber',
  },
  {
    label: 'Zoning',
    value: 'zoning',
  },
  {
    label: 'Job Type',
    value: 'jobType',
  },
  {
    label: 'Sub Type',
    value: 'subType',
  },
  {
    label: 'Class Code',
    value: 'classCode',
  },
  {
    label: 'Department',
    value: 'department',
  },
  {
    label: 'Category',
    value: 'category',
  },
  {
    label: 'Vendor',
    value: 'vendor',
  },
  {
    label: 'Holder Name',
    value: 'holderName',
  },
  {
    label: 'Timestamp',
    value: 'transactionTimestamp',
  },
  {
    label: 'Post Timestamp',
    value: 'postedTimestamp',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Notes',
    value: 'notes',
  },
  {
    label: 'Year',
    value: 'year',
  },
];
export const TransactionValidationReport: FC<Props> = ({
  loggedUserId,
  year,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<TransactionReportLine[]>([]);
  const [printEntries, setPrintEntries] = useState<TransactionReportLine[]>([]);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<Status>('idle');
  const [form, setForm] = useState<FilterForm>({
    year,
  });
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const load = useCallback(async () => {
    setLoading(true);
    console.log({ form });
    const req = new TransactionReportLine();
    req.setYear(form.year);
    const results = await ReportClientService.GetTransactionDumpData(req);
    console.log({ results });
    setEntries(results.getDataList());
    setCount(results.getTotalCount());
    setLoading(false);
  }, [setLoading, page, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [setLoaded, loaded, load]);
  const reload = useCallback(() => {
    setError('');
    setLoaded(false);
  }, [setLoaded]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);

      reload();
    },
    [setPage, reload],
  );
  const loadPrintEntries = useCallback(async () => {
    if (printEntries.length === count) return;
    const req = new TransactionReportLine();
    req.setYear(form.year);
    const results = await ReportClientService.GetTransactionDumpData(req);
    console.log({ results });
    setEntries(results.getDataList());
    setCount(results.getTotalCount());
    setPrintEntries(results.getDataList());
  }, [setPrintEntries, form, printEntries, count]);
  const handlePrint = useCallback(async () => {
    setPrintStatus('loading');
    await loadPrintEntries();
    setPrintStatus('loaded');
  }, [loadPrintEntries, setPrintStatus]);
  const handlePrinted = useCallback(
    () => setPrintStatus('idle'),
    [setPrintStatus],
  );
  const handleSearch = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, []);
  const handleYearChange = useCallback(
    (step: number) => () => {
      setForm({ year: year + step });
      setLoaded(false);
    },
    [setForm, year],
  );
  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'year',
        label: 'Year',
        readOnly: true,
        startAdornment: (
          <IconButton size="small" onClick={handleYearChange(-1)}>
            <ChevronLeftIcon />
          </IconButton>
        ),
        endAdornment: (
          <IconButton size="small" onClick={handleYearChange(1)}>
            <ChevronRightIcon />
          </IconButton>
        ),
      },
    ],
  ];
  const handleExport = useCallback(async () => {
    setExportStatus('loading');
    await loadPrintEntries();
    setExportStatus('loaded');
  }, [loadPrintEntries, setExportStatus]);
  const handleExported = useCallback(
    () => setExportStatus('idle'),
    [setExportStatus],
  );

  const getData = (entries: TransactionReportLine[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const id = entry.getTransactionId();
          const artificialId = entry.getArtificialId();
          const jobNumber = entry.getJobNumber();
          const zoning = entry.getZoning();
          const jobType = entry.getJobType();
          const subType = entry.getSubType();
          const classCode = entry.getc;

          return [
            {
              value: hours,
            },
            {
              value: employee,
            },
            {
              value: formatDate(timeStarted),
            },
            {
              value: formatDate(timeFinished),
            },
            {
              value: approver,
            },
            {
              value: classCodeDescription,
            },
            {
              value: jobNumber,
            },
            {
              value: description,
            },
            {
              value: notes,
            },
            {
              value: billable === true ? 'Yes' : 'No',
            },
            {
              value: processed === true ? 'Yes' : 'No',
            },
          ];
        });
  const allPrintData = entries.length === count;
  const printHeaderSubtitle = (
    <>{year && <PrintHeaderSubtitleItem label="Year" value={year} />}</>
  );
  return (
    <div>
      <SectionBar
        title="Transaction Export Report"
        pagination={{
          page,
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onPageChange: handlePageChange,
        }}
        asideContent={
          <>
            <Alert open={error != ''} onClose={() => setError('')}></Alert>
            <ExportJSON
              json={printEntries.map(entry => ({}))}
              fields={EXPORT_COLUMNS}
              filename={`Timesheet_Validation_Report${format(
                new Date(),
                'yyyy-MM-dd hh:mm:ss',
              )}`}
              onExport={allPrintData ? undefined : handleExport}
              onExported={handleExported}
              status={exportStatus}
            />

            <PrintPage
              headerProps={{
                title: 'Timesheet Validation Report',
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
