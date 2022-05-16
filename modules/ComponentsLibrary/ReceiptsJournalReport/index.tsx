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
import { ReportClientService, usd } from '../../../helpers';
import { Loader } from '../../Loader/main';
import { makeFakeRows, EventClientService } from '../../../helpers';
import { ReceiptJournalReportLine } from '../../../@kalos-core/kalos-rpc/Report';
import { format } from 'date-fns';
import { ExportJSON } from '../ExportJSON';
import { ROWS_PER_PAGE } from '../../../constants';
import { TransactionReportLine } from '../../../@kalos-core/kalos-rpc/Report';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  startDate: string;
  endDate: string;
}

type FilterForm = {
  startDate: string;
  endDate: string;
  departmentId: number;
};
//Service Call ID, Paid Amount, Process Date, Payment Method

const COLUMNS = [
  'Service Call ID',
  'Paid Amount',
  'Billing Date',
  'Payment Method',
  'Department ID',
];
const EXPORT_COLUMNS = [
  {
    label: 'Service Call ID',
    value: 'id',
  },
  {
    label: 'Amount Collected',
    value: 'paidAmount',
  },
  {
    label: 'Process Date',
    value: 'processDate',
  },
  {
    label: 'Process Method',
    value: 'paymentType',
  },
  {
    label: 'Department ID',
    value: 'departmentId',
  },
];
export const ReceiptJournalReport: FC<Props> = ({
  loggedUserId,
  startDate,
  endDate,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<ReceiptJournalReportLine[]>([]);
  const [printEntries, setPrintEntries] = useState<ReceiptJournalReportLine[]>(
    [],
  );
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<Status>('idle');

  const [formKey, setFormKey] = useState<number>(0);
  const [form, setForm] = useState<FilterForm>({
    startDate,
    endDate,
    departmentId: 0,
  });
  const handleSetForm = (data: FilterForm) => {
    setForm(data);
    setLoaded(false);
  };

  const loadPrintEntries = useCallback(async () => {
    const req = new ReceiptJournalReportLine();
    req.setDateRangeList(['>=', form.startDate, '<=', form.endDate]);
    if (form.departmentId != 0) {
      req.setDepartmentId(form.departmentId);
    }
    req.setWithoutLimit(true);
    const results = await ReportClientService.GetReceiptJournalReport(req);
    setPrintEntries(results.getDataList());
  }, [setPrintEntries, form]);

  const load = useCallback(async () => {
    setLoading(true);

    const req = new ReceiptJournalReportLine();
    req.setDateRangeList(['>=', form.startDate, '<=', form.endDate]);
    if (form.departmentId != 0) {
      req.setDepartmentId(form.departmentId);
    }
    req.setPageNumber(page);
    const results = await ReportClientService.GetReceiptJournalReport(req);
    setEntries(results.getDataList());
    setCount(results.getTotalCount());

    setLoading(false);
  }, [setLoading, page, form]);

  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
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

  const SCHEMA: Schema<FilterForm> = [
    [
      {
        name: 'startDate',
        label: 'Start Date',
        type: 'mui-date',
      },
      {
        name: 'endDate',
        label: 'End Date',
        type: 'mui-date',
      },
      {
        name: 'departmentId',
        label: 'Department',
        type: 'department',
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

  const getData = (entries: ReceiptJournalReportLine[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const id = entry.getEventId();
          const paidAmount = usd(entry.getAmountCollected());
          const billingDate = entry.getSrDatetime();
          const paymentMethod = entry.getPaymentType();
          const department = entry.getDepartmentId();

          return [
            {
              value: id,
            },
            {
              value: paidAmount,
            },
            {
              value: billingDate,
            },
            {
              value: paymentMethod,
            },
            {
              value: department,
            },
          ];
        });
  return (
    <div>
      <SectionBar
        title="Receipts Journal Export Report"
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
                id: entry.getEventId(),
                paidAmount: usd(entry.getAmountCollected()),
                billingDate: entry.getSrDatetime(),
                paymentType: entry.getPaymentType(),
                departmentId: entry.getDepartmentId(),
              }))}
              fields={EXPORT_COLUMNS}
              filename={`Receipts_Journal_Report${format(
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
      {loading ? (
        <Loader></Loader>
      ) : (
        <div>
          <PlainForm
            key={formKey}
            schema={SCHEMA}
            data={form}
            onChange={data => handleSetForm(data)}
          />
          <InfoTable
            columns={COLUMNS.map(name => ({ name }))}
            data={getData(entries)}
            loading={loading}
            skipPreLine
          />
        </div>
      )}
    </div>
  );
};
