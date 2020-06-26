import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format, addMonths } from 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ZoomIcon from '@material-ui/icons/Search';
import ListIcon from '@material-ui/icons/List';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { PlainForm, Schema } from '../PlainForm';
import { Modal } from '../Modal';
import {
  loadPromptPaymentData,
  usd,
  PromptPaymentData,
  PromptPaymentReportLineType,
  formatDate,
} from '../../../helpers';

const FORM_LAST_MONTHS = 4 * 12;

interface Props {
  month: string;
  onClose?: () => void;
}

type FormData = {
  month: string;
};

type OpenedInvoices = {
  customerName: string;
  entries: PromptPaymentReportLineType[];
};

const today = Date.now();

const SCHEMA: Schema<FormData> = [
  [
    {
      name: 'month',
      label: 'Month',
      options: [...Array(FORM_LAST_MONTHS)].map((_, idx) => {
        const date = addMonths(today, -idx);
        return {
          value: format(date, 'yyyy-MM-%'),
          label: format(date, 'MMMM, yyyy'),
        };
      }),
    },
  ],
];

export const PromptPaymentReport: FC<Props> = ({
  month: initialMonth,
  onClose,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<PromptPaymentData[]>([]);
  const [form, setForm] = useState<FormData>({ month: initialMonth });
  const [openedInvoices, setOpenedInvoices] = useState<OpenedInvoices>();
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadPromptPaymentData(form.month);
    setData(data);
    setLoading(false);
  }, [setLoading, setData, form]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleFormChange = useCallback(
    (data: FormData) => {
      setForm(data);
      setLoaded(false);
    },
    [setForm, setLoaded],
  );
  const handleSetOpenedInvoices = useCallback(
    (openedInvoices?: OpenedInvoices) => () =>
      setOpenedInvoices(openedInvoices),
    [setOpenedInvoices],
  );
  const subtitle = useMemo(
    () => format(new Date(form.month.replace('%', '01')), 'MMMM yyyy'),
    [form],
  );
  return (
    <div>
      <SectionBar
        title="Prompt Payment Report"
        asideContent={
          <>
            <PrintPage
              headerProps={{
                title: 'Prompt Payment Report',
                subtitle,
              }}
              buttonProps={{
                label: 'Print',
                disabled: loading,
              }}
            >
              {!loading && (
                <>
                  <PrintTable
                    columns={[
                      'Customer',
                      { title: 'Payable Award', align: 'right' },
                      { title: 'Forfeited Award', align: 'right' },
                      { title: 'Pending Award', align: 'right' },
                      { title: 'Average Days to Pay', align: 'right' },
                      { title: 'Paid Invoices', align: 'right' },
                    ]}
                    data={data.map(
                      ({
                        customerName,
                        payableAward,
                        forfeitedAward,
                        pendingAward,
                        averageDaysToPay,
                        daysToPay,
                        paidInvoices,
                        allInvoices,
                      }) => [
                        customerName,
                        usd(payableAward),
                        usd(forfeitedAward),
                        usd(pendingAward),
                        `${averageDaysToPay}/${daysToPay}`,
                        `${paidInvoices}/${allInvoices}`,
                      ],
                    )}
                  />
                </>
              )}
            </PrintPage>
            {onClose && <Button label="Close" onClick={onClose} />}
          </>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <PlainForm schema={SCHEMA} data={form} onChange={handleFormChange} />
          <InfoTable
            columns={[
              { name: 'Customer' },
              { name: 'Payable Award' },
              { name: 'Forfeited Award' },
              { name: 'Pending Award' },
              { name: 'Average Days to Pay' },
              { name: 'Paid Invoices' },
            ]}
            data={data.map(
              ({
                customerName,
                payableAward,
                forfeitedAward,
                pendingAward,
                averageDaysToPay,
                daysToPay,
                paidInvoices,
                allInvoices,
                entries,
              }) => [
                { value: customerName },
                { value: usd(payableAward) },
                { value: usd(forfeitedAward) },
                { value: usd(pendingAward) },
                { value: `${averageDaysToPay}/${daysToPay}` },
                {
                  value: `${paidInvoices}/${allInvoices}`,
                  actions: [
                    <IconButton
                      key="view"
                      size="small"
                      onClick={handleSetOpenedInvoices({
                        customerName,
                        entries,
                      })}
                    >
                      <ListIcon />
                    </IconButton>,
                    <IconButton key="download" size="small">
                      <DownloadIcon />
                    </IconButton>,
                  ],
                },
              ],
            )}
          />
        </>
      )}
      {openedInvoices && (
        <Modal open onClose={handleSetOpenedInvoices()} fullScreen>
          <SectionBar
            title={openedInvoices.customerName}
            actions={[{ label: 'Close', onClick: handleSetOpenedInvoices() }]}
            fixedActions
          />
          <InfoTable
            columns={[
              { name: 'Invoice Date' },
              { name: 'Due Date' },
              { name: 'Payment Date' },
              { name: 'Invoice Number' },
              { name: 'Payable' },
              { name: 'Paid' },
              { name: 'Days to Pay' },
              { name: 'Award' },
            ]}
            data={openedInvoices.entries.map(entry => {
              const {
                billingdate,
                dueDate,
                paymentDate,
                jobNumber,
                payable,
                payed,
                daysToPay,
                paymentTerms,
              } = entry;
              return [
                { value: formatDate(billingdate) },
                { value: formatDate(dueDate) },
                { value: paymentDate ? formatDate(paymentDate) : '' },
                { value: jobNumber },
                { value: usd(payable) },
                { value: usd(payed) },
                { value: `${daysToPay}/${paymentTerms}` },
                {
                  value: usd(0), // FIXME
                  actions: [
                    <IconButton key="view" size="small">
                      <ZoomIcon />
                    </IconButton>, // TODO
                    <IconButton key="edit" size="small">
                      <EditIcon />
                    </IconButton>,
                    <IconButton key="download" size="small">
                      <DownloadIcon />
                    </IconButton>, // TODO
                  ],
                },
              ];
            })}
          />
        </Modal>
      )}
    </div>
  );
};
