import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
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
  ReportClientService,
} from '../../../helpers';
import { format } from 'date-fns';
import { ExportJSON } from '../ExportJSON';
import { ROWS_PER_PAGE } from '../../../constants';
import { TransactionReportLine } from '@kalos-core/kalos-rpc/Report';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  year: number;
}

type FilterForm = {
  year: number;
};

const COLUMNS = [
  'Job Number',
  'Zoning',
  'Job Type',
  'Sub Type',
  'Class Code',
  'Department',
  'Category',
  'Vendor',
  'Holder Name',
  'Timestamp',
  'Post Timestamp',
  'Amount',
  'Notes',
  'Year',
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
  const [formKey, setFormKey] = useState<number>(0);
  const [form, setForm] = useState<FilterForm>({
    year,
  });
  const [printStatus, setPrintStatus] = useState<Status>('idle');
  const load = useCallback(async () => {
    setLoading(true);
    console.log({ form });
    const req = new TransactionReportLine();
    req.setYear(form.year.toString());
    req.setPageNumber(page);
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
    req.setYear(form.year.toString());
    req.setWithoutLimit(true);
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
      setForm({ year: form.year + step });
      setFormKey(formKey + 1);
      setLoaded(false);
    },
    [setForm, formKey, setFormKey, form],
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
          const classCode = entry.getClassCode();
          const department = entry.getDepartment();
          const category = entry.getCategory();
          const vendor = entry.getVendor();
          const holderName = entry.getHolderName();
          const timestamp = entry.getTransactionTimestamp();
          const postedTimestamp = entry.getPostedTimestamp();
          const amount = entry.getAmount();
          const notes = entry.getNotes();
          const year = entry.getYear();

          return [
            {
              value: jobNumber,
            },
            {
              value: zoning,
            },
            {
              value: jobType,
            },
            {
              value: subType,
            },
            {
              value: classCode,
            },
            {
              value: department,
            },
            {
              value: category,
            },
            {
              value: vendor,
            },
            {
              value: holderName,
            },
            {
              value: formatDate(timestamp),
            },
            {
              value: formatDate(postedTimestamp),
            },
            {
              value: amount,
            },
            {
              value: notes,
            },
            {
              value: year,
            },
          ];
        });
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
              json={printEntries.map(entry => ({
                transactionId: entry.getTransactionId(),

                artificialId: entry.getArtificialId(),

                jobNumber: entry.getJobNumber(),

                zoning: entry.getZoning(),

                jobType: entry.getJobType(),

                subType: entry.getSubType(),

                classCode: entry.getClassCode(),

                department: entry.getDepartment(),

                category: entry.getCategory(),

                vendor: entry.getVendor(),

                holderName: entry.getHolderName(),

                transactionTimestamp: entry.getTransactionTimestamp(),

                postedTimestamp: entry.getPostedTimestamp(),

                amount: entry.getAmount(),

                notes: entry.getNotes(),

                year: entry.getYear(),
              }))}
              fields={EXPORT_COLUMNS}
              filename={`Transaction_Validation_Report${format(
                new Date(),
                'yyyy-MM-dd hh:mm:ss',
              )}`}
              onExport={handleExport}
              onExported={handleExported}
              status={exportStatus}
            />
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />

      <PlainForm key={formKey} schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable
        columns={COLUMNS.map(name => ({ name }))}
        data={getData(entries)}
        loading={loading}
        skipPreLine
      />
    </div>
  );
};
