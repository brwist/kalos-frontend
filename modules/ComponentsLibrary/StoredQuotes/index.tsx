import React, { FC, useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  StoredQuoteClient,
  StoredQuote,
} from '@kalos-core/kalos-rpc/StoredQuote';
import { loadStoredQuotes, makeFakeRows } from '../../../helpers';
import { ENDPOINT } from '../../../constants';

const StoredQuoteClientService = new StoredQuoteClient(ENDPOINT);

type StoredQuoteType = StoredQuote.AsObject;

interface Props {
  label?: string;
  onSelect: (storedQuote: StoredQuoteType) => void;
}

const useStyles = makeStyles(theme => ({
  price: {
    paddingLeft: theme.spacing(),
  },
}));

const SCHEMA: Schema<StoredQuoteType> = [
  [
    {
      label: 'Description',
      name: 'description',
      multiline: true,
      required: true,
    },
  ],
  [
    {
      label: 'Price',
      name: 'price',
      type: 'number',
      startAdornment: '$',
      required: true,
    },
  ],
  [{ name: 'id', type: 'hidden' }],
];

export const StoredQuotes: FC<Props> = ({ label = 'Quick Add', onSelect }) => {
  const classes = useStyles();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [storedQuotes, setStoredQuotes] = useState<StoredQuoteType[]>([]);
  const [opened, setOpened] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [editing, setEditing] = useState<StoredQuoteType>();
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<StoredQuoteType>();
  const toggleOpen = useCallback((opened: boolean) => () => setOpened(opened), [
    setOpened,
  ]);
  const toggleEdit = useCallback(() => () => setEdit(!edit), [edit, setEdit]);
  const handleSetEditing = useCallback(
    (editing?: StoredQuoteType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: StoredQuoteType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const load = useCallback(async () => {
    setLoaded(false);
    const storedQuotes = await loadStoredQuotes();
    setStoredQuotes(storedQuotes);
    setLoaded(true);
  }, [setStoredQuotes, setLoaded]);
  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded, load]);
  const handleSelect = useCallback(
    storedQuote => () => {
      onSelect(storedQuote);
      setOpened(false);
    },
    [onSelect, setOpened],
  );
  const handleSave = useCallback(
    async ({ id, description, price }: StoredQuoteType) => {
      setSaving(true);
      const isNew = id === 0;
      const req = new StoredQuote();
      if (!isNew) {
        req.setId(id);
      }
      req.setDescription(description);
      req.setPrice(price);
      req.setFieldMaskList(['Description', 'Price']);
      await StoredQuoteClientService[isNew ? 'Create' : 'Update'](req);
      await load();
      setSaving(false);
      setEditing(undefined);
    },
    [setSaving, setEditing, load],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      setDeleting(undefined);
      const req = new StoredQuote();
      req.setId(deleting.id);
      await StoredQuoteClientService.Delete(req);
      await load();
    }
  }, [setDeleting, deleting]);
  const data: Data = loaded
    ? storedQuotes.map(storedQuote => {
        const price = (
          <span key={0} className={classes.price}>
            ${storedQuote.price}
          </span>
        );
        return [
          {
            value: storedQuote.description,
            onClick: handleSelect(storedQuote),
            actions: edit
              ? [
                  price,
                  <IconButton
                    key={1}
                    size="small"
                    onClick={handleSetEditing(storedQuote)}
                  >
                    <EditIcon />
                  </IconButton>,
                  <IconButton
                    key={2}
                    size="small"
                    onClick={handleSetDeleting(storedQuote)}
                  >
                    <DeleteIcon />
                  </IconButton>,
                ]
              : [price],
          },
        ];
      })
    : makeFakeRows();
  return (
    <>
      <Button label={label} onClick={toggleOpen(true)} />
      {opened && (
        <Modal open onClose={toggleOpen(false)} fullScreen>
          <SectionBar
            title={label}
            actions={[
              {
                label: 'Create',
                onClick: handleSetEditing(new StoredQuote().toObject()),
                variant: 'outlined',
              },
              { label: 'Edit', onClick: toggleEdit(), variant: 'outlined' },
              { label: 'Close', onClick: toggleOpen(false) },
            ]}
            fixedActions
          />
          <InfoTable data={data} loading={!loaded} />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form
            title={`${editing.id === 0 ? 'Create' : 'Edit'} Quick Add`}
            data={editing}
            onClose={handleSetEditing()}
            onSave={handleSave}
            schema={SCHEMA}
            disabled={saving}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open
          kind="Quick Add"
          name={deleting.description}
          onClose={handleSetDeleting()}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
