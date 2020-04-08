import React, { FC, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { StoredQuote } from '@kalos-core/kalos-rpc/StoredQuote';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { Field, Value } from '../../ComponentsLibrary/Field';
import { InfoTable, Columns, Data } from '../../ComponentsLibrary/InfoTable';
import { Form, Options } from '../../ComponentsLibrary/Form';
import { Modal } from '../../ComponentsLibrary/Modal';
import { StoredQuotes } from '../../ComponentsLibrary/StoredQuotes';
import { EventType } from './ServiceCallDetails';
import { loadStoredQuotes } from '../../../helpers';

interface Props {
  serviceItem: EventType;
}

type Form = {
  displayName: string;
  quickAdd: string;
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
  [{ label: 'Price', name: 'price', type: 'number', endAdornment: '$' }],
];

const SCHEMA_NOTES: Schema<Notes> = [
  [{ label: 'Notes', name: 'notes', multiline: true }],
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

const useStyles = makeStyles(theme => ({
  info: {
    ...theme.typography.h6,
    margin: theme.spacing(),
    textAlign: 'center',
  },
  checkbox: {
    marginBottom: 0,
  },
}));

export const Proposal: FC<Props> = ({ serviceItem }) => {
  const classes = useStyles();
  const { customer } = serviceItem;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [storedQuotes, setStoredQuotes] = useState<StoredQuote.AsObject[]>([]);
  const [editing, setEditing] = useState<Entry>();
  const [notes, setNotes] = useState<Notes>({ notes: '' });
  const [file, setFile] = useState<File>({
    localCopyName: '',
    fileDescription: `${serviceItem.id}_pending_proposal_${customer?.id || ''}`,
  });
  const [editingNotes, setEditingNotes] = useState<boolean>(false);
  const [quickAddOpen, setQuickAddOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [table, setTable] = useState<Entry[]>([]);
  const customerName = `${customer?.firstname} ${customer?.lastname}`;
  const [form, setForm] = useState<Form>({
    displayName: customerName,
    quickAdd: '',
  });
  const load = useCallback(async () => {
    const storedQuotes = await loadStoredQuotes();
    setStoredQuotes(storedQuotes);
    setLoaded(true);
  }, [setStoredQuotes, setLoaded]);
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);
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
  const handleSetNotes = useCallback(
    (notes: Notes) => {
      setNotes(notes);
      setEditingNotes(false);
    },
    [setNotes, setEditingNotes],
  );
  const handleSetEditingNotes = useCallback(
    (editingNotes: boolean) => () => setEditingNotes(editingNotes),
    [setEditingNotes],
  );
  const handleSendToCustomer = useCallback(() => {
    const data = {
      notes: notes.notes,
      items: table,
      ...file,
      displayName: form.displayName,
    };
    console.log({ data });
  }, [notes, table, file, form]);
  const storedQuotesOptions: Options = storedQuotes.map(
    ({ id, description }) => ({ label: description, value: id }),
  );
  const COLUMNS: Columns = [
    { name: '' },
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
        label: 'Quick Add',
        name: 'quickAdd',
        options: storedQuotesOptions,
        actions: [
          { label: 'Add', variant: 'outlined', size: 'xsmall', compact: true },
        ],
      },
    ],
  ];
  const data: Data = table.map(props => {
    const { id, remember, description, price, predefined } = props;
    return [
      {
        value: predefined ? null : (
          <Field
            className={classes.checkbox}
            name={`remember-${id}`}
            type="checkbox"
            label="Remember This Item"
            value={remember}
            onChange={handleSetRemember(id)}
          />
        ),
      },
      { value: description },
      {
        value: `$ ${price}`,
        actions: [
          <IconButton
            key={0}
            style={{ marginLeft: 4 }}
            size="small"
            onClick={handleAddEntry(props)}
          >
            <EditIcon />
          </IconButton>,
          <IconButton
            key={1}
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
        actions={[
          {
            label: `${notes.notes === '' ? 'Add' : 'Edit'} Job Notes`,
            onClick: handleSetEditingNotes(true),
          },
          { label: 'PDF Preview' },
        ]}
        fixedActions
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
      {editingNotes && (
        <Modal open onClose={handleSetEditingNotes(false)}>
          <Form<Notes>
            title="Job Notes"
            schema={SCHEMA_NOTES}
            onSave={handleSetNotes}
            data={notes}
            onClose={handleSetEditingNotes(false)}
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
          <div className={classes.info}>
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
          {notes.notes !== '' && (
            <InfoTable
              columns={[{ name: 'Notes' }]}
              data={[[{ value: notes.notes }]]}
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
          onSelect={a => console.log(a)}
        />
      )}
    </>
  );
};
