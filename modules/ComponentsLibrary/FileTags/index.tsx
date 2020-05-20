import React, { FC, useState, useEffect, useCallback } from 'react';
import { DocumentKey } from '@kalos-core/kalos-rpc/compiled-protos/internal_document_pb';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { InfoTable, Columns, Data } from '../InfoTable';
import { SectionBar } from '../SectionBar';
import { Form, Schema } from '../Form';
import {
  DocumentKeyType,
  loadDocumentKeys,
  makeFakeRows,
  saveDocumentKey,
  deleteDocumentKey,
} from '../../../helpers';

const COLUMNS: Columns = [{ name: 'Name' }, { name: 'Tag Color' }];

const SCHEMA: Schema<DocumentKeyType> = [
  [
    {
      name: 'name',
      label: 'Name',
      required: true,
    },
  ],
  [
    {
      name: 'color',
      label: 'Tag Color',
      required: true,
      type: 'color',
    },
  ],
];

const makeNewDocumentKey = () => {
  const entry = new DocumentKey().toObject();
  entry.color = '#FF0000';
  return entry;
};

export const FileTags: FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [entries, setEntries] = useState<DocumentKeyType[]>([]);
  const [pendingDelete, setPendingDelete] = useState<DocumentKeyType>();
  const [pendingEdit, setPendingEdit] = useState<DocumentKeyType>();
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await loadDocumentKeys();
    setEntries(entries);
    setLoading(false);
  }, [setLoading, setEntries]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, load, setLoaded]);
  const handlePendingDelete = useCallback(
    (pendingDelete?: DocumentKeyType) => () => setPendingDelete(pendingDelete),
    [setPendingDelete],
  );
  const handlePendingEdit = useCallback(
    (pendingEdit?: DocumentKeyType) => () => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const handleSave = useCallback(
    async (data: DocumentKeyType) => {
      if (pendingEdit) {
        setSaving(true);
        const { id } = pendingEdit;
        await saveDocumentKey(data, id);
        setPendingEdit(undefined);
        setLoading(true);
        setSaving(false);
        setLoaded(false);
      }
    },
    [pendingEdit, setPendingEdit, setLoading, setLoaded, setSaving],
  );
  const handleDelete = useCallback(async () => {
    if (pendingDelete) {
      const { id } = pendingDelete;
      setPendingDelete(undefined);
      setLoading(true);
      await deleteDocumentKey(id);
      setLoaded(false);
    }
  }, [pendingDelete, setPendingDelete, setLoading]);
  const data: Data = loading
    ? makeFakeRows(2, 5)
    : entries.map(entry => {
        const { name, color } = entry;
        return [
          {
            value: name,
          },
          {
            value: (
              <div
                style={{
                  backgroundColor: color,
                  height: 20,
                  maxWidth: 100,
                }}
              />
            ),
            actions: [
              <IconButton
                key="edit"
                size="small"
                onClick={handlePendingEdit(entry)}
              >
                <EditIcon />
              </IconButton>,
              <IconButton
                key="delete"
                size="small"
                onClick={handlePendingDelete(entry)}
              >
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <div>
      <SectionBar
        title="File Tags"
        actions={[
          {
            label: 'Add File Tag',
            onClick: handlePendingEdit(makeNewDocumentKey()),
          },
        ]}
        fixedActions
      />
      <InfoTable data={data} columns={COLUMNS} loading={loading} />
      {pendingDelete && (
        <ConfirmDelete
          open
          kind="File Tag"
          name={pendingDelete.name}
          onClose={handlePendingDelete(undefined)}
          onConfirm={handleDelete}
        />
      )}
      {pendingEdit && (
        <Modal open onClose={handlePendingEdit(undefined)}>
          <Form<DocumentKeyType>
            schema={SCHEMA}
            title={`${pendingEdit.id ? 'Edit' : 'Add'} File Tag`}
            data={pendingEdit}
            onSave={handleSave}
            onClose={handlePendingEdit(undefined)}
            disabled={saving}
          />
        </Modal>
      )}
    </div>
  );
};
