import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { ContractClient, Contract } from '@kalos-core/kalos-rpc/Contract';
import {
  ContractFrequencyClient,
  ContractFrequency,
} from '@kalos-core/kalos-rpc/ContractFrequency';
import { makeStyles } from '@material-ui/core/styles';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
import { Customer } from '../../ComponentsLibrary/CustomerInformation';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { Field, Value } from '../../ComponentsLibrary/Field';
import { getRPCFields, formatDate } from '../../../helpers';
import { ContractDocuments } from './ContractDocuments';

const ContractClientService = new ContractClient(ENDPOINT);
const ContractFrequencyClientService = new ContractFrequencyClient(ENDPOINT);

type Entry = Contract.AsObject;
type ContractFrequencyType = ContractFrequency.AsObject;

const SCHEMA: Schema<Entry> = [
  [{ label: 'Contract Details', headline: true }],
  [
    // { label: 'Start Date', name: 'dateStarted', required: true },
    // { label: 'End Date', name: 'dateEnded', required: true },
  ],
  [
    // { label: 'Frequency', name: 'frequency', required: true },
    // { label: 'Billing', name: 'groupBilling', required: true },
  ],
  [
    // { label: 'Payment Type', name: 'paymentType', required: true },
    // { label: 'Payment Status', name: 'paymentStatus', required: true },
  ],
  [{ label: 'Notes', name: 'notes', multiline: true }],
  [{ label: 'Invoice Data', headline: true }],
  [{ label: 'Terms', name: 'paymentTerms', multiline: true }],
];

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
}));

interface Props {
  userID: number;
  customer: Customer;
}

export const ContractInfo: FC<Props> = props => {
  const { userID, children, customer } = props;
  const [entry, setEntry] = useState<Entry>(new Contract().toObject());
  const [frequencies, setFrequencies] = useState<ContractFrequencyType[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const classes = useStyles();

  const loadFrequencies = useCallback(async () => {
    const entry = new ContractFrequency();
    const { resultsList } = (
      await ContractFrequencyClientService.BatchGet(entry)
    ).toObject();
    setFrequencies(resultsList);
  }, [setFrequencies]);

  const load = useCallback(async () => {
    setLoaded(false);
    setLoading(true);
    const entry = new Contract();
    entry.setUserId(userID);
    entry.setIsActive(1);
    try {
      await loadFrequencies();
      const customer = await ContractClientService.Get(entry);
      setEntry(customer);
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

  const handleSave = useCallback(
    async (data: Entry) => {
      setSaving(true);
      const req = new Contract();
      req.setId(entry.id);
      const fieldMaskList = [];
      for (const fieldName in data) {
        const { upperCaseProp, methodName } = getRPCFields(fieldName);
        // @ts-ignore
        req[methodName](data[fieldName]);
        fieldMaskList.push(upperCaseProp);
      }
      req.setFieldMaskList(fieldMaskList);
      const res = await ContractClientService.Update(req);
      setEntry(res);
      setSaving(false);
      setEditing(false);
    },
    [entry, setSaving, setEntry, setEditing],
  );

  const handleDelete = useCallback(async () => {
    // TODO: delete customer related data?
    // const entry = new User();
    // entry.setId(userID);
    // await UserClientService.Delete(entry);
    // setDeleting(false);
  }, [userID, setDeleting]);

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

  const {
    id,
    number,
    groupBilling,
    dateStarted,
    dateEnded,
    paymentType,
    paymentStatus,
    paymentTerms,
    frequency,
    notes,
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
      {
        label: 'Frequency',
        value: getFrequencyById(frequency),
      },
      { label: 'Payment Terms', value: paymentTerms },
    ],
    [
      {
        label: 'Notes',
        value: notes,
      },
    ],
  ];

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.panel}>
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
            <InfoTable data={data} loading={loading || saving} error={error} />
          </SectionBar>
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
          subtitle={`Edit contract: ${number}`}
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
