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
import { DocumentKeyList } from '@kalos-core/kalos-rpc/InternalDocument';
import {
  makeFakeRows,
  InternalDocumentClientService,
  makeSafeFormObject,
} from '../../../helpers';
import { Tooltip } from '@material-ui/core';

const COLUMNS: Columns = [{ name: 'Name' }, { name: 'Tag Color' }];

const SCHEMA: Schema<DocumentKey> = [
  [
    {
      name: 'getName',
      label: 'Name',
      required: true,
    },
  ],
  [
    {
      name: 'getColor',
      label: 'Tag Color',
      required: true,
      type: 'color',
    },
  ],
];

const makeNewDocumentKey = () => {
  const entry = new DocumentKey();
  entry.setColor('#FF0000');
  return entry;
};

interface Props {
  onClose?: () => void;
  fileTags?: DocumentKey[];
  onFileTagsChange?: (fileTags: DocumentKey[]) => void;
}

export const FileTags: FC<Props> = ({
  onClose,
  fileTags,
  onFileTagsChange,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [entries, setEntries] = useState<DocumentKey[]>(fileTags || []);
  const [pendingDelete, setPendingDelete] = useState<DocumentKey>();
  const [pendingEdit, setPendingEdit] = useState<DocumentKey>();
  const load = useCallback(async () => {
    setLoading(true);
    const entries = await InternalDocumentClientService.loadDocumentKeys();
    setEntries(entries);
    setLoading(false);
    return entries;
  }, [setLoading, setEntries]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      if (!fileTags) {
        load();
      }
    }
  }, [loaded, load, setLoaded, fileTags]);
  const handlePendingDelete = useCallback(
    (pendingDelete?: DocumentKey) => () => setPendingDelete(pendingDelete),
    [setPendingDelete],
  );
  const handlePendingEdit = useCallback(
    (pendingEdit?: DocumentKey) => () => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const handleSave = useCallback(
    async (data: DocumentKey) => {
      if (pendingEdit) {
        const saveData = makeSafeFormObject(data, new DocumentKey())
        setSaving(true);
        const id = pendingEdit.getId();
        if (saveData.getFieldMaskList().length > 0) {
          await InternalDocumentClientService.saveDocumentKey(saveData, id);
        }
        setPendingEdit(undefined);
        setLoading(true);
        setSaving(false);
        const fileTags = await load();
        if (onFileTagsChange) {
          onFileTagsChange(fileTags);
        }
      }
    },
    [
      pendingEdit,
      setPendingEdit,
      setLoading,
      setSaving,
      load,
      onFileTagsChange,
    ],
  );
  const handleDelete = useCallback(async () => {
    if (pendingDelete) {
      const id = pendingDelete.getId();
      setPendingDelete(undefined);
      setLoading(true);
      await InternalDocumentClientService.deleteDocumentKeyById(id);
      const fileTags = await load();
      if (onFileTagsChange) {
        onFileTagsChange(fileTags);
      }
    }
  }, [pendingDelete, setPendingDelete, setLoading, load, onFileTagsChange]);
  const data: Data = loading
    ? makeFakeRows(2, 5)
    : entries.map(entry => {
        const name = entry.getName();
        const color = entry.getColor();
        return [
          {
            value: name,
            onClick: handlePendingEdit(entry),
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
            onClick: handlePendingEdit(entry),
            actions: [
              <Tooltip key="edit" title="Edit">
                <IconButton
                  size="small"
                  onClick={handlePendingEdit(entry)}
                  >
                  <EditIcon />
                </IconButton>
              </Tooltip>,
              <Tooltip key="delete" title="Delete">
                <IconButton
                  size="small"
                  onClick={handlePendingDelete(entry)}
                  >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>,
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
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
        fixedActions
      />
      <InfoTable data={data} columns={COLUMNS} loading={loading} />
      {pendingDelete && (
        <ConfirmDelete
          open
          kind="File Tag"
          name={pendingDelete.getName()}
          onClose={handlePendingDelete(undefined)}
          onConfirm={handleDelete}
        />
      )}
      {pendingEdit && (
        <Modal open onClose={handlePendingEdit(undefined)}>
          <Form<DocumentKey>
            schema={SCHEMA}
            title={`${pendingEdit.getId() ? 'Edit' : 'Add'} File Tag`}
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
