import React, { FC, useState, useCallback } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { StoredQuote } from '@kalos-core/kalos-rpc/StoredQuote';
import { SectionBar } from '../../SectionBar';
import { PlainForm, Schema } from '../../PlainForm';
import { Field, Value } from '../../Field';
import { InfoTable, Columns, Data } from '../../InfoTable';
import { Form } from '../../Form';
import { Modal } from '../../Modal';
import { StoredQuotes } from '../../StoredQuotes';
import { EventType } from '../';
import { ProposalPrint } from './ProposalPrint';
import { UserType, PropertyType } from '../../../../helpers';
import './proposal.less';

interface Props {
  serviceItem: EventType;
  property: PropertyType;
  customer: UserType;
}

type Form = {
  displayName: string;
  withJobNotes: number;
  notes: string;
};

type Entry = {
  id: number;
  remember: number;
  description: string;
  price: number;
  predefined: boolean;
};

type Notes = {
  notes: string;
};

type File = {
  localCopyName: string;
  fileDescription: string;
};

const SCHEMA_ENTRY: Schema<Entry> = [
  [
    { name: 'id', type: 'hidden' },
    { name: 'remember', type: 'hidden' },
    { name: 'predefined', type: 'hidden' },
  ],
  [{ label: 'Description', name: 'description', multiline: true }],
  [{ label: 'Price', name: 'price', type: 'number', startAdornment: '$' }],
];
const SCHEMA_FILE: Schema<File> = [
  [{ label: 'File', headline: true }],
  [
    {
      label: 'Name your local copy',
      name: 'localCopyName',
      helperText:
        'If you do not specify a name, no local copy will be created.',
    },
    {
      label: 'Enter a description',
      name: 'fileDescription',
      helperText:
        'This will be the display name for the file. You can leave this blank.',
    },
  ],
];

export const Proposal: FC<Props> = ({ serviceItem, customer, property }) => {
  const { notes, logJobNumber } = serviceItem;
  const [editing, setEditing] = useState<Entry>();
  const [file, setFile] = useState<File>({
    localCopyName: '',
    fileDescription: `${serviceItem.id}_pending_proposal_${customer?.id || ''}`,
  });
  const [quickAddOpen, setQuickAddOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [table, setTable] = useState<Entry[]>([]);
  const customerName = `${customer?.firstname} ${customer?.lastname}`;
  const [form, setForm] = useState<Form>({
    displayName: customerName,
    withJobNotes: 0,
    notes,
  });
  const handleToggleQuickAdd = useCallback(
    () => setQuickAddOpen(!quickAddOpen),
    [quickAddOpen, setQuickAddOpen],
  );
  const handleAddEntry = useCallback(
    (entry?: Entry) => () => {
      setEditing(entry);
    },
    [setEditing],
  );
  const handleDeleteEntry = useCallback(
    (id: number) => () => setTable(table.filter(item => item.id !== id)),
    [table, setTable],
  );
  const handleSaveEntry = useCallback(
    (entry: Entry) => {
      setTable(
        table.map(({ id }) => id).includes(entry.id)
          ? table.map(item => (item.id === entry.id ? entry : item))
          : [...table, entry],
      );
      setEditing(undefined);
    },
    [setTable, setEditing, table],
  );
  const handleQuickAdd = useCallback(
    (entry: StoredQuote.AsObject) => {
      handleSaveEntry({ ...entry, predefined: true, remember: 0 });
    },
    [handleSaveEntry],
  );
  const handleSetRemember = useCallback(
    (id: number) => (value: Value) => {
      setTable(
        table.map(item =>
          item.id === id
            ? {
                ...item,
                remember: +value,
              }
            : item,
        ),
      );
    },
    [table, setTable],
  );
  const handleSetPreview = useCallback(
    (preview: boolean) => () => setPreview(preview),
    [setPreview],
  );
  const handleSendToCustomer = useCallback(() => {
    const data = {
      items: table,
      ...file,
      ...form,
    };
    console.log({ data });
  }, [table, file, form]);
  const COLUMNS: Columns = [
    { name: 'Description' },
    {
      name: 'Price',
      actions: [
        {
          label: 'Quick Add',
          compact: true,
          onClick: handleToggleQuickAdd,
        },
        {
          label: 'Add',
          compact: true,
          onClick: handleAddEntry({
            id: Math.max(-1, ...table.map(({ id }) => id)) + 1,
            remember: 0,
            predefined: false,
            description: '',
            price: 0,
          }),
        },
      ],
      fixedActions: true,
    },
  ];
  const SCHEMA: Schema<Form> = [
    [
      {
        label: 'Display Name',
        name: 'displayName',
        options: [customerName, customer?.businessname || ''],
      },
      {
        name: 'withJobNotes',
        label: 'With Job Notes',
        type: 'checkbox',
      },
      {
        label: 'Job Notes',
        name: 'notes',
        multiline: true,
        disabled: !form.withJobNotes,
      },
    ],
  ];
  const data: Data = table.map(props => {
    const { id, remember, description, price, predefined } = props;
    return [
      { value: description },
      {
        value: `$ ${price}`,
        actions: [
          ...(predefined
            ? []
            : [
                <Field
                  key={0}
                  className="ProposalCheckbox"
                  name={`remember-${id}`}
                  type="checkbox"
                  label="Remember This Item"
                  value={remember}
                  onChange={handleSetRemember(id)}
                />,
              ]),
          <IconButton
            key={1}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleAddEntry(props)}
          >
            <EditIcon />
          </IconButton>,
          <IconButton
            key={2}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleDeleteEntry(id)}
          >
            <DeleteIcon />
          </IconButton>,
        ],
      },
    ];
  });
  const dataPreview: Data = table.map(({ description, price }) => [
    { value: description },
    { value: `$ ${price}` },
  ]);
  return (
    <>
      <SectionBar
        asideContent={
          <ProposalPrint
            displayName={form.displayName}
            logJobNumber={logJobNumber}
            property={property}
            notes={form.withJobNotes ? form.notes : undefined}
            entries={table.map(({ description, price }) => ({
              description,
              price,
            }))}
          />
        }
      />
      <PlainForm schema={SCHEMA} data={form} onChange={setForm} />
      <InfoTable columns={COLUMNS} data={data} />
      <SectionBar
        actions={[
          {
            label: 'Submit And Send To Customer',
            onClick: handleSetPreview(true),
          },
        ]}
        fixedActions
      />
      {editing && (
        <Modal open onClose={handleAddEntry()}>
          <Form<Entry>
            title="Edit"
            schema={SCHEMA_ENTRY}
            onSave={handleSaveEntry}
            data={editing}
            onClose={handleAddEntry()}
            submitLabel="Done"
          />
        </Modal>
      )}
      {preview && (
        <Modal open onClose={handleSetPreview(false)}>
          <SectionBar
            title="Please Review Your Proposal Carefully"
            actions={[
              { label: 'Send To Customer', onClick: handleSendToCustomer },
              {
                label: 'Cancel',
                onClick: handleSetPreview(false),
                variant: 'outlined',
              },
            ]}
          />
          <div className="ProposalInfo">
            Submitting this proposal will send it to the customer.
            <br />
            Only send the proposal if you are certain it is correct.
            <br />
            If you need to make changes, click cancel to go back.
          </div>
          <InfoTable
            columns={[{ name: 'Display Name' }]}
            data={[[{ value: form.displayName }]]}
          />
          {form.notes !== '' && (
            <InfoTable
              columns={[{ name: 'Notes' }]}
              data={[[{ value: form.notes }]]}
            />
          )}
          <InfoTable
            columns={[{ name: 'Description' }, { name: 'Price' }]}
            data={dataPreview}
          />
          <PlainForm schema={SCHEMA_FILE} data={file} onChange={setFile} />
        </Modal>
      )}
      {quickAddOpen && (
        <StoredQuotes
          open
          onClose={handleToggleQuickAdd}
          onSelect={handleQuickAdd}
        />
      )}
    </>
  );
};
