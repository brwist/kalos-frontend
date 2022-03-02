import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { format, addMonths, parseISO } from 'date-fns';
import kebabCase from 'lodash/kebabCase';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import AwardIcon from '@material-ui/icons/Loyalty';
import ListIcon from '@material-ui/icons/List';
import { SectionBar } from '../SectionBar';
import { Button } from '../Button';
import { PrintPage } from '../PrintPage';
import { PrintTable } from '../PrintTable';
import { PrintHeader } from '../PrintHeader';
import { PrintPageBreak } from '../PrintPageBreak';
import { PrintParagraph } from '../PrintParagraph';
import { InfoTable } from '../InfoTable';
import { Loader } from '../../Loader/main';
import { PlainForm, Schema } from '../PlainForm';
import { Modal } from '../Modal';
import { Form } from '../Form';
import {
  loadPromptPaymentData,
  usd,
  PromptPaymentData,
  formatDate,
} from '../../../helpers';
import { PromptPaymentReportLine } from '@kalos-core/kalos-rpc/Report';
const FORM_LAST_MONTHS = 4 * 12;

interface Props {
  month: string;
  onClose?: () => void;
}

type FormData = {
  month: string;
};

type AwardFormData = {
  kind: 'award' | 'forfeit';
  reason: string;
};

type OpenedInvoices = {
  customerName: string;
  entries: PromptPaymentReportLine[];
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

const SCHEMA_AWARD: Schema<AwardFormData> = [
  [
    {
      name: 'kind',
      label: 'Kind',
      options: ['award', 'forfeit'],
    },
  ],
  [
    {
      name: 'reason',
      label: 'Reason',
      multiline: true,
    },
  ],
];

export const PromptPaymentReport: FC<Props> = ({
  month: initialMonth,
  onClose,
}) => {
  console.log(initialMonth);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<
    { averageDaysToPay: number; promptPaymentData: PromptPaymentData }[]
  >([]);
  const [form, setForm] = useState<FormData>({ month: initialMonth });
  const [openedInvoices, setOpenedInvoices] = useState<OpenedInvoices>();
  const [editingAward, setEditingAward] = useState<PromptPaymentReportLine>();
  const load = useCallback(async () => {
    setLoading(true);
    console.log('loading');
    const data = await loadPromptPaymentData(form.month);
    console.log('loaded');

    setData(data);
    console.log(data);
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
  const handleToggleEditingAward = useCallback(
    (editingAward?: PromptPaymentReportLine) => () =>
      setEditingAward(editingAward),
    [setEditingAward],
  );
  const handleSaveAward = useCallback(
    async (data: AwardFormData) => {
      console.log(data); // TODO save data once api will have endpoint
      setEditingAward(undefined);
    },
    [setEditingAward],
  );
  const subtitle = useMemo(
    () => format(parseISO(form.month.replace('%', '01')), 'MMMM yyyy'),
    [form],
  );
  const subtitleMonth = useMemo(
    () => format(parseISO(form.month.replace('%', '01')), 'MMMM'),
    [form],
  );
  const renderCustomerPayableReport = ({
    customerId,
    customerName,
    entries,
    allInvoices,
    payableTotal,
    paidOnTime,
    paidInvoices,
    possibleAwardTotal,
  }: PromptPaymentData) => (
    <div key={customerId}>
      <PrintHeader withKalosAddress bigLogo />
      <PrintTable
        columns={[
          { title: '', align: 'left' },
          { title: '', align: 'right' },
        ]}
        data={[
          [
            <PrintParagraph
              key={'Report'}
              style={{ fontStyle: 'italic', marginTop: 4 }}
            >
              To our friends at {customerName},
              <br />
              <br />
              in the month of {subtitleMonth}, we did {usd(payableTotal)} in
              work across
              <br />
              {allInvoices} invoices. With {paidOnTime} out of {paidInvoices}{' '}
              invoices paid within expected
              <br />
              terms, we are pleased to offer {usd(possibleAwardTotal)} as a
              thank you
              <br />
              for working with us.
            </PrintParagraph>,
            <>
              <PrintParagraph
                tag="h1"
                align="right"
                style={{ marginTop: 0, marginBottom: 2 }}
              >
                {customerName}
              </PrintParagraph>
              <PrintParagraph tag="h1" align="right" style={{ marginTop: 0 }}>
                {subtitle}
              </PrintParagraph>
            </>,
          ],
        ]}
        noBorders
        styles={{ marginTop: 20 }}
      />
      <PrintParagraph tag="h2" align="right">
        Invoice Details
      </PrintParagraph>
      <PrintTable
        columns={[
          { title: 'Invoice Number', align: 'left' },
          { title: 'Due Date', align: 'right' },
          { title: 'Payment Date', align: 'right' },
          { title: 'Days to Pay', align: 'right' },
          { title: 'Paid', align: 'right' },
          { title: 'Comments', align: 'center' },
          { title: 'Award', align: 'right' },
        ]}
        data={entries.map(entry => [
          entry.getJobNumber(),
          formatDate(entry.getDueDate()),
          formatDate(entry.getPaymentDate()),
          `${entry.getDaysToPay()}/${entry.getPaymentTerms()}`,
          usd(entry.getPayed()),
          '', // TODO
          usd(entry.getPossibleAward()),
        ])}
      />
      <PrintPageBreak height={0} />
    </div>
  );

  return (
    <div>
      <SectionBar
        title="Prompt Payment Report"
        asideContent={
          <>
            <PrintPage
              buttonProps={{
                label: 'Print Payable Reports',
                disabled: loading,
              }}
              downloadPdfFilename={`PPR-Letter-elligible-customers-${subtitleMonth}`}
              downloadLabel="Download Payable Reports"
            >
              {data.map(data =>
                renderCustomerPayableReport(data.promptPaymentData),
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
            data={data!.map(entry => {
              const {
                customerName,
                payableAward,
                forfeitedAward,
                pendingAward,
                averageDaysToPay,
                daysToPay,
                paidInvoices,
                allInvoices,
                entries,
              } = entry.promptPaymentData;

              return [
                {
                  value: customerName,
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
                },
                {
                  value: usd(payableAward),
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
                },
                {
                  value: usd(forfeitedAward),
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
                },
                {
                  value: usd(pendingAward),
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
                },
                {
                  value: `${averageDaysToPay}/${daysToPay}`,
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
                },
                {
                  value: `${paidInvoices}/${allInvoices}`,
                  onClick: handleSetOpenedInvoices({ customerName, entries }),
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
                    <PrintPage
                      key="print"
                      downloadPdfFilename={`${kebabCase(
                        customerName,
                      )}-${subtitleMonth}`}
                      icons
                    >
                      {renderCustomerPayableReport(entry.promptPaymentData)}
                    </PrintPage>,
                  ],
                },
              ];
            })}
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
              return [
                {
                  value: formatDate(entry.getBillingdate()),
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: formatDate(entry.getDueDate()),
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: entry.getPaymentDate()
                    ? formatDate(entry.getPaymentDate())
                    : '',
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: entry.getJobNumber(),
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: usd(entry.getPayable()),
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: usd(entry.getPayed()),
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: `${entry.getDaysToPay()}/${entry.getPaymentTerms()}`,
                  onClick: handleToggleEditingAward(entry),
                },
                {
                  value: usd(entry.getPossibleAward()),
                  onClick: handleToggleEditingAward(entry),
                  actions: [
                    <IconButton
                      key="view"
                      size="small"
                      onClick={handleToggleEditingAward(entry)}
                    >
                      <AwardIcon />
                    </IconButton>,
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
      {editingAward && (
        <Modal open onClose={handleToggleEditingAward()}>
          <Form
            title="Award Edit"
            subtitle={editingAward.getJobNumber()}
            schema={SCHEMA_AWARD}
            data={{
              kind: 'award',
              reason: '',
            }}
            onClose={handleToggleEditingAward()}
            onSave={handleSaveAward}
          />
        </Modal>
      )}
    </div>
  );
};
