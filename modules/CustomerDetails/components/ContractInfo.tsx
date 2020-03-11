import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { ContractClient, Contract } from '@kalos-core/kalos-rpc/Contract';
import {
  ContractFrequencyClient,
  ContractFrequency,
} from '@kalos-core/kalos-rpc/ContractFrequency';
import { InvoiceClient, Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { makeStyles } from '@material-ui/core/styles';
import { ENDPOINT } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Customer } from '../../ComponentsLibrary/CustomerInformation';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema, Options } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { getRPCFields, formatDate } from '../../../helpers';
import { ContractDocuments } from './ContractDocuments';

const ContractClientService = new ContractClient(ENDPOINT);
const ContractFrequencyClientService = new ContractFrequencyClient(ENDPOINT);
const InvoiceClientService = new InvoiceClient(ENDPOINT);

type Entry = Contract.AsObject;
type ContractFrequencyType = ContractFrequency.AsObject;
type InvoiceType = Invoice.AsObject;

const BILLING_OPTIONS: Options = [
  { label: 'Site', value: 0 },
  { label: 'Group', value: 1 },
];

const PAYMENT_TYPE_OPTIONS: Options = [
  'Cash',
  'Check',
  'Credit Card',
  'PayPal',
  'Billing',
  'Financing',
  'AOR Warranty',
  'Service Warranty',
  'Extended Warranty',
  'Pre-Paid',
  'No Charge',
  'Account Transfer',
  'Charity',
];

const PAYMENT_STATUS_OPTIONS: Options = [
  'Pending',
  'Billed',
  'Canceled',
  'Paid',
];

const INVOICE_SCHEMA: Schema<InvoiceType> = [
  [{ name: 'id', type: 'hidden' }],
  [{ label: 'Invoice Data', headline: true }],
  [{ label: 'Terms', name: 'terms', multiline: true }],
  [
    { label: 'Services Performed (1)', name: 'servicesperformedrow1' },
    { label: 'Total Amount (1)', name: 'totalamountrow1' },
  ],
  [
    { label: 'Services Performed (2)', name: 'servicesperformedrow2' },
    { label: 'Total Amount (2)', name: 'totalamountrow2' },
  ],
  [
    { label: 'Services Performed (3)', name: 'servicesperformedrow3' },
    { label: 'Total Amount (3)', name: 'totalamountrow3' },
  ],
  [
    { label: 'Services Performed (4)', name: 'servicesperformedrow4' },
    { label: 'Total Amount (4)', name: 'totalamountrow4' },
  ],
  [{ label: 'Grand Total', name: 'totalamounttotal' }],
];

const makeContractNumber = (id: number) =>
  'C' +
  new Date()
    .getFullYear()
    .toString()
    .substr(2, 2) +
  '-' +
  id.toString().padStart(5, '0');

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('lg')]: {
      alignItems: 'flex-start',
    },
  },
  panel: {
    flexGrow: 1,
  },
  asidePanel: {
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      flexGrow: 1,
      marginBottom: theme.spacing(),
    },
    [theme.breakpoints.up('lg')]: {
      width: 470,
      marginLeft: theme.spacing(2),
    },
  },
  addContract: {
    marginBottom: theme.spacing(),
  },
}));

interface Props {
  userID: number;
  customer: Customer;
}

export const ContractInfo: FC<Props> = props => {
  const { userID, children, customer } = props;
  const [entry, setEntry] = useState<Entry>(new Contract().toObject());
  const [frequencies, setFrequencies] = useState<ContractFrequencyType[]>([]);
  const [invoice, setInvoice] = useState<InvoiceType>(new Invoice().toObject());
  const [invoiceInitial, setInvoiceInitial] = useState<InvoiceType>(
    new Invoice().toObject(),
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const classes = useStyles();

  const frequencyOptions: Options = useMemo(
    () => frequencies.map(({ id: value, name: label }) => ({ label, value })),
    [frequencies],
  );

  const loadFrequencies = useCallback(async () => {
    const entry = new ContractFrequency();
    const { resultsList } = (
      await ContractFrequencyClientService.BatchGet(entry)
    ).toObject();
    setFrequencies(resultsList);
  }, [setFrequencies]);

  const loadInvoice = useCallback(
    async (contract: Entry) => {
      const entry = new Invoice();
      entry.setContractId(contract.id);
      try {
        const invoice = await InvoiceClientService.Get(entry);
        setInvoiceInitial(invoice);
        setInvoice(invoice);
      } catch (e) {}
    },
    [setInvoice, setInvoiceInitial],
  );

  const load = useCallback(async () => {
    setLoaded(false);
    setLoading(true);
    const entry = new Contract();
    entry.setUserId(userID);
    entry.setIsActive(1);
    try {
      await loadFrequencies();
      const { resultsList, totalCount } = (
        await ContractClientService.BatchGet(entry)
      ).toObject();
      if (totalCount === 1) {
        const contract = resultsList[0];
        await loadInvoice(contract);
        setEntry(contract);
      }
      setLoaded(true);
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [userID, setEntry, setError, setLoaded, setLoading]);

  const handleToggleEditing = useCallback(() => {
    setEditing(!editing);
  }, [editing, setEditing, ,]);

  const handleSetDeleting = useCallback(
    (deleting: boolean) => () => setDeleting(deleting),
    [setDeleting],
  );

  const saveInvoice = useCallback(
    async (invoice: InvoiceType, entry: Entry) => {
      const req = new Invoice();
      req.setContractId(entry.id);
      req.setUserId(userID);
      const fieldMaskList = ['UserId', 'ContractId'];
      if (invoice.id !== 0) {
        req.setId(invoice.id);
      }
      for (const fieldName in invoice) {
        if (fieldName === 'id') continue;
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        req[methodName](invoice[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      // FIXME: Create sql fails
      const res = await InvoiceClientService[
        invoice.id === 0 ? 'Create' : 'Update'
      ](req);
      setInvoice(res);
      setInvoiceInitial(res);
    },
    [userID, setInvoice, setInvoiceInitial],
  );

  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
      const fieldMaskList = ['UserId'];
      const req = new Contract();
      req.setUserId(userID);
      if (entry.id !== 0) {
        req.setId(entry.id);
        fieldMaskList.push('Id');
      }
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        req[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      let res = await ContractClientService[
        entry.id === 0 ? 'Create' : 'Update'
      ](req);
      if (entry.id === 0) {
        const req2 = new Contract();
        req2.setId(res.id);
        req2.setNumber(makeContractNumber(res.id));
        req2.setFieldMaskList(['Number']);
        res = await ContractClientService.Update(req2);
      }
      await saveInvoice(invoice, res);
      setEntry(res);
      setSaving(false);
      setEditing(false);
    },
    [entry, userID, invoice, setSaving, setEntry, setEditing],
  );

  const handleDelete = useCallback(async () => {
    const req = new Contract();
    req.setId(entry.id);
    await ContractClientService.Delete(req);
    setDeleting(false);
    setEntry(new Contract().toObject());
  }, [entry, setDeleting]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const getFrequencyById = useMemo(
    () => (frequencyId: number) => {
      if (frequencyId === 0) return '';
      const frequency = frequencies.find(({ id }) => id === frequencyId);
      if (!frequency) return '';
      return frequency.name;
    },
    [frequencies],
  );

  const SCHEMA: Schema<Entry> = [
    [{ label: 'Contract Details', headline: true }],
    [
      {
        label: 'Start Date',
        name: 'dateStarted',
        required: true,
        type: 'date',
      },
      { label: 'End Date', name: 'dateEnded', required: true, type: 'date' },
    ],
    [
      {
        label: 'Frequency',
        name: 'frequency',
        required: true,
        options: frequencyOptions,
      },
      {
        label: 'Billing',
        name: 'groupBilling',
        required: true,
        options: BILLING_OPTIONS,
      },
    ],
    [
      {
        label: 'Payment Type',
        name: 'paymentType',
        required: true,
        options: PAYMENT_TYPE_OPTIONS,
      },
      {
        label: 'Payment Status',
        name: 'paymentStatus',
        required: true,
        options: PAYMENT_STATUS_OPTIONS,
      },
    ],
    [{ label: 'Notes', name: 'notes', multiline: true }],
    [
      {
        content: (
          <PlainForm<InvoiceType>
            schema={INVOICE_SCHEMA}
            data={invoice}
            onChange={setInvoice}
            disabled={saving}
          />
        ),
      },
    ],
  ];
  const {
    id,
    number,
    groupBilling,
    dateStarted,
    dateEnded,
    paymentType,
    paymentStatus,
    frequency,
    notes,
  } = entry;
  const { terms } = invoice;
  const data: Data = [
    [
      { label: 'Contract Number', value: number },
      { label: 'Billing', value: groupBilling === 1 ? 'Group' : 'Site' },
    ],
    [
      { label: 'Start Date', value: formatDate(dateStarted) },
      { label: 'Payment Type', value: paymentType },
    ],
    [
      { label: 'End Date', value: formatDate(dateEnded) },
      { label: 'Payment Status', value: paymentStatus },
    ],
    [
      { label: 'Frequency', value: getFrequencyById(frequency) },
      { label: 'Payment Terms', value: terms },
    ],
    [{ label: 'Notes', value: notes }],
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.panel}>
          {entry.id === 0 ? (
            <SectionBar
              title="Contract Info"
              actions={
                loading
                  ? []
                  : [
                      {
                        label: 'Add',
                        onClick: handleToggleEditing,
                      },
                    ]
              }
              className={classes.addContract}
            />
          ) : (
            <SectionBar
              title="Contract Info"
              actions={[
                {
                  label: 'Edit',
                  onClick: handleToggleEditing,
                },
                {
                  label: 'Materials',
                  url: [
                    '/index.cfm?action=admin:contracts.materials',
                    `contract_id=${id}`,
                  ].join('&'),
                },
                {
                  label: 'Summary',
                  url: [
                    '/index.cfm?action=admin:contracts.summary',
                    `contract_id=${id}`,
                    'refpage=1',
                  ].join('&'),
                },
                {
                  label: 'Delete',
                  onClick: handleSetDeleting(true),
                },
                {
                  label: 'New',
                  // onClick: handleSetDeleting(true),
                },
              ]}
            >
              <InfoTable
                data={data}
                loading={loading || saving}
                error={error}
              />
            </SectionBar>
          )}
          {children}
        </div>
        <div className={classes.asidePanel}>
          {entry.id > 0 && (
            <ContractDocuments contractId={entry.id} {...props} />
          )}
        </div>
      </div>
      <Modal open={editing} onClose={handleToggleEditing}>
        <Form<Entry>
          title={`Customer: ${customer.firstname} ${customer.lastname}`}
          subtitle={
            entry.id === 0 ? 'New contract' : `Edit contract: ${number}`
          }
          schema={SCHEMA}
          data={entry}
          onSave={handleSave}
          onClose={handleToggleEditing}
          disabled={saving}
        />
      </Modal>
      <ConfirmDelete
        open={deleting}
        onClose={handleSetDeleting(false)}
        onConfirm={handleDelete}
        kind="Contract"
        name={`${number}`}
      />
    </>
  );
};
