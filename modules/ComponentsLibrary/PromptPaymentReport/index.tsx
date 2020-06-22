import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { getCurrDate, loadPromptPaymentData, usd } from '../../../helpers';

interface Props {
  month: string;
  onClose?: () => void;
}

const useStyles = makeStyles(theme => ({
  table: {
    marginBottom: theme.spacing(0.25),
  },
}));

export const PromptPaymentReport: FC<Props> = ({ month, onClose }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const data = await loadPromptPaymentData();
    setData(data);
    setLoading(false);
  }, [setLoading, setData]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const subtitle = useMemo(
    () => format(new Date(month.replace('%', '01')), 'MMMM yyyy'),
    [],
  );
  return (
    <div>
      <SectionBar
        title="Prompt Payment Report"
        subtitle={subtitle}
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
                        paidInvoices,
                        allInvoices,
                      }) => [
                        customerName,
                        usd(payableAward),
                        usd(forfeitedAward),
                        usd(pendingAward),
                        `${averageDaysToPay}/30`,
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
                paidInvoices,
                allInvoices,
              }) => [
                { value: customerName },
                { value: usd(payableAward) },
                { value: usd(forfeitedAward) },
                { value: usd(pendingAward) },
                { value: `${averageDaysToPay}/30` },
                { value: `${paidInvoices}/${allInvoices}` },
              ],
            )}
          />
        </>
      )}
    </div>
  );
};
