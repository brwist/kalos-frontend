import React, { FC, useState, useEffect, useCallback } from 'react';
import kebabCase from 'lodash/kebabCase';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionClient,
} from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { SpiffType as SpiffTypeRpc } from '@kalos-core/kalos-rpc/compiled-protos/task_pb';
import { User } from '@kalos-core/kalos-rpc/User';
import { DocumentClient, Document } from '@kalos-core/kalos-rpc/Document';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import CheckIcon from '@material-ui/icons/CheckCircle';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { Link } from '../../ComponentsLibrary/Link';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { Documents } from '../../ComponentsLibrary/Documents';
import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
  loadUserById,
  trailingZero,
  getWeekOptions,
  loadTechnicians,
  escapeText,
  formatDay,
  uploadFileToS3Bucket,
  makeLast12MonthsOptions,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, OPTION_ALL } from '../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);
const DocumentClientService = new DocumentClient(ENDPOINT);
const SpiffToolAdminActionClientService = new SpiffToolAdminActionClient(
  ENDPOINT,
);

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const WEEK_OPTIONS = getWeekOptions();
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

type TaskType = Task.AsObject;
type UserType = User.AsObject;
type SpiffToolAdminActionType = SpiffToolAdminAction.AsObject;
type SpiffType = SpiffTypeRpc.AsObject;
type DocumentType = Document.AsObject;
type SearchType = {
  description: string;
  month: string;
  kind: string;
  technician: number;
};
type DocumentUplodad = {
  filename: '';
  description: '';
};

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

export interface Props {
  type: 'Spiff' | 'Tool';
  loggedUserId: number;
}

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

const STATUSES_COLUMNS: Columns = [
  { name: 'Date' },
  { name: 'Reviewed By' },
  { name: 'Status' },
  { name: 'Reason' },
  { name: '' },
];

const useStyles = makeStyles(theme => ({
  unlinked: {
    ...theme.typography.body1,
    margin: theme.spacing(2),
  },
  status: {
    display: 'flex',
    alignItems: 'center',
  },
  statusColor: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(0.75),
  },
  duplicateIcon: {
    color: '#B00',
  },
  uploading: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    padding: theme.spacing(),
    borderRadius: theme.shape.borderRadius,
  },
}));

export const SpiffTool: FC<Props> = ({ type, loggedUserId }) => {
  const classes = useStyles();
  const MONTHS_OPTIONS: Option[] = makeLast12MonthsOptions(true);
  const getSearchFormInit = () => ({
    description: '',
    month: MONTHS_OPTIONS[0].value as string,
    kind: MONTHLY,
    technician: loggedUserId,
  });
  const getStatusFormInit = () => {
    const entry = new SpiffToolAdminAction();
    entry.setDecisionDate(timestamp(true));
    entry.setStatus(+STATUSES[0].value);
    return entry.toObject();
  };
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<TaskType>();
  const [extendedEditing, setExtendedEditing] = useState<TaskType>();
  const [deleting, setDeleting] = useState<TaskType>();
  const [loggedInUser, setLoggedInUser] = useState<UserType>();
  const [entries, setEntries] = useState<TaskType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const [loadingStatuses, setLoadingStatuses] = useState<boolean>(false);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
  const [spiffTypes, setSpiffTypes] = useState<SpiffType[]>([]);
  const [unlinkedSpiffJobNumber, setUnlinkedSpiffJobNumber] = useState<string>(
    '',
  );
  const [documentFile, setDocumentFile] = useState<string>('');
  const [statusEditing, setStatusEditing] = useState<
    SpiffToolAdminActionType
  >();
  const [statusDeleting, setStatusDeleting] = useState<
    SpiffToolAdminActionType
  >();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const [documentSaving, setDocumentSaving] = useState<boolean>(false);
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(
    ({ type, id: value }) => ({ label: escapeText(type), value }),
  );
  const SPIFF_EXT: { [key: number]: string } = spiffTypes.reduce(
    (aggr, { id, ext }) => ({ ...aggr, [id]: ext }),
    {},
  );
  const SPIFF_TYPE: { [key: number]: string } = spiffTypes.reduce(
    (aggr, { id, type }) => ({ ...aggr, [id]: type }),
    {},
  );
  const loadLoggedInUser = useCallback(async () => {
    const loggedInUser = await loadUserById(loggedUserId);
    setLoggedInUser(loggedInUser);
    setSearchFormKey(searchFormKey + 1);
  }, [loggedUserId, setLoggedInUser, searchFormKey, setSearchFormKey]);
  const isAdmin = loggedInUser && !!loggedInUser.isAdmin; // FIXME isSpiffAdmin correct?
  const load = useCallback(async () => {
    setLoading(true);
    if (type === 'Spiff' && spiffTypes.length === 0) {
      const { resultsList: spiffTypes } = (
        await TaskClientService.GetSpiffTypes()
      ).toObject();
      setSpiffTypes(spiffTypes);
    }
    const { description, month, kind, technician } = searchForm;
    const req = new Task();
    req.setPageNumber(page);
    req.setIsActive(1);
    req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
    req.setOrderDir('ASC');
    if (technician) {
      req.setExternalId(technician);
    }
    req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
    if (description !== '') {
      req.setBriefDescription(`%${description}%`);
    }
    if (kind === MONTHLY) {
      if (month !== OPTION_ALL) {
        req.setDatePerformed(month);
      }
    } else {
      const [y, m, d] = month.split('-');
      const n = new Date(+y, +m - 1, +d + 7, 0, 0, 0);
      const ltDate = `${n.getFullYear()}-${trailingZero(
        n.getMonth() + 1,
      )}-${trailingZero(n.getDate())}`;
      req.setDateRangeList(['>=', month, '<', ltDate]);
    }
    const res = await TaskClientService.BatchGet(req);
    const resultsList = res.getResultsList().map(el => el.toObject());
    const count = res.getTotalCount();
    setCount(count);
    setEntries(resultsList);
    setLoading(false);
    return resultsList;
  }, [
    setEntries,
    setLoading,
    setCount,
    page,
    searchForm,
    type,
    setSpiffTypes,
    spiffTypes,
  ]);
  const loadUserTechnicians = useCallback(async () => {
    const technicians = await loadTechnicians();
    setTechnicians(technicians);
  }, [setLoadedTechnicians, setTechnicians]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleSetExtendedEditing = useCallback(
    (extendedEditing?: TaskType) => async () =>
      setExtendedEditing(extendedEditing),
    [setExtendedEditing],
  );
  const handleSetEditing = useCallback(
    (editing?: TaskType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: TaskType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handleDelete = useCallback(async () => {
    if (deleting) {
      setLoading(true);
      const req = new Task();
      req.setId(deleting.id);
      setDeleting(undefined);
      await TaskClientService.Delete(req);
      setLoading(false);
      await load();
    }
  }, [deleting, setLoading, setDeleting, load]);
  const handleSave = useCallback(
    async (data: TaskType) => {
      if (editing) {
        setSaving(true);
        const now = timestamp();
        const isNew = !editing.id;
        const req = new Task();
        const fieldMaskList = [];
        if (isNew) {
          req.setTimeCreated(now);
          req.setTimeDue(now);
          req.setPriorityId(2);
          req.setExternalCode('user');
          req.setExternalId(loggedUserId);
          req.setCreatorUserId(loggedUserId);
          req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
          req.setReferenceNumber('');
          req.setStatusId(1);
          fieldMaskList.push(
            'TimeCreated',
            'TimeDue',
            'PriorityId',
            'ExternalCode',
            'ExternalId',
            'CreatorUserId',
            'BillableType',
            'ReferenceNumber',
          );
          if (type === 'Tool') {
            req.setToolpurchaseDate(now);
            fieldMaskList.push('ToolpurchaseDate');
          }
        }
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        await TaskClientService[isNew ? 'Create' : 'Update'](req);
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [loggedUserId, editing, setSaving, setEditing, type],
  );
  const handleSaveExtended = useCallback(
    async (data: TaskType) => {
      if (extendedEditing) {
        setSaving(true);
        const req = new Task();
        req.setId(extendedEditing.id);
        const fieldMaskList = [];
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        await TaskClientService.Update(req);
        setSaving(false);
        setExtendedEditing(undefined);
        await load();
      }
    },
    [extendedEditing, setSaving, setExtendedEditing],
  );
  const handleSearchFormChange = useCallback(
    (form: SearchType) => {
      const isPeriodsChange = searchForm.kind !== form.kind;
      setSearchForm({
        ...form,
        ...(isPeriodsChange
          ? {
              month: (form.kind === MONTHLY
                ? MONTHS_OPTIONS[0]
                : WEEK_OPTIONS[0]
              ).value as string,
            }
          : {}),
      });
      if (isPeriodsChange) {
        setSearchFormKey(searchFormKey + 1);
      }
    },
    [searchForm, setSearchFormKey, searchFormKey],
  );
  const handleMakeSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const handleResetSearch = useCallback(() => {
    setSearchForm(getSearchFormInit());
    setSearchFormKey(searchFormKey + 1);
    setLoaded(false);
  }, [setLoaded, setSearchForm, searchFormKey, setSearchFormKey]);
  const reloadExtendedEditing = useCallback(async () => {
    if (extendedEditing) {
      const entries = await load();
      setExtendedEditing(entries.find(({ id }) => id === extendedEditing.id));
      setLoadingStatuses(false);
    }
  }, [extendedEditing, load, setExtendedEditing, setLoadingStatuses]);
  const handleSaveStatus = useCallback(
    async (data: SpiffToolAdminActionType) => {
      if (extendedEditing && statusEditing) {
        const isNew = !statusEditing.id;
        const taskId = extendedEditing.id;
        const req = new SpiffToolAdminAction();
        const fieldMaskList = [];
        if (isNew) {
          req.setCreatedDate(timestamp());
          req.setTaskId(taskId);
          fieldMaskList.push('CreatedDate');
          fieldMaskList.push('TaskId');
        } else {
          req.setId(statusEditing.id);
          fieldMaskList.push('Id');
        }
        for (const fieldName in data) {
          const { upperCaseProp, methodName } = getRPCFields(fieldName);
          // @ts-ignore
          req[methodName](data[fieldName]);
          fieldMaskList.push(upperCaseProp);
        }
        req.setFieldMaskList(fieldMaskList);
        setStatusEditing(undefined);
        setLoadingStatuses(true);
        await SpiffToolAdminActionClientService[isNew ? 'Create' : 'Update'](
          req,
        );
        reloadExtendedEditing();
      }
    },
    [
      extendedEditing,
      setStatusEditing,
      statusEditing,
      load,
      setLoadingStatuses,
      reloadExtendedEditing,
    ],
  );
  const handleSetStatusEditing = useCallback(
    (statusEditing?: SpiffToolAdminActionType) => () =>
      setStatusEditing(statusEditing),
    [setStatusEditing],
  );
  const handleClickAddStatus = useCallback(
    (entry: TaskType) => () => {
      handleSetExtendedEditing(entry)();
      setStatusEditing(getStatusFormInit());
    },
    [setEditing, setStatusEditing, getStatusFormInit],
  );
  const handleSetStatusDeleting = useCallback(
    (statusDeleting?: SpiffToolAdminActionType) => () =>
      setStatusDeleting(statusDeleting),
    [setStatusDeleting],
  );
  const handleDeleteStatus = useCallback(async () => {
    if (extendedEditing && statusDeleting) {
      const req = new SpiffToolAdminAction();
      req.setId(statusDeleting.id);
      setStatusDeleting(undefined);
      setLoadingStatuses(true);
      await SpiffToolAdminActionClientService.Delete(req);
      reloadExtendedEditing();
    }
  }, [
    statusDeleting,
    setStatusDeleting,
    setLoadingStatuses,
    extendedEditing,
    reloadExtendedEditing,
  ]);
  const handleClickTechnician = useCallback(
    (technician: number) => (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      event.preventDefault();
      setSearchForm({ ...searchForm, technician });
      setSearchFormKey(searchFormKey + 1);
      handleMakeSearch();
    },
    [
      searchForm,
      setSearchForm,
      searchFormKey,
      setSearchFormKey,
      handleMakeSearch,
    ],
  );
  const handleClickSpiffJobNumber = useCallback(
    (spiffJobNumber: string) => (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      setUnlinkedSpiffJobNumber(spiffJobNumber);
    },
    [setUnlinkedSpiffJobNumber],
  );
  const handleClearUnlinkedSpiffJobNumber = useCallback(
    () => setUnlinkedSpiffJobNumber(''),
    [setUnlinkedSpiffJobNumber],
  );
  const handleDocumentUpload = useCallback(
    (onClose, onReload) => async ({
      filename,
      description,
    }: DocumentUplodad) => {
      if (extendedEditing) {
        setUploadFailed(false);
        setUploading(true);
        const ext = filename.split('.').pop();
        const fileName =
          kebabCase(
            [
              extendedEditing.id,
              extendedEditing.referenceNumber,
              timestamp(true).split('-').reverse(),
              description.trim() || filename.replace('.' + ext, ''),
            ].join(' '),
          ) +
          '.' +
          ext;
        const fileData = documentFile.split(';base64,')[1];
        const status = await uploadFileToS3Bucket(
          fileName,
          fileData,
          'testbuckethelios', // FIXME is it correct bucket name for those docs?
        );
        if (status === 'ok') {
          const req = new Document();
          req.setFilename(fileName);
          req.setDateCreated(timestamp());
          req.setTaskId(extendedEditing.id);
          req.setUserId(loggedUserId);
          req.setDescription(description);
          req.setType(5);
          await DocumentClientService.Create(req);
          onClose();
          onReload();
          setUploading(false);
        } else {
          setUploadFailed(true);
          setUploading(false);
        }
      }
    },
    [
      documentFile,
      loggedUserId,
      extendedEditing,
      setUploadFailed,
      setUploading,
    ],
  );
  const handleDocumentUpdate = useCallback(
    (onClose, onReload, { id }) => async (form: DocumentType) => {
      setDocumentSaving(true);
      const { description } = form;
      const req = new Document();
      req.setId(id);
      req.setDescription(description);
      req.setFieldMaskList(['Description']);
      await DocumentClientService.Update(req);
      setDocumentSaving(false);
      onClose();
      onReload();
    },
    [setDocumentSaving],
  );
  const handleFileLoad = useCallback(file => setDocumentFile(file), [
    setDocumentFile,
  ]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      loadLoggedInUser();
      load();
    }
    if (isAdmin && !loadedTechnicians) {
      setLoadedTechnicians(true);
      loadUserTechnicians();
    }
  }, [
    loaded,
    setLoaded,
    isAdmin,
    loadedTechnicians,
    setLoadedTechnicians,
    loadUserTechnicians,
  ]);
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
  const SCHEMA: Schema<TaskType> =
    type === 'Spiff'
      ? [
          [
            {
              name: 'timeDue',
              label: 'Claim Date',
              readOnly: true,
              type: 'date',
            },
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
            {
              name: 'timeDue',
              label: 'Claim Date',
              readOnly: true,
              type: 'date',
            },
            {
              name: 'toolpurchaseCost',
              label: 'Tool Purchase Cost',
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
          [
            { name: 'referenceNumber', label: 'Reference #' },
            { name: 'briefDescription', label: 'Description', multiline: true },
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
  const COLUMNS: Columns = [
    { name: 'Claim Date' },
    { name: `${type === 'Spiff' ? 'Spiff' : 'Tool'} ID #` },
    { name: type === 'Spiff' ? 'Spiff' : 'Tool' },
    ...(type === 'Spiff' ? [{ name: 'Job Date' }] : []),
    { name: 'Technician' },
    { name: type === 'Spiff' ? 'Job #' : 'Reference #' },
    { name: 'Status' },
    { name: 'Amount' },
    ...(type === 'Spiff' ? [{ name: 'Duplicates' }] : []),
  ];
  const renderStatus = (status: number) => (
    <div className={classes.status}>
      <div
        className={classes.statusColor}
        style={{ backgroundColor: STATUS_TXT[status].color }}
      />
      {STATUS_TXT[status].label}
    </div>
  );
  const renderActionsList = (actionsList: SpiffToolAdminActionType[]) => {
    if (actionsList.length === 0) return '';
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
        {renderStatus(status)}
      </Tooltip>
    );
  };
  const makeNewTask = useCallback(() => {
    const newTask = new Task();
    newTask.setTimeDue(timestamp());
    if (type === 'Spiff') {
      newTask.setDatePerformed(timestamp());
      if (SPIFF_TYPES_OPTIONS.length > 0) {
        newTask.setSpiffTypeId(+SPIFF_TYPES_OPTIONS[0].value);
      }
    } else {
      newTask.setToolpurchaseDate(timestamp());
    }
    return newTask.toObject();
  }, [type, SPIFF_TYPES_OPTIONS]);

  const data: Data = loading
    ? makeFakeRows(type === 'Spiff' ? 9 : 7, 3)
    : entries.map(entry => {
        const {
          spiffToolId,
          spiffAmount,
          spiffJobNumber,
          datePerformed,
          briefDescription,
          timeDue,
          externalId,
          toolpurchaseCost,
          spiffTypeId,
          referenceNumber,
          actionsList,
          event,
          ownerName,
          duplicatesList,
        } = entry;
        const isDuplicate =
          duplicatesList.filter(({ actionsList }) => actionsList.length > 0)
            .length > 0;
        const technicianValue = (
          <Link onClick={handleClickTechnician(+externalId)}>{ownerName}</Link>
        );
        const actions = isAdmin
          ? [
              <IconButton // TODO: not display when status is approved
                key={2}
                size="small"
                onClick={handleClickAddStatus(entry)}
              >
                <CheckIcon />
              </IconButton>,
              <IconButton
                key={0}
                size="small"
                onClick={handleSetExtendedEditing(entry)}
              >
                <EditIcon />
              </IconButton>,
              <IconButton
                key={1}
                size="small"
                onClick={handleSetDeleting(entry)}
              >
                <DeleteIcon />
              </IconButton>,
            ]
          : [
              <IconButton key={0} size="small">
                <SearchIcon />
              </IconButton>,
            ];
        return [
          { value: formatDate(timeDue) },
          { value: spiffToolId },
          {
            value: `${
              type === 'Spiff' ? `${SPIFF_EXT[spiffTypeId] || ''} ` : ''
            }${briefDescription}`,
          },
          ...(type === 'Spiff' ? [{ value: formatDate(datePerformed) }] : []),
          {
            value: isAdmin ? technicianValue : ownerName,
          },
          {
            value:
              type === 'Spiff' ? (
                event && event.id ? (
                  <Link
                    href={[
                      'https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall',
                      `id=${event.id}`,
                      `user_id=${event.customerId}`,
                      `property_id=${event.propertyId}`,
                    ].join('&')}
                    blank
                  >
                    {spiffJobNumber}
                  </Link>
                ) : (
                  <Link onClick={handleClickSpiffJobNumber(spiffJobNumber)}>
                    {spiffJobNumber}
                  </Link>
                )
              ) : (
                referenceNumber
              ),
          },
          { value: renderActionsList(actionsList) },
          {
            value: '$' + (type === 'Spiff' ? spiffAmount : toolpurchaseCost),
            actions: type === 'Spiff' ? [] : actions,
          },
          ...(type === 'Spiff'
            ? [
                {
                  value: isDuplicate ? (
                    <Tooltip
                      content={
                        <>
                          {duplicatesList
                            .filter(({ actionsList }) => actionsList.length > 0)
                            .map(
                              (
                                {
                                  id,
                                  ownerName,
                                  spiffTypeId,
                                  timeDue,
                                  actionsList,
                                },
                                idx,
                              ) => (
                                <div key={id}>
                                  {idx !== 0 && <hr />}
                                  <strong>Tech Name: </strong>
                                  {ownerName}
                                  <br />
                                  <strong>Spiff: </strong>
                                  {SPIFF_TYPE[spiffTypeId]}
                                  <br />
                                  <strong>Reviewed By: </strong>
                                  {actionsList[0].reviewedBy.toUpperCase()}
                                  <br />
                                  <strong>Reason: </strong>
                                  {actionsList[0].reason}
                                  <br />
                                  <strong>Date Claimed: </strong>
                                  {formatDay(timeDue)} {formatDate(timeDue)}
                                </div>
                              ),
                            )}
                        </>
                      }
                    >
                      <IconButton
                        size="small"
                        classes={{ root: classes.duplicateIcon }}
                      >
                        <FlagIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ''
                  ),
                  actions,
                },
              ]
            : []),
        ];
      });
  const SCHEMA_SEARCH: Schema<SearchType> = [
    [
      {
        name: 'description',
        label: `Search ${type === 'Spiff' ? 'Spiffs' : 'Tool Purchases'}`,
      },
      ...(isAdmin
        ? [
            {
              name: 'technician' as const,
              label: 'Technician',
              options: [
                ...technicians.map(({ id, firstname, lastname }) => ({
                  label: `${firstname} ${lastname}`,
                  value: id,
                })),
                { label: OPTION_ALL, value: 0 },
              ],
            },
          ]
        : []),
      {
        name: 'month',
        label: searchForm.kind === MONTHLY ? 'Month' : 'Week',
        options: searchForm.kind === MONTHLY ? MONTHS_OPTIONS : WEEK_OPTIONS,
      },
      {
        name: 'kind',
        label: 'Periods',
        options: [MONTHLY, WEEKLY],
        actions: [
          { label: 'Reset', variant: 'outlined', onClick: handleResetSearch },
          { label: 'Search', onClick: handleMakeSearch },
        ],
      },
    ],
  ];
  const statusesData: Data =
    !extendedEditing || loadingStatuses
      ? makeFakeRows(5, 3)
      : extendedEditing.actionsList.map(entry => {
          const { decisionDate, reviewedBy, status, reason } = entry;
          return [
            { value: formatDate(decisionDate) },
            { value: reviewedBy },
            { value: renderStatus(status) },
            { value: reason },
            {
              value: '',
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
    <div>
      <SectionBar
        title={type === 'Spiff' ? 'Spiff Report' : 'Tool Purchases'}
        actions={[{ label: 'Add', onClick: handleSetEditing(makeNewTask()) }]}
        fixedActions
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
      />
      <PlainForm<SearchType>
        key={searchFormKey}
        data={searchForm}
        schema={SCHEMA_SEARCH}
        onChange={handleSearchFormChange}
      />
      <InfoTable columns={COLUMNS} data={data} loading={loading} />
      {editing && (
        <Modal open onClose={handleSetEditing()}>
          <Form<TaskType>
            title={`${type === 'Spiff' ? 'Spiff' : 'Tool Purchase'} Request`}
            schema={SCHEMA}
            onClose={handleSetEditing()}
            data={editing}
            onSave={handleSave}
            disabled={saving}
          />
        </Modal>
      )}
      {extendedEditing && (
        <Modal open onClose={handleSetExtendedEditing()} fullHeight>
          <Form<TaskType>
            title={`${type === 'Spiff' ? 'Spiff' : 'Tool Purchase'} Request`}
            schema={SCHEMA_EXTENDED}
            onClose={handleSetExtendedEditing()}
            data={extendedEditing}
            onSave={handleSaveExtended}
            disabled={saving}
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
            loading={loadingStatuses}
          />
          <Documents
            title="Documents"
            taskId={extendedEditing.id}
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
                  <Typography className={classes.uploading}>
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
        </Modal>
      )}
      {deleting && (
        <ConfirmDelete
          open
          kind={type === 'Spiff' ? 'Spiff' : 'Tool Request'}
          name={deleting.briefDescription}
          onConfirm={handleDelete}
          onClose={handleSetDeleting()}
        />
      )}
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
      {unlinkedSpiffJobNumber !== '' && (
        <Modal open onClose={handleClearUnlinkedSpiffJobNumber}>
          <SectionBar
            title="Invalid Job #"
            actions={[
              { label: 'Close', onClick: handleClearUnlinkedSpiffJobNumber },
            ]}
            fixedActions
          />
          <div className={classes.unlinked}>
            Job # <strong>{unlinkedSpiffJobNumber}</strong> does not appear to
            be connected to a valid Service Call.
          </div>
        </Modal>
      )}
    </div>
  );
};
