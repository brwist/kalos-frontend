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
import { EmailClient, SQSEmail } from '@kalos-core/kalos-rpc/Email';
import { User } from '@kalos-core/kalos-rpc/User';
import { Task, TaskClient } from '@kalos-core/kalos-rpc/Task';
import { Document } from '@kalos-core/kalos-rpc/Document';
import { SpiffType } from '@kalos-core/kalos-rpc/Task';
import { ConfirmDelete } from '../ConfirmDelete';
import { InfoTable, Data, Columns } from '../InfoTable';
import { Documents } from '../Documents';
import {
  timestamp,
  formatDate,
  makeFakeRows,
  escapeText,
  uploadFileToS3Bucket,
  TaskClientService,
  DocumentClientService,
  SpiffToolAdminActionClientService,
  UserClientService,
  makeSafeFormObject,
  usd,
} from '../../../helpers';
import './styles.less';
import { stat } from 'fs';
import { userInfo } from 'os';
import { EmailServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/email_pb_service';
import { ENDPOINT } from '@kalos-core/kalos-rpc/constants';
import { useDispatch, useSelector } from 'react-redux';
import { spiffToolType,selectspiffToolTypes } from './spiffToolLogEditSlice';

type DocumentUpload = {
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

const SCHEMA_DOCUMENT_EDIT: Schema<Document> = [
  [
    {
      name: 'getFilename',
      label: 'File',
      readOnly: true,
    },
  ],
  [
    {
      name: 'getDescription',
      label: 'Title/Description',
      helperText: 'Keep as short/descriptive as possible',
    },
  ],
];

const SCHEMA_STATUS: Schema<SpiffToolAdminAction> = [
  [
    {
      name: 'getDecisionDate',
      label: 'Decision Date',
      required: true,
      type: 'date',
    },
  ],
  [
    {
      name: 'getReviewedBy',
      label: 'Reviewed By',
      disabled: true,
    },
  ],
  [{ name: 'getStatus', label: 'Status', options: STATUSES }],
  [{ name: 'getReason', label: 'Reason', multiline: true }],
];

interface Props {
  type: 'Spiff' | 'Tool';
  loggedUserId: number;
  userId?: number;
  onClose: () => void;
  onSave: () => void;
  onStatusChange: () => void;
  data: Task;
  loading: boolean;
  cancelLabel?: string;
  statusEditing?: SpiffToolAdminAction;
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
  actionsList: SpiffToolAdminAction[];
}> = ({ actionsList }) => {
  if (actionsList.length === 0) return null;
  //const { status, reason, reviewedBy } = actionsList[0];
  const status = actionsList[0].getStatus();
  const reason = actionsList[0].getReason();
  const reviewedBy = actionsList[0].getReviewedBy();
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
  return entry;
};

export const SpiffToolLogEdit: FC<Props> = ({
  type,
  loggedUserId,
  userId,
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
  const [spiffTypes, setSpiffTypes] = useState<SpiffType[]>([]);
  const [statusEditing, setStatusEditing] = useState<
    SpiffToolAdminAction | undefined
  >(statusEditingInitial);
  const [statusDeleting, setStatusDeleting] = useState<SpiffToolAdminAction>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<User>(new User());
  const [taskUser, setTaskUser] = useState<User>(new User());
  const [documentFile, setDocumentFile] = useState<string>('');
  const [documentSaving, setDocumentSaving] = useState<boolean>(false);
  const dispatch = useDispatch();
  const load = useCallback(async () => {
    setLoading(true);
    if (type === 'Spiff' && spiffTypes.length === 0) {
      const spiffTypes = await TaskClientService.loadSpiffTypes();
      setSpiffTypes(spiffTypes);
      spiffTypes.map(spiffType => {
        dispatch(spiffToolType({
          label: escapeText(spiffType.getType()),
          value: spiffType.getId(),
        }))
      });
    }
    const userReq = new User();
    userReq.setId(loggedUserId);
    const userInfo = await UserClientService.Get(userReq);
    setLoggedUser(userInfo);
    const taskUserReq = new User();
    taskUserReq.setId(data.getExternalId());
    const taskUserInfo = await UserClientService.Get(taskUserReq);
    setTaskUser(taskUserInfo);

    setLoading(false);
  }, [setLoading, type, loggedUserId, setSpiffTypes, data, spiffTypes]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const getStatusFormInit = () => {
    const entry = new SpiffToolAdminAction();
    entry.setDecisionDate(timestamp(true));
    entry.setStatus(+STATUSES[0].value);
    return entry;
  };
  const handleSetStatusEditing = useCallback(
    (statusEditing?: SpiffToolAdminAction) => () =>
      setStatusEditing(statusEditing),
    [setStatusEditing],
  );
  const handleSetStatusDeleting = useCallback(
    (statusDeleting?: SpiffToolAdminAction) => () =>
      setStatusDeleting(statusDeleting),
    [setStatusDeleting],
  );
  const handleFileLoad = useCallback(file => setDocumentFile(file), [
    setDocumentFile,
  ]);
  const createEmail = useCallback(
    async (data: Task, newAction: SpiffToolAdminAction) => {
      let emailStatus = 'Approved';
      const status = newAction.getStatus();
      if (status === 2) {
        emailStatus = 'Declined';
      }
      if (status === 3) {
        emailStatus = 'Revoked';
      }
      const body = `<body>
      <table style="width:70%;">
        <thead>
          <th style="text-align:left;">Reason: ${newAction.getReason()}</th>
          <th style="text-align:left;">Amount${usd(data.getSpiffAmount())}</th>
        </thead>
        <tbody>
          <tr>
            <td>Spiff Job Number: ${data.getSpiffJobNumber()}</td>
            <td>Updated Spiff Status:${emailStatus}</td>
          </tr>
        </body>
      </table>
    </body>`;
      const email = new SQSEmail();
      email.setBody(body);
      email.setSubject(`Spiff ${data.getSpiffJobNumber()} Update`);
      email.setTo(taskUser.getEmail());
      const emailClient = new EmailClient(ENDPOINT);
      await emailClient.SendSQSMail(email);
    },
    [taskUser],
  );
  const handleDocumentUpload = useCallback(
    (onClose, onReload) => async ({
      filename,
      description,
    }: DocumentUpload) => {
      setUploadFailed(false);
      setUploading(true);
      const ext = filename.split('.').pop();
      const fileName =
        kebabCase(
          [
            data.getId(),
            data.getReferenceNumber(),
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
        await DocumentClientService.createTaskDocument(
          fileName,
          data.getId(),
          loggedUserId,
          description,
        );
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
    (onClose, onReload, { id }) => async (form: Document) => {
      setDocumentSaving(true);
      const description = form.getDescription();
      await DocumentClientService.updateDocumentDescription(id, description);
      setDocumentSaving(false);
      onClose();
      onReload();
    },
    [setDocumentSaving],
  );
  const handleSave = useCallback(
    async (form: Task) => {
      setSaving(true);
      let currentTask = makeSafeFormObject(form, new Task());
      currentTask.setId(data.getId());
      await TaskClientService.updateSpiffTool(currentTask);
      setSaving(false);
      onSave();
    },
    [data, setSaving, onSave],
  );
  const handleSaveStatus = useCallback(
    async (form: SpiffToolAdminAction) => {
      let temp = makeSafeFormObject(form, new SpiffToolAdminAction());
      if (statusEditing) {
        const newReviewedBy =
          loggedUser.getFirstname() + ' ' + loggedUser.getLastname();
        const timestampValue = timestamp().toString();
        let adminActionNew = temp;
        adminActionNew.setReviewedBy(newReviewedBy);
        adminActionNew.setDecisionDate(timestampValue);
        adminActionNew.addFieldMask('DecisionDate');
        adminActionNew.setId(statusEditing.getId());
        console.log('status:', adminActionNew.getStatus());
        adminActionNew.setTaskId(data.getId());

        if (adminActionNew.getStatus() === 0) {
          adminActionNew.setStatus(1);
          //because of the safe form object, we are not getting the default status, so in this instance 0===1
        }
        if (adminActionNew.getStatus() === 1) {
          adminActionNew.setGrantedDate(timestampValue);
          console.log('granted');
          adminActionNew.addFieldMask('GrantedDate');
        }
        if (adminActionNew.getStatus() === 3) {
          console.log('revoked');
          adminActionNew.setRevokedDate(timestampValue);
          adminActionNew.addFieldMask('RevokedDate');
        }
        if (
          adminActionNew.getReason() === null ||
          adminActionNew.getReason() === ''
        ) {
          adminActionNew.setReason('No Reason Given');
        }
        let res = 0;
        if (adminActionNew.getId() == 0) {
          res = (
            await SpiffToolAdminActionClientService.Create(adminActionNew)
          ).getId();
        } else {
          res = (
            await SpiffToolAdminActionClientService.Update(adminActionNew)
          ).getId();
        }
        createEmail(data, adminActionNew);
        const updateTask = new Task();
        const action = new SpiffToolAdminAction();
        action.setTaskId(data.getId());
        action.setCreatedDate(timestampValue);
        action.setReviewedBy(statusEditing.getReviewedBy());
        updateTask.setId(data.getId());
        updateTask.setAdminActionId(res);

        if (statusEditing.getStatus() === 3) {
          //if the Spiff has been revoke, we need payroll to
          //process it again, Cost Summary will treat it as a negative value
          updateTask.setPayrollProcessed(false);
          updateTask.addFieldMask('PayrollProcessed');
        }
        updateTask.setSpiffToolCloseoutDate(timestamp());
        updateTask.addFieldMask('AdminActionId');
        console.log('update task', updateTask);
        await TaskClientService.Update(updateTask);
        setStatusEditing(undefined);
        onStatusChange();
      }
    },
    [statusEditing, loggedUserId, data, onStatusChange, loggedUser],
  );
  const handleDeleteStatus = useCallback(async () => {
    if (statusDeleting) {
      setStatusDeleting(undefined);
      await SpiffToolAdminActionClientService.deletetSpiffToolAdminAction(
        statusDeleting.getId(),
      );
      onStatusChange();
    }
  }, [statusDeleting, setStatusDeleting, onStatusChange]);
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(spiffType => ({
    label: escapeText(spiffType.getType()),
    value: spiffType.getId(),
  }));
  const SCHEMA_DOCUMENT: Schema<DocumentUpload> = [
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
  const SCHEMA_EXTENDED: Schema<Task> =
    type === 'Spiff'
      ? [
          [
            { name: 'getSpiffToolId', label: 'Spiff ID #', readOnly: true },
            { name: 'getReferenceUrl', label: 'External URL' },
            { name: 'getReferenceNumber', label: 'Reference #' },
            {
              name: 'getTimeDue',
              label: 'Time due',
              readOnly: true,
              type: 'date',
            },
          ],
          [
            {
              name: 'getSpiffAmount',
              label: 'Amount',
              startAdornment: '$',
              type: 'number',
              required: true,
            },
            { name: 'getSpiffJobNumber', label: 'Job #' },
            {
              name: 'getDatePerformed',
              label: 'Date Performed',
              type: 'date',
              required: true,
            },
            { name: 'getSpiffAddress', label: 'Address', multiline: true },
          ],
          [
            {
              name: 'getSpiffTypeId',
              label: 'Spiff Type',
              options: SPIFF_TYPES_OPTIONS,
              required: true,
            },
            {
              name: 'getBriefDescription',
              label: 'Description',
              multiline: true,
            },
          ],
        ]
      : [
          [
            { name: 'getSpiffToolId', label: 'Tool ID #', readOnly: true },
            { name: 'getReferenceNumber', label: 'Reference #' },
            {
              name: 'getToolpurchaseCost',
              label: 'Tool Cost',
              startAdornment: '$',
              type: 'number',
              required: true,
            },
            {
              name: 'getToolpurchaseDate',
              label: 'Purchase Date',
              type: 'date',
              required: true,
            },
          ],
          [
            {
              name: 'getBriefDescription',
              label: 'Description',
              multiline: true,
            },
          ],
        ];
  const statusesData: Data = loadingInitial
    ? makeFakeRows(5, 3)
    : data.getActionsList().map(entry => {
        return [
          {
            value: formatDate(entry.getDecisionDate()),
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: entry.getReviewedBy(),
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: <SpiffStatus status={entry.getStatus()} />,
            onClick: handleSetStatusEditing(entry),
          },
          {
            value: entry.getReason(),
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
      <Form<Task>
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
            label: 'Approve/Reject/Revoke',
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
        taskId={data.getId()}
        withDateCreated
        renderAdding={(onClose, onReload) => (
          <Form<DocumentUpload>
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
          <Form<Document>
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
          <Form<SpiffToolAdminAction>
            title={`${statusEditing.getId() ? 'Edit' : 'Add'} Status`}
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
          name={statusDeleting.getReviewedBy()}
          onClose={handleSetStatusDeleting()}
          onConfirm={handleDeleteStatus}
        />
      )}
    </>
  );
};
