import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format, addMonths } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { PlainForm, Schema } from '../PlainForm';
import {
  getCurrDate,
  loadPromptPaymentData,
  usd,
  PromptPaymentData,
} from '../../../helpers';

const FORM_LAST_MONTHS = 4 * 12;

interface Props {
  month: string;
  onClose?: () => void;
}

type FormData = {
  month: string;
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
              downloadPdfFilename={`Prompt_Payment_Report_${getCurrDate()}`}
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
              }) => [
                { value: customerName },
                { value: usd(payableAward) },
                { value: usd(forfeitedAward) },
                { value: usd(pendingAward) },
                { value: `${averageDaysToPay}/${daysToPay}` },
                { value: `${paidInvoices}/${allInvoices}` },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
