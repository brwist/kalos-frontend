import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { ContractClient, Contract } from '@kalos-core/kalos-rpc/Contract';
import {
  ContractFrequencyClient,
  ContractFrequency,
} from '@kalos-core/kalos-rpc/ContractFrequency';
import { makeStyles } from '@material-ui/core/styles';
import { ENDPOINT, USA_STATES, BILLING_TERMS } from '../../../constants';
import { InfoTable, Data } from '../../ComponentsLibrary/InfoTable';
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
  [{ label: 'Personal Details', headline: true }],
  [
    { label: 'Contract Number', name: 'number', required: true },
    // { label: 'Last Name', name: 'lastname', required: true },
    // { label: 'Business Name', name: 'businessname', multiline: true },
  ],
  // [{ label: 'Contact Details', headline: true }],
  // [
  //   { label: 'Primary Phone', name: 'phone' },
  //   { label: 'Alternate Phone', name: 'altphone' },
  //   { label: 'Cell Phone', name: 'cellphone' },
  // ],
  // [
  //   { label: 'Email', name: 'email', required: true },

  //   {
  //     label: 'Alternate Email(s)',
  //     name: 'altEmail',
  //     helperText: 'Separate multiple email addresses w/comma',
  //   },
  //   {
  //     label: 'Wishes to receive promotional emails',
  //     name: 'receiveemail',
  //     type: 'checkbox',
  //   },
  // ],
  // [{ label: 'Address Details', headline: true }],
  // [
  //   { label: 'Bulling Address', name: 'address', multiline: true },
  //   { label: 'Billing City', name: 'city' },
  //   { label: 'Billing State', name: 'state', options: USA_STATES },
  //   { label: 'Billing Zip Code', name: 'zip' },
  // ],
  // [{ label: 'Billing Details', headline: true }],
  // [
  //   { label: 'Billing Terms', name: 'billingTerms', options: BILLING_TERMS },
  //   {
  //     label: 'Discount',
  //     name: 'discount',
  //     required: true,
  //     type: 'number',
  //     endAdornment: '%',
  //   },
  //   {
  //     label: 'Rebate',
  //     name: 'rebate',
  //     required: true,
  //     type: 'number',
  //     endAdornment: '%',
  //   },
  // ],
  // [{ label: 'Notes', headline: true }],
  // [
  //   {
  //     label: 'Customer notes',
  //     name: 'notes',
  //     helperText: 'Visible to customer',
  //     multiline: true,
  //   },
  //   {
  //     label: 'Internal Notes',
  //     name: 'intNotes',
  //     helperText: 'NOT visible to customer',
  //     multiline: true,
  //   },
  // ],
  // {label:'Who recommended us?', name:''}, // TODO
  // [{ label: 'Login details', headline: true }],
  // [
  //   {
  //     label: 'Login',
  //     name: 'login',
  //     required: true,
  //     helperText:
  //       'NOTE: If they have an email address, their login ID will automatically be their email address.',
  //   },
  //   { label: 'Password', name: 'pwd', type: 'password' },
  // ],
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
}

export const ContractInfo: FC<Props> = props => {
  const { userID, children } = props;
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
      // setSaving(true);
      // const entry = new User();
      // entry.setId(userID);
      // const fieldMaskList = [];
      // for (const fieldName in data) {
      //   const { upperCaseProp, methodName } = getRPCFields(fieldName);
      //   // @ts-ignore
      //   entry[methodName](data[fieldName]);
      //   fieldMaskList.push(upperCaseProp);
      // }
      // entry.setFieldMaskList(fieldMaskList);
      // const customer = await UserClientService.Update(entry);
      // setCustomer(customer);
      // setSaving(false);
      // setEditing(false);
    },
    [setSaving, userID, setEntry, setEditing],
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
            <InfoTable data={data} loading={loading} error={error} />
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
          title="Edit Customer Information"
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
