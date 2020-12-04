import React, { FC, useState, useEffect, useCallback } from 'react';
import kebabCase from 'lodash/kebabCase';
import Typography from '@material-ui/core/Typography';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { SectionBar } from '../SectionBar';
import { Tooltip } from '../Tooltip';
import { Modal } from '../Modal';
import { Form, Schema } from '../Form';
import { Option } from '../Field';
import { ConfirmDelete } from '../ConfirmDelete';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Documents } from '../Documents';
import {
  timestamp,
  formatDate,
  makeFakeRows,
  escapeText,
  uploadFileToS3Bucket,
  TaskType,
  SpiffTypeType,
  SpiffToolAdminActionType,
  DocumentType,
  loadSpiffTypes,
  updateSpiffTool,
  createTaskDocument,
  updateDocumentDescription,
  upsertSpiffToolAdminAction,
  deletetSpiffToolAdminAction,
} from '../../../helpers';
import './styles.less';

type DocumentUplodad = {
  filename: '';
  description: '';
};

const STATUSES: Option[] = [
  { label: 'Approved', value: 1, color: '#080' },
  { label: 'Not Approved', value: 2, color: '#D00' },
  { label: 'Revoked', value: 3, color: '#CCC' },
];

const STATUS_TXT: {
  [key: number]: { label: string; color: string };
} = STATUSES.reduce(
  (aggr, { label, value, color }) => ({ ...aggr, [value]: { label, color } }),
  {},
);

const STATUSES_COLUMNS: Columns = [
  { name: 'Date' },
  { name: 'Reviewed By' },
  { name: 'Status' },
  { name: 'Reason' },
  { name: '' },
];

const SCHEMA_DOCUMENT_EDIT: Schema<DocumentType> = [
  [
    {
      name: 'filename',
      label: 'File',
      readOnly: true,
    },
  ],
  [
    {
      name: 'description',
      label: 'Title/Description',
      helperText: 'Keep as short/descriptive as possible',
    },
  ],
];

const SCHEMA_STATUS: Schema<SpiffToolAdminActionType> = [
  [
    {
      name: 'decisionDate',
      label: 'Decision Date',
      required: true,
      type: 'date',
    },
  ],
  [{ name: 'reviewedBy', label: 'Reviewed By', required: true }],
  [{ name: 'status', label: 'Status', options: STATUSES }],
  [{ name: 'reason', label: 'Reason', multiline: true }],
];

interface Props {
  type: 'Spiff' | 'Tool';
  loggedUserId: number;
  onClose: () => void;
  onSave: () => void;
  onStatusChange: () => void;
  data: TaskType;
  loading: boolean;
  cancelLabel?: string;
  statusEditing?: SpiffToolAdminActionType;
}

export const SpiffStatus: FC<{ status: number }> = ({ status }) => (
  <div className="SpiffToolLogEditStatus">
    <div
      className="SpiffToolLogEditStatusColor"
      style={{ backgroundColor: STATUS_TXT[status].color }}
    />
    {STATUS_TXT[status].label}
  </div>
);

export const SpiffActionsList: FC<{
  actionsList: SpiffToolAdminActionType[];
}> = ({ actionsList }) => {
  if (actionsList.length === 0) return null;
  const { status, reason, reviewedBy } = actionsList[0];
  return (
    <Tooltip
      content={
        <>
          <strong>Status:</strong> {STATUS_TXT[status].label} <br />
          <strong>Reviewed By:</strong> {reviewedBy} <br />
          <strong>Reason:</strong> {reason}
        </>
      }
    >
      <div>
        <SpiffStatus status={status} />
      </div>
    </Tooltip>
  );
};

export const getStatusFormInit = (status: number, reviewedBy?: string) => {
  const entry = new SpiffToolAdminAction();
  entry.setDecisionDate(timestamp(true));
  entry.setStatus(status);
  if (reviewedBy) {
    entry.setReviewedBy(reviewedBy);
  }
  return entry.toObject();
};

export const SpiffToolLogEdit: FC<Props> = ({
  type,
  loggedUserId,
  data,
  onClose,
  onSave,
  onStatusChange,
  loading: loadingInitial,
  cancelLabel = 'Cancel',
  statusEditing: statusEditingInitial,
}) => {
  const [loading, setLoading] = useState<boolean>(loadingInitial);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [spiffTypes, setSpiffTypes] = useState<SpiffTypeType[]>([]);
  const [statusEditing, setStatusEditing] = useState<
    SpiffToolAdminActionType | undefined
  >(statusEditingInitial);
  const [
    statusDeleting,
    setStatusDeleting,
  ] = useState<SpiffToolAdminActionType>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<string>('');
  const [documentSaving, setDocumentSaving] = useState<boolean>(false);
  const load = useCallback(async () => {
    setLoading(true);
    if (type === 'Spiff' && spiffTypes.length === 0) {
      const spiffTypes = await loadSpiffTypes();
      setSpiffTypes(spiffTypes);
    }
    setLoading(false);
  }, [setLoading, type, setSpiffTypes, spiffTypes]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded]);
  const getStatusFormInit = () => {
    const entry = new SpiffToolAdminAction();
    entry.setDecisionDate(timestamp(true));
    entry.setStatus(+STATUSES[0].value);
    return entry.toObject();
  };
  const handleSetStatusEditing = useCallback(
    (statusEditing?: SpiffToolAdminActionType) => () =>
      setStatusEditing(statusEditing),
    [setStatusEditing],
  );
  const handleSetStatusDeleting = useCallback(
    (statusDeleting?: SpiffToolAdminActionType) => () =>
      setStatusDeleting(statusDeleting),
    [setStatusDeleting],
  );
  const handleFileLoad = useCallback(file => setDocumentFile(file), [
    setDocumentFile,
  ]);
  const handleDocumentUpload = useCallback(
    (onClose, onReload) => async ({
      filename,
      description,
    }: DocumentUplodad) => {
      setUploadFailed(false);
      setUploading(true);
      const ext = filename.split('.').pop();
      const fileName =
        kebabCase(
          [
            data.id,
            data.referenceNumber,
            timestamp(true).split('-').reverse(),
            description.trim() || filename.replace('.' + ext, ''),
          ].join(' '),
        ) +
        '.' +
        ext;
      const status = await uploadFileToS3Bucket(
        fileName,
        documentFile,
        'testbuckethelios', // FIXME is it correct bucket name for those docs?
      );
      if (status === 'ok') {
        await createTaskDocument(fileName, data.id, loggedUserId, description);
        onClose();
        onReload();
        setUploading(false);
      } else {
        setUploadFailed(true);
        setUploading(false);
      }
    },
    [documentFile, loggedUserId, data, setUploadFailed, setUploading],
  );
  const handleDocumentUpdate = useCallback(
    (onClose, onReload, { id }) => async (form: DocumentType) => {
      setDocumentSaving(true);
      const { description } = form;
      await updateDocumentDescription(id, description);
      setDocumentSaving(false);
      onClose();
      onReload();
    },
    [setDocumentSaving],
  );
  const handleSave = useCallback(
    async (form: TaskType) => {
      setSaving(true);
      await updateSpiffTool({ ...form, id: data.id });
      setSaving(false);
      onSave();
    },
    [data, setSaving, onSave],
  );
  const handleSaveStatus = useCallback(
    async (form: SpiffToolAdminActionType) => {
      if (statusEditing) {
        setStatusEditing(undefined);
        await upsertSpiffToolAdminAction({
          ...form,
          id: statusEditing.id,
          taskId: data.id,
        });
        onStatusChange();
      }
    },
    [data, setStatusEditing, statusEditing, load, onStatusChange],
  );
  const handleDeleteStatus = useCallback(async () => {
    if (statusDeleting) {
      setStatusDeleting(undefined);
      await deletetSpiffToolAdminAction(statusDeleting.id);
      onStatusChange();
    }
  }, [statusDeleting, setStatusDeleting, onStatusChange]);
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(
    ({ type, id: value }) => ({ label: escapeText(type), value }),
  );
  const SCHEMA_DOCUMENT: Schema<DocumentUplodad> = [
    [
      {
        name: 'filename',
        label: 'File',
        type: 'file',
        required: true,
        onFileLoad: handleFileLoad,
      },
    ],
    [
      {
        name: 'description',
        label: 'Title/Description',
        helperText: 'Keep as short/descriptive as possible',
      },
    ],
  ];
  const SCHEMA_EXTENDED: Schema<TaskType> =
    type === 'Spiff'
      ? [
          [
            { name: 'spiffToolId', label: 'Spiff ID #', readOnly: true },
            { name: 'referenceUrl', label: 'External URL' },
            { name: 'referenceNumber', label: 'Reference #' },
            {
              name: 'timeDue',
              label: 'Time due',
              readOnly: true,
              type: 'date',
            },
          ],
          [
            {
              name: 'spiffAmount',
              label: 'Amount',
              startAdornment: '$',
              type: 'number',
              required: true,
            },
            { name: 'spiffJobNumber', label: 'Job #' },
            {
              name: 'datePerformed',
              label: 'Date Performed',
              type: 'date',
              required: true,
            },
            { name: 'spiffAddress', label: 'Address', multiline: true },
          ],
          [
            {
              name: 'spiffTypeId',
              label: 'Spiff Type',
              options: SPIFF_TYPES_OPTIONS,
              required: true,
            },
            { name: 'briefDescription', label: 'Description', multiline: true },
          ],
        ]
      : [
          [
            { name: 'spiffToolId', label: 'Tool ID #', readOnly: true },
            { name: 'referenceNumber', label: 'Reference #' },
            {
              name: 'toolpurchaseCost',
              label: 'Tool Cost',
              startAdornment: '$',
              type: 'number',
              required: true,
            },
            {
              name: 'toolpurchaseDate',
              label: 'Purchase Date',
              type: 'date',
              required: true,
            },
          ],
          [{ name: 'briefDescription', label: 'Description', multiline: true }],
        ];
  const statusesData: Data = loadingInitial
    ? makeFakeRows(5, 3)
    : data.actionsList.map(entry => {
        const { decisionDate, reviewedBy, status, reason } = entry;
        return [
          {
            value: formatDate(decisionDate),
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: reviewedBy,
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: <SpiffStatus status={status} />,
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: reason,
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: '',
            onClick: handleSetStatusEditing(entry),
            actions: [
              <IconButton
                key={0}
                size="small"
                onClick={handleSetStatusEditing(entry)}
                disabled={saving}
              >
                <EditIcon />
              </IconButton>,
              <IconButton
                key={1}
                size="small"
                onClick={handleSetStatusDeleting(entry)}
                disabled={saving}
              >
                <DeleteIcon />
              </IconButton>,
            ],
          },
        ];
      });
  return (
    <>
      <Form<TaskType>
        title={`${type === 'Spiff' ? 'Spiff' : 'Tool Purchase'} Request`}
        schema={SCHEMA_EXTENDED}
        onClose={onClose}
        data={data}
        onSave={handleSave}
        disabled={saving || loading}
        cancelLabel={cancelLabel}
      />
      <SectionBar
        title="Status"
        actions={[
          {
            label: 'Add',
            onClick: handleSetStatusEditing(getStatusFormInit()),
            disabled: saving,
          },
        ]}
        fixedActions
      />
      <InfoTable
        columns={STATUSES_COLUMNS}
        data={statusesData}
        loading={loadingInitial}
      />
      <Documents
        title="Documents"
        taskId={data.id}
        withDateCreated
        renderAdding={(onClose, onReload) => (
          <Form<DocumentUplodad>
            title="Add Document"
            onClose={onClose}
            onSave={handleDocumentUpload(onClose, onReload)}
            data={{
              filename: '',
              description: '',
            }}
            schema={SCHEMA_DOCUMENT}
            error={
              uploadFailed ? (
                <div>
                  There was an error during file upload.
                  <br />
                  Please try again later or contact administrator.
                </div>
              ) : undefined
            }
            disabled={uploading}
          >
            {uploading && (
              <Typography className="SpiffToolLogEditUploading">
                Please wait, file is uploading...
              </Typography>
            )}
          </Form>
        )}
        renderEditing={(onClose, onReload, document) => (
          <Form<DocumentType>
            title="Edit Document"
            data={document}
            schema={SCHEMA_DOCUMENT_EDIT}
            onClose={onClose}
            onSave={handleDocumentUpdate(onClose, onReload, document)}
            disabled={documentSaving}
          />
        )}
      />
      {statusEditing && (
        <Modal open onClose={handleSetStatusEditing()}>
          <Form<SpiffToolAdminActionType>
            title={`${statusEditing.id ? 'Edit' : 'Add'} Status`}
            schema={SCHEMA_STATUS}
            data={statusEditing}
            onSave={handleSaveStatus}
            onClose={handleSetStatusEditing()}
          />
        </Modal>
      )}
      {statusDeleting && (
        <ConfirmDelete
          open
          kind="Status reviewed by"
          name={statusDeleting.reviewedBy}
          onClose={handleSetStatusDeleting()}
          onConfirm={handleDeleteStatus}
        />
      )}
    </>
  );
};
