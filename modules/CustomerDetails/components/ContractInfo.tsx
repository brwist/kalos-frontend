import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
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
import { Options } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import { formatDate, getCFAppUrl } from '../../../helpers';
import { ContractDocuments } from './ContractDocuments';
import './contractInfo.less';
import { User } from '@kalos-core/kalos-rpc/User';
import { EditContractInfo } from '../../ComponentsLibrary/EditContractInfo';
import { Document } from '@kalos-core/kalos-rpc/Document';

const ContractClientService = new ContractClient(ENDPOINT);
const ContractFrequencyClientService = new ContractFrequencyClient(ENDPOINT);
const InvoiceClientService = new InvoiceClient(ENDPOINT);
const PropertyClientService = new PropertyClient(ENDPOINT);

export const PAYMENT_TYPE_OPTIONS: Options = [
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

export const PAYMENT_STATUS_OPTIONS: Options = [
  'Pending',
  'Billed',
  'Canceled',
  'Paid',
];

interface Props {
  userID: number;
  customer: User;
}

export const ContractInfo: FC<Props> = props => {
  const { userID, children } = props;
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
  const [loadedDocs, setLoadedDocs] = useState<Document[]>([]);

  const loadFrequencies = useCallback(async () => {
    const entry = new ContractFrequency();
    const results = await ContractFrequencyClientService.BatchGet(entry);
    setFrequencies(results.getResultsList());
  }, [setFrequencies]);

  const loadInvoice = useCallback(
    async (contract: Contract) => {
      const entry = new Invoice();
      entry.setContractId(contract.getId());
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
    const results = await PropertyClientService.BatchGet(req);

    setProperties(results.getResultsList());
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
        setPropertiesIds(
          contract
            .getProperties()
            .split(',')
            .map(id => +id),
        );
        await loadInvoice(contract);
        setEntry(contract);
      }
      setLoaded(true);
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  }, [userID, loadProperties, loadFrequencies, loadInvoice]);

  const handleToggleEditing = useCallback(() => {
    setEditing(!editing);
    setInvoice(invoiceInitial);
  }, [editing, setEditing, setInvoice, invoiceInitial]);

  const handleSetDeleting = useCallback(
    (deleting: boolean) => () => setDeleting(deleting),
    [setDeleting],
  );

  const handleDelete = useCallback(async () => {
    const req = new Contract();
    req.setId(entry.getId());
    await ContractClientService.Delete(req);
    setDeleting(false);
    setEntry(new Contract());
  }, [entry, setDeleting]);

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);

  const getFrequencyById = useMemo(
    () => (frequencyId: number) => {
      if (frequencyId === 0) return '';
      const frequency = frequencies.find(
        frequency => frequency.getId() === frequencyId,
      );
      if (!frequency) return '';
      return frequency.getName();
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
        `contract_id=${entry.getId()}`,
      ].join('&')),
    [entry],
  );

  const handleSetLoadedDocs = useCallback(
    (documents: Document[]) => setLoadedDocs(documents),
    [setLoadedDocs],
  );

  const data: Data = [
    [
      { label: 'Contract Number', value: entry.getNumber() },
      {
        label: 'Billing',
        value: entry.getGroupBilling() === 1 ? 'Group' : 'Site',
      },
    ],
    [
      { label: 'Start Date', value: formatDate(entry.getDateStarted()) },
      { label: 'Payment Type', value: entry.getPaymentType() },
    ],
    [
      { label: 'End Date', value: formatDate(entry.getDateEnded()) },
      { label: 'Payment Status', value: entry.getPaymentStatus() },
    ],
    [
      { label: 'Frequency', value: getFrequencyById(entry.getFrequency()) },
      { label: 'Payment Terms', value: entry.getPaymentTerms() },
    ],
    [{ label: 'Notes', value: entry.getNotes() }],
  ];

  return (
    <>
      {editing && (
        <Modal open={true} onClose={() => handleToggleEditing()} fullScreen>
          <EditContractInfo
            userID={userID}
            contractID={entry.getId()}
            onSaveFinished={() => {
              handleToggleEditing();
              load();
            }}
            onClose={() => {
              handleToggleEditing();
              load();
            }}
          />
        </Modal>
      )}
      <div className="ContractInfo">
        <div className="ContractInfoPanel">
          {entry.getId() === 0 ? (
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
                  onClick: handleToggleEditing,
                },
                {
                  label: 'Materials',
                  url: [
                    getCFAppUrl('admin:contracts.materials'),
                    `contract_id=${entry.getId()}`,
                  ].join('&'),
                },
                {
                  label: 'Summary',
                  url: [
                    getCFAppUrl('admin:contracts.summary'),
                    `contract_id=${entry.getId()}`,
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
          <ContractDocuments
            onDocumentsLoaded={documents => handleSetLoadedDocs(documents)}
            contractID={entry.getId()}
            {...props}
          />
        </div>
      </div>
      <ConfirmDelete
        open={deleting}
        onClose={handleSetDeleting(false)}
        onConfirm={handleDelete}
        kind="Contract"
        name={`${entry.getNumber()}`}
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
