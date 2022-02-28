import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { SectionBar } from '../SectionBar';
import { InfoTable, Data } from '../InfoTable';
import { ConfirmDelete } from '../ConfirmDelete';
import {
  StoredQuoteClient,
  StoredQuote,
} from '@kalos-core/kalos-rpc/StoredQuote';
import { makeFakeRows, makeSafeFormObject, usd } from '../../../helpers';
import { ENDPOINT } from '../../../constants';

const StoredQuoteClientService = new StoredQuoteClient(ENDPOINT);

interface Props {
  label?: string;
  open: boolean;
  onClose: () => void;
  onSelect: (storedQuote: StoredQuote) => void;
}

const SCHEMA: Schema<StoredQuote> = [
  [
    {
      label: 'Description',
      name: 'getDescription',
      multiline: true,
      required: true,
    },
  ],
  [
    {
      label: 'Price',
      name: 'getPrice',
      type: 'number',
      startAdornment: '$',
      required: true,
    },
  ],
  [{ name: 'getId', type: 'hidden' }],
];

export const StoredQuotes: FC<Props> = ({
  label = 'Quick Add',
  open,
  onClose,
  onSelect,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [storedQuotes, setStoredQuotes] = useState<StoredQuote[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [editing, setEditing] = useState<StoredQuote>();
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<StoredQuote>();
  const toggleEdit = useCallback(() => () => setEdit(!edit), [edit, setEdit]);
  const handleClose = useCallback(() => {
    setEdit(false);
    onClose();
  }, [setEdit, onClose]);
  const handleSetEditing = useCallback(
    (editing?: StoredQuote) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: StoredQuote) => () => setDeleting(deleting),
    [setDeleting],
  );
  const load = useCallback(async () => {
    setLoaded(false);
    const storedQuotes = await StoredQuoteClientService.loadStoredQuotes();
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
      handleClose();
    },
    [onSelect, handleClose],
  );
  const handleSave = useCallback(
    async (quote: StoredQuote) => {
      setSaving(true);
      const safeQuote = makeSafeFormObject(quote, new StoredQuote());
      const isNew = safeQuote.getId().toString() === '';
      const req = new StoredQuote();
      console.log('safe data', safeQuote);
      if (!isNew) {
        req.setId(safeQuote.getId());
      }
      req.setDescription(safeQuote.getDescription());
      req.setPrice(safeQuote.getPrice());
      let safeDescription = req.getDescription();

      safeDescription = safeDescription.replace(/\\/g, '');
      safeDescription = safeDescription.replace("'", '');
      safeDescription = safeDescription.replace(',', '');
      req.setDescription(safeDescription);
      req.setFieldMaskList(['Description', 'Price']);
      if (isNew) {
        console.log('create quote');
        await StoredQuoteClientService.Create(req);
      } else {
        console.log('update quote');
        StoredQuoteClientService.Update(req);
      }
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
      req.setId(deleting.getId());
      await StoredQuoteClientService.Delete(req);
      await load();
    }
  }, [deleting, load]);
  const data: Data = loaded
    ? storedQuotes.map(storedQuote => {
        const price = (
          <span key={0} className="StoredQuotesPrice">
            {usd(storedQuote.getPrice())}
          </span>
        );
        return [
          {
            value: storedQuote.getDescription(),
            onClick: edit ? undefined : handleSelect(storedQuote),
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
      {open && (
        <Modal open onClose={handleClose} fullScreen>
          <SectionBar
            title={label}
            actions={[
              {
                label: 'Create',
                onClick: handleSetEditing(new StoredQuote()),
                variant: 'outlined',
              },
              { label: 'Edit', onClick: toggleEdit(), variant: 'outlined' },
              { label: 'Close', onClick: handleClose },
            ]}
            fixedActions
          />
          <InfoTable data={data} loading={!loaded} />
        </Modal>
      )}
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form
            title={`${editing.getId() === 0 ? 'Create' : 'Edit'} Quick Add`}
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
          name={deleting.getDescription()}
          onClose={handleSetDeleting()}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
