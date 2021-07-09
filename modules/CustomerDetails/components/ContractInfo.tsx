import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { ContractClient, Contract } from '@kalos-core/kalos-rpc/Contract';
import {
  ContractFrequencyClient,
  ContractFrequency,
} from '@kalos-core/kalos-rpc/ContractFrequency';
import { InvoiceClient, Invoice } from '@kalos-core/kalos-rpc/Invoice';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema, Options } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { Field, Value } from '../../ComponentsLibrary/Field';
import { getRPCFields, formatDate, getCFAppUrl } from '../../../helpers';
import { ContractDocuments } from './ContractDocuments';
import './contractInfo.less';
import { User } from '@kalos-core/kalos-rpc/User';

const ContractClientService = new ContractClient(ENDPOINT);
const ContractFrequencyClientService = new ContractFrequencyClient(ENDPOINT);
const InvoiceClientService = new InvoiceClient(ENDPOINT);
const PropertyClientService = new PropertyClient(ENDPOINT);

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

const INVOICE_SCHEMA: Schema<Invoice> = [
  [{ name: 'getId', type: 'hidden' }],
  [{ label: 'Invoice Data', headline: true }],
  [{ label: 'Terms', name: 'getTerms', multiline: true }],
  [
    { label: 'Services Performed (1)', name: 'getServicesperformedrow1' },
    { label: 'Total Amount (1)', name: 'getTotalamountrow1' },
  ],
  [
    { label: 'Services Performed (2)', name: 'getServicesperformedrow2' },
    { label: 'Total Amount (2)', name: 'getTotalamountrow2' },
  ],
  [
    { label: 'Services Performed (3)', name: 'getServicesperformedrow3' },
    { label: 'Total Amount (3)', name: 'getTotalamountrow3' },
  ],
  [
    { label: 'Services Performed (4)', name: 'getServicesperformedrow4' },
    { label: 'Total Amount (4)', name: 'getTotalamountrow4' },
  ],
  [{ label: 'Grand Total', name: 'getTotalamounttotal' }],
];

const makeContractNumber = (id: number) =>
  'C' +
  new Date().getFullYear().toString().substr(2, 2) +
  '-' +
  id.toString().padStart(5, '0');

interface Props {
  userID: number;
  customer: User;
}

export const ContractInfo: FC<Props> = props => {
  const { userID, children, customer } = props;
  const [entry, setEntry] = useState<Contract>(new Contract());
  const [frequencies, setFrequencies] = useState<ContractFrequency[]>([]);
  const [invoice, setInvoice] = useState<Invoice>(new Invoice());
  const [invoiceInitial, setInvoiceInitial] = useState<Invoice>(new Invoice());
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesIds, setPropertiesIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [confirmNew, setConfirmNew] = useState<boolean>(false);

  const frequencyOptions: Options = useMemo(
    () =>
      frequencies.map(frequency => ({
        label: frequency.getName(),
        value: frequency.getId(),
      })),
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
      } catch (e) {
        console.log(e);
      }
    },
    [setInvoice, setInvoiceInitial],
  );

  const loadProperties = useCallback(async () => {
    const req = new Property();
    req.setUserId(userID);
    req.setIsActive(1);
    const { resultsList } = (
      await PropertyClientService.BatchGet(req)
    ).toObject();
    setProperties(resultsList);
  }, [userID, setProperties]);

  const load = useCallback(async () => {
    setLoaded(false);
    setLoading(true);
    const entry = new Contract();
    entry.setUserId(userID);
    entry.setIsActive(1);
    entry.setOrderBy('contract_date_started');
    entry.setOrderDir('desc');
    try {
      await loadProperties();
      await loadFrequencies();
      const contract = await ContractClientService.Get(entry);
      if (contract) {
        setPropertiesIds(contract.properties.split(',').map(id => +id));
        await loadInvoice(contract);
        setEntry(contract);
      }
      setLoaded(true);
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [userID, setEntry, setError, setLoaded, setLoading, setPropertiesIds]);

  const handleToggleEditing = useCallback(() => {
    setEditing(!editing);
    setInvoice(invoiceInitial);
  }, [editing, setEditing, setInvoice, invoiceInitial]);

  const handleSetDeleting = useCallback(
    (deleting: boolean) => () => setDeleting(deleting),
    [setDeleting],
  );

  const handleChangePropertiesIds = useCallback(
    (id: number) => (value: Value) => {
      if (value === 1) {
        setPropertiesIds([...propertiesIds, id]);
      } else {
        setPropertiesIds(propertiesIds.filter(_id => _id !== id));
      }
    },
    [propertiesIds, setPropertiesIds],
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
      const fieldMaskList = ['UserId', 'Properties'];
      const req = new Contract();
      req.setUserId(userID);
      req.setProperties(propertiesIds.join(','));
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
    [entry, userID, invoice, setSaving, setEntry, setEditing, propertiesIds],
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

  const handleSetConfirmNew = useCallback(
    (confirmNew: boolean) => () => setConfirmNew(confirmNew),
    [setConfirmNew],
  );

  const handleNewContract = useCallback(
    () =>
      (document.location.href = [
        getCFAppUrl('admin:contracts.contractnew'),
        `contract_id=${entry.id}`,
      ].join('&')),
    [entry],
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
    paymentTerms,
  } = entry;
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
      { label: 'Payment Terms', value: paymentTerms },
    ],
    [{ label: 'Notes', value: notes }],
  ];
  const propertiesData: Data = properties.map(
    ({ id, address, city, state, zip }, idx) => [
      {
        value: (
          <Field
            name={`property-${id}`}
            label={`${address}, ${city}, ${state} ${zip}`}
            type="checkbox"
            value={propertiesIds.includes(id)}
            onChange={handleChangePropertiesIds(id)}
            className="ContractInfoProperty"
            disabled={saving}
          />
        ),
        actions: propertiesIds.includes(id)
          ? [
              // TODO: PM's count
              <span key={0} className="ContractInfoPropertyPM">
                PMs: 1 <AddCircleIcon className="ContractInfoPropertyAdd" />
              </span>,
            ]
          : [],
      },
    ],
  );
  return (
    <>
      <div className="ContractInfo">
        <div className="ContractInfoPanel">
          {entry.id === 0 ? (
            <SectionBar
              title="Contract Info"
              actions={
                loading
                  ? []
                  : [
                      {
                        label: 'Add',
                        // onClick: handleToggleEditing, // TODO finish edit form
                        url: [
                          getCFAppUrl('admin:contracts.add'),
                          `user_id=${userID}`,
                        ].join('&'),
                      },
                    ]
              }
              className="ContractInfoAddContract"
            />
          ) : (
            <SectionBar
              title="Contract Info"
              actions={[
                {
                  label: 'Edit',
                  // onClick: handleToggleEditing, // TODO: finish edit form
                  url: [
                    getCFAppUrl('admin:contracts.edit'),
                    `contract_id=${id}`,
                    'p=1',
                  ].join('&'),
                },
                {
                  label: 'Materials',
                  url: [
                    getCFAppUrl('admin:contracts.materials'),
                    `contract_id=${id}`,
                  ].join('&'),
                },
                {
                  label: 'Summary',
                  url: [
                    getCFAppUrl('admin:contracts.summary'),
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
                  onClick: handleSetConfirmNew(true),
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
        <div className="ContractInfoAsidePanel">
          <ContractDocuments contractID={entry.id} {...props} />
        </div>
      </div>
      <Modal open={editing} onClose={handleToggleEditing}>
        <div className="ContractInfoForm">
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
          <div className="ContractInfoProperties">
            <SectionBar title="Properties" />
            <InfoTable data={propertiesData} />
          </div>
        </div>
      </Modal>
      <ConfirmDelete
        open={deleting}
        onClose={handleSetDeleting(false)}
        onConfirm={handleDelete}
        kind="Contract"
        name={`${number}`}
      />
      <Confirm
        title="Confirm New Contract"
        open={confirmNew}
        onClose={handleSetConfirmNew(false)}
        onConfirm={handleNewContract}
      >
        Are you sure you want to create a new contract? This will replace the
        old one (documents will remail).
      </Confirm>
    </>
  );
};
