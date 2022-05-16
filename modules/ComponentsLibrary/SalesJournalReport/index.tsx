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
import { usd } from '../../../helpers';
import { Loader } from '../../Loader/main';
import { BILLING_STATUS_TYPE_LIST } from '../../../constants';
import {
  makeFakeRows,
  formatDate,
  InvoiceClientService,
  EventClientService,
} from '../../../helpers';
import { Event } from '../../../@kalos-core/kalos-rpc/Event';
import { format, parseISO } from 'date-fns';
import { ExportJSON } from '../ExportJSON';
import { ROWS_PER_PAGE } from '../../../constants';
import { TransactionReportLine } from '../../../@kalos-core/kalos-rpc/Report';

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  startDate: string;
  endDate: string;
  paymentStatus: string;
}

type FilterForm = {
  startDate: string;
  endDate: string;
  departmentId: number;
  paymentStatus: string;
};

const COLUMNS = [
  'Service Call ID',
  'Job Number',
  'Service Date',
  'Customer ID',
  'Customer',
  'Job Type Id',
  'Total Amount',
  'Billing Status',
  'Department ID',
];
const EXPORT_COLUMNS = [
  {
    label: 'Service Call ID',
    value: 'id',
  },
  {
    label: 'Job Number',
    value: 'jobNumber',
  },
  {
    label: 'Service Date',
    value: 'serviceDate',
  },
  {
    label: 'Customer ID',
    value: 'customerID',
  },
  {
    label: 'Job Type Id',
    value: 'jobTypeId',
  },
  {
    label: 'Total Amount',
    value: 'totalAmount',
  },
  {
    label: 'Billing Status',
    value: 'paymentStatus',
  },
];
export const SalesJournalReport: FC<Props> = ({
  loggedUserId,
  startDate,
  endDate,
  paymentStatus,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<Event[]>([]);
  const [printEntries, setPrintEntries] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [exportStatus, setExportStatus] = useState<Status>('idle');

  const [formKey, setFormKey] = useState<number>(0);
  const [form, setForm] = useState<FilterForm>({
    startDate,
    endDate,
    departmentId: 0,
    paymentStatus,
  });
  const handleSetForm = (data: FilterForm) => {
    setForm(data);
    setLoaded(false);
  };
  const loadPrintEntries = useCallback(async () => {
    const req = new Event();
    req.setDateTargetList(['date_started', 'date_started']);
    req.setDateRangeList(['>=', form.startDate, '<=', form.endDate]);
    req.setLogPaymentStatus(form.paymentStatus);
    if (form.departmentId != 0) {
      req.setDepartmentId(form.departmentId as number);
    }
    if (form.paymentStatus) {
      req.setLogPaymentStatus(form.paymentStatus);
    }
    req.setWithoutLimit(true);
    const results = await EventClientService.BatchGet(req);
    setPrintEntries(results.getResultsList());
  }, [setPrintEntries, form]);

  const load = useCallback(async () => {
    setLoading(true);
    const req = new Event();
    req.setDateTargetList(['date_started', 'date_started']);
    req.setDateRangeList(['>=', form.startDate, '<=', form.endDate]);
    if (form.departmentId != 0) {
      req.setDepartmentId(form.departmentId as number);
    }
    if (form.paymentStatus) {
      req.setLogPaymentStatus(form.paymentStatus);
    }
    req.setPageNumber(page);
    const results = await EventClientService.BatchGet(req);
    setEntries(results.getResultsList());
    setCount(results.getTotalCount());

    setLoading(false);
  }, [setLoading, page, form]);

  useEffect(() => {
    if (!loaded) {
      load();
      setLoaded(true);
    }
  }, [setLoaded, loaded, load]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage],
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
      {
        name: 'paymentStatus',
        label: 'Billing Status',
        options: BILLING_STATUS_TYPE_LIST.map(el => ({
          label: el,
          value: el,
        })),
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

  const getData = (entries: Event[]): Data =>
    loading
      ? makeFakeRows(5, 5)
      : entries.map(entry => {
          const id = entry.getId();
          const jobNumber = entry.getLogJobNumber();
          const serviceDate = entry.getDateStarted();
          const customerId = entry.getCustomer()!.getId();
          const customer = `${entry.getCustomer()?.getFirstname()} ${entry
            .getCustomer()
            ?.getLastname()}`;

          const jobTypeId = entry.getJobTypeId();
          const totalAmount = usd(
            parseFloat(
              entry.getTotalamountrow1() == ''
                ? '0'
                : entry.getTotalamountrow1(),
            ) +
              parseFloat(
                entry.getTotalamountrow2() == ''
                  ? '0'
                  : entry.getTotalamountrow2(),
              ) +
              parseFloat(
                entry.getTotalamountrow3() == ''
                  ? '0'
                  : entry.getTotalamountrow3(),
              ) +
              parseFloat(
                entry.getTotalamountrow4() == ''
                  ? '0'
                  : entry.getTotalamountrow4(),
              ) +
              entry.getMaterialTotal() -
              parseFloat(
                entry.getDiscountcost() == '' ? '0' : entry.getDiscountcost(),
              ),
          );

          const paymentStatus = entry.getLogPaymentStatus();
          const department = entry.getDepartmentId();

          return [
            {
              value: id,
            },
            {
              value: jobNumber,
            },
            {
              value: format(parseISO(serviceDate), 'yyyy/MM/dd'),
            },
            {
              value: customerId,
            },
            {
              value: customer,
            },
            {
              value: jobTypeId,
            },

            {
              value: totalAmount,
            },
            {
              value: paymentStatus,
            },
            {
              value: department,
            },
          ];
        });
  return (
    <div>
      <SectionBar
        title="Sales Journal Export Report"
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
                id: entry.getId(),
                jobNumber: entry.getLogJobNumber(),
                serviceDate: format(
                  parseISO(entry.getDateStarted()),
                  'yyyy/MM/dd',
                ),
                customerId: entry.getCustomer()!.getId(),
                jobTypeId: entry.getJobTypeId(),
                totalAmount: usd(
                  parseFloat(
                    entry.getTotalamountrow1() == ''
                      ? '0'
                      : entry.getTotalamountrow1(),
                  ) +
                    parseFloat(
                      entry.getTotalamountrow2() == ''
                        ? '0'
                        : entry.getTotalamountrow2(),
                    ) +
                    parseFloat(
                      entry.getTotalamountrow3() == ''
                        ? '0'
                        : entry.getTotalamountrow3(),
                    ) +
                    parseFloat(
                      entry.getTotalamountrow4() == ''
                        ? '0'
                        : entry.getTotalamountrow4(),
                    ) +
                    entry.getMaterialTotal() -
                    parseFloat(
                      entry.getDiscountcost() == ''
                        ? '0'
                        : entry.getDiscountcost(),
                    ),
                ),
                paymentStatus: entry.getLogPaymentStatus(),
                department: entry.getDepartmentId(),
              }))}
              fields={EXPORT_COLUMNS}
              filename={`Sales_Journal_Report${format(
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
