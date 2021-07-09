import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import {
  SpiffType,
  Task,
  TaskPriority,
  TaskStatus,
} from '@kalos-core/kalos-rpc/Task';
import kebabCase from 'lodash/kebabCase';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Row } from '../InfoTable';
import { ActionsProps } from '../Actions';
import { Modal } from '../Modal';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import { PlainForm, SchemaProps, Option } from '../PlainForm';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import { Documents } from '../Documents';
import {
  makeFakeRows,
  timestamp,
  TaskClientService,
  loadProjectTaskBillableTypes,
  formatDateTime,
  escapeText,
  UserClientService,
  TaskAssignmentClientService,
  uploadFileToS3Bucket,
  DocumentClientService,
  TaskEventClientService,
  makeSafeFormObject,
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  PROJECT_TASK_STATUS_COLORS,
  OPTION_ALL,
  OPTION_BLANK,
} from '../../../constants';
import './Tasks.less';
import { Document } from '@kalos-core/kalos-rpc/Document';
import { TaskEvent } from '@kalos-core/kalos-rpc/TaskEvent';

type ExternalCode = 'customers' | 'employee' | 'properties';
interface Props {
  loggedUserId: number;
  externalCode: ExternalCode;
  externalId: number;
  onClose?: () => void;
}

type TaskEdit = Task & {
  assignedTechnicians: string;
};

const COLUMNS: Columns = [
  { name: 'Id' },
  { name: 'Reference #' },
  { name: 'Priority' },
  { name: 'Description' },
  { name: 'Status' },
  { name: 'Created' },
  { name: 'Due' },
];

type DocumentUplodad = {
  filename: '';
  description: '';
};

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

const SCHEMA_TASK_EVENT: Schema<TaskEvent> = [
  [
    {
      name: 'getActionTaken',
      label: 'Action Taken',
      multiline: true,
    },
  ],
  [
    {
      name: 'getActionNeeded',
      label: 'Action Needed',
      multiline: true,
    },
  ],
];

export const Tasks: FC<Props> = ({
  externalCode,
  externalId,
  loggedUserId,
  onClose,
}) => {
  const searchInit = useMemo(() => {
    const req = new Task() as TaskEdit;
    req.setStatusId(0);
    req.setPriorityId(0);
    req.assignedTechnicians = '';
    return req;
  }, []);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [priorities, setPriorities] = useState<TaskPriority[]>([]);
  const [search, setSearch] = useState<TaskEdit>(searchInit);
  const [statuses, setStatuses] = useState<TaskStatus[]>([]);
  const [spiffTypes, setSpiffTypes] = useState<SpiffType[]>([]);
  const [billableTypes, setBillableTypes] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pendingEdit, setPendingEdit] = useState<TaskEdit>();
  const [pendingDelete, setPendingDelete] = useState<Task>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const [documentFile, setDocumentFile] = useState<string>('');
  const [documentSaving, setDocumentSaving] = useState<boolean>(false);
  const [taskEvents, setTaskEvents] = useState<TaskEvent[]>([]);
  const [taskEventsLoading, setTaskEventsLoading] = useState<boolean>(false);
  const [taskEventDeleting, setTaskEventDeleting] = useState<TaskEvent>();
  const [taskEventEditing, setTaskEventEditing] = useState<TaskEvent>();
  const loadInit = useCallback(async () => {
    setLoadingInit(true);
    const priorities = await TaskClientService.loadProjectTaskPriorities();
    const statuses = await TaskClientService.loadProjectTaskStatuses();
    const billableTypes = await loadProjectTaskBillableTypes();
    const spiffTypes = await TaskClientService.loadSpiffTypes();
    setPriorities(priorities);
    setStatuses(statuses);
    setBillableTypes(billableTypes);
    setSpiffTypes(spiffTypes);
    setLoadingInit(false);
    setLoadedInit(true);
  }, [
    setLoadedInit,
    setLoadingInit,
    setPriorities,
    setStatuses,
    setBillableTypes,
    setSpiffTypes,
  ]);
  const load = useCallback(async () => {
    setLoading(true);
    const req = new Task();
    req.setReferenceNumber(search.getReferenceNumber());
    req.setPriorityId(search.getPriorityId());
    req.setBriefDescription(search.getBriefDescription());
    req.setStatusId(search.getStatusId());
    req.setPageNumber(page);
    req.setExternalCode(externalCode);
    req.setExternalId(externalId);
    req.setIsActive(true);
    const res = await TaskClientService.loadTasks(req);
    setTasks(res.getResultsList());
    setCount(res.getTotalCount());
    setLoading(false);
  }, [setLoading, setTasks, setCount, externalId, externalCode, page, search]);
  useEffect(() => {
    if (!loadedInit) {
      loadInit();
    }
    if (loadedInit && !loaded) {
      setLoaded(true);
      load();
    }
  }, [loadInit, loadedInit, loaded, setLoaded, load]);
  const handleSave = useCallback(
    async (taskEdit: TaskEdit) => {
      setSaving(true);
      let safeTaskEdit = makeSafeFormObject(taskEdit as Task, new Task());
      if (safeTaskEdit.getBillableType() === OPTION_BLANK) {
        safeTaskEdit.setBillableType('');
      }

      safeTaskEdit.setPriorityId(2);
      safeTaskEdit.setExternalCode(externalCode);
      safeTaskEdit.setExternalId(externalId);
      const technicianIds = taskEdit.assignedTechnicians
        ? taskEdit.assignedTechnicians.split(',').map(id => +id)
        : [];
      let id = 0;
      try {
        id = await TaskClientService.upsertTask(safeTaskEdit);
      } catch (err) {
        console.error(`An error occurred while upserting a task: ${err}`);
      }
      try {
        await TaskAssignmentClientService.upsertTaskAssignments(
          id,
          technicianIds,
        ); // FIXME resolve when task will return TaskAssigment[]
      } catch (err) {
        console.error(
          `An error occurred while upserting task assignments: ${err}`,
        );
      }
      setSaving(false);
      setPendingEdit(undefined);
      setLoaded(false);
    },
    [externalCode, externalId],
  );
  const handleSetSearch = useCallback(
    (newSearch: TaskEdit) => setSearch(newSearch),
    [setSearch],
  );
  const handleDelete = useCallback(async () => {
    if (!pendingDelete) {
      console.error(
        'handleDelete was called with no pendingDelete variable set. This is a no-op.',
      );
      return;
    }

    try {
      await TaskClientService.deleteSpiffTool(pendingDelete!.getId());
    } catch (err) {
      console.error(
        `An error occurred while deleting a spiff tool entry: ${err}`,
      );
    }
    setPendingDelete(undefined);
    setLoading(true);
    setLoaded(false);
  }, [pendingDelete, setPendingDelete, setLoading, setLoaded]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage],
  );
  const loadTaskEvents = useCallback(
    async (id: number) => {
      setTaskEventsLoading(true);
      const taskEvents = await TaskEventClientService.loadTaskEventsByFilter({
        id,
        withTechnicianNames: true,
      });
      setTaskEvents(taskEvents);
      setTaskEventsLoading(false);
    },
    [setTaskEventsLoading, setTaskEvents],
  );
  const handleSetPendingEdit = useCallback(
    async (pendingEdit?: TaskEdit) => {
      setPendingEdit(pendingEdit);
      let safePendingEdit = makeSafeFormObject(pendingEdit as Task, new Task());
      if (pendingEdit && safePendingEdit.getId()) {
        loadTaskEvents(safePendingEdit.getId());
      }
    },
    [setPendingEdit, loadTaskEvents],
  );
  const handleSetPendingDelete = useCallback(
    (pendingDelete?: Task) => setPendingDelete(pendingDelete),
    [setPendingDelete],
  );
  const handleSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const newTask = useMemo(() => {
    const req = new Task();
    req.setTimeDue(timestamp());
    req.setStatusId(1); // New
    req.setPriorityId(2); // Normal
    req.setBillableType(OPTION_BLANK);
    return { ...req, assignedTechnicians: '' };
  }, []);
  const handleDocumentUpload = useCallback(
    (onClose, onReload) =>
      async ({ filename, description }: DocumentUplodad) => {
        if (!pendingEdit || !pendingEdit.getId()) return;
        setUploadFailed(false);
        setUploading(true);
        const ext = filename.split('.').pop();
        const fileName =
          kebabCase(
            [
              pendingEdit.getId(),
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
            pendingEdit.getId(),
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
    [documentFile, loggedUserId, pendingEdit, setUploadFailed, setUploading],
  );
  const handleFileLoad = useCallback(
    file => setDocumentFile(file),
    [setDocumentFile],
  );
  const handleDocumentUpdate = useCallback(
    (onClose, onReload, { id }) =>
      async (form: Document) => {
        setDocumentSaving(true);
        await DocumentClientService.updateDocumentDescription(
          id,
          form.getDescription(),
        );
        setDocumentSaving(false);
        onClose();
        onReload();
      },
    [setDocumentSaving],
  );
  const SPIFF_TYPES_OPTIONS: Option[] = useMemo(
    () =>
      spiffTypes.map(spiffType => ({
        label: escapeText(spiffType.getType()),
        value: spiffType.getId(),
      })),
    [spiffTypes],
  );
  const statusesMap: { [key: number]: string } = useMemo(
    () =>
      statuses.reduce(
        (aggr, status) => ({
          ...aggr,
          [status.getId()]: status.getDescription(),
        }),
        {},
      ),
    [statuses],
  );
  const prioritiesMap: { [key: number]: string } = useMemo(
    () =>
      priorities.reduce(
        (aggr, priority) => ({
          ...aggr,
          [priority.getId()]: priority.getDescription(),
        }),
        {},
      ),
    [priorities],
  );
  const statusOptions = useMemo(
    () =>
      statuses.map(status => ({
        value: status.getId(),
        label: status.getDescription(),
        color: PROJECT_TASK_STATUS_COLORS[status.getId()],
      })),
    [statuses],
  );
  const priorityOptions = useMemo(
    () =>
      priorities.map(priority => ({
        value: priority.getId(),
        label: priority.getDescription(),
        icon: PROJECT_TASK_PRIORITY_ICONS[priority.getId()],
      })),
    [priorities],
  );
  const typeTitle = useMemo(() => {
    if (externalCode === 'customers') return 'Customer';
    if (externalCode === 'employee') return 'Employee';
    if (externalCode === 'properties') return 'Property';
    return '';
  }, [externalCode]);
  const handleStartTaskAction = useCallback(async () => {
    if (!pendingEdit || !pendingEdit.getId()) return;
    const data = new TaskEvent();
    data.setTaskId(pendingEdit.getId());
    data.setTechnicianUserId(loggedUserId);
    data.setTimeStarted(timestamp());
    data.setStatusId(2);
    setTaskEventsLoading(true);
    await TaskEventClientService.upsertTaskEvent(data);
    loadTaskEvents(pendingEdit.getId());
  }, [pendingEdit, loggedUserId, setTaskEventsLoading, loadTaskEvents]);
  const handleSetTaskEventEditing = useCallback(
    (taskEventEditing?: TaskEvent) => setTaskEventEditing(taskEventEditing),
    [setTaskEventEditing],
  );
  const handleSetTaskEventDeleting = useCallback(
    (taskEventDeleting?: TaskEvent) => setTaskEventDeleting(taskEventDeleting),
    [setTaskEventDeleting],
  );
  const handleDeleteTaskEvent = useCallback(async () => {
    if (!taskEventDeleting || !pendingEdit || !pendingEdit.getId()) return;
    setTaskEventDeleting(undefined);
    await TaskEventClientService.deleteTaskEvent(taskEventDeleting.getId());
    loadTaskEvents(pendingEdit.getId());
  }, [taskEventDeleting, loadTaskEvents, pendingEdit]);
  const handleSaveTaskEvent = useCallback(
    async (formData: TaskEvent) => {
      if (!taskEventEditing || !pendingEdit || !pendingEdit.getId()) return;
      const data = formData;
      data.setId(taskEventEditing.getId());
      data.setStatusId(4);
      data.setTimeFinished(taskEventEditing.getTimeFinished());
      setTaskEventEditing(undefined);
      setTaskEventsLoading(true);
      await TaskEventClientService.upsertTaskEvent(data);
      loadTaskEvents(pendingEdit.getId());
    },
    [taskEventEditing, pendingEdit, setTaskEventsLoading, loadTaskEvents],
  );
  const SCHEMA_TASK: Schema<TaskEdit> = useMemo(() => {
    let pendingEditSafeObject = pendingEdit
      ? makeSafeFormObject(pendingEdit as Task, new Task())
      : pendingEdit;

    return [
      [{ name: 'getId', type: 'hidden' }],
      [
        {
          name: 'getBillableType',
          label: 'Task type',
          options: [OPTION_BLANK, ...billableTypes],
        },
      ],
      [
        {
          name: 'getBillable',
          label: 'Billable?',
          type: 'checkbox',
        },
      ],
      [
        {
          name: 'getReferenceNumber',
          label:
            pendingEdit &&
            (pendingEditSafeObject as Task).getBillableType() === 'Parts Run'
              ? 'Job / Reference #'
              : 'Reference #',
        },
      ],
      ...(pendingEdit &&
      ['Spiff', 'Tool Purchase'].includes(
        (pendingEditSafeObject as Task).getBillableType() || '',
      )
        ? []
        : [
            [
              {
                name: 'getTimeDue',
                label: 'Time Due',
                type: 'datetime',
              } as SchemaProps<TaskEdit>,
            ],
          ]),
      ...(pendingEdit &&
      (pendingEditSafeObject as Task).getBillableType() === 'Parts Run'
        ? [
            [
              {
                name: 'getAddress',
                label: 'Destination',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getOrderNum',
                label: 'Order #',
              } as SchemaProps<TaskEdit>,
            ],
          ]
        : []),
      [
        {
          name: 'getBriefDescription',
          label: 'Brief Description',
          multiline: true,
        },
      ],
      ...(pendingEdit &&
      ['Spiff', 'Tool Purchase'].includes(
        (pendingEditSafeObject as Task).getBillableType() || '',
      )
        ? []
        : [
            [
              {
                name: 'getDetails',
                label: 'Details',
                multiline: true,
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getNotes',
                label: 'Notes',
                multiline: true,
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getStatusId',
                label: 'Status',
                options: statusOptions,
                required: true,
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getPriorityId',
                label: 'Proprity',
                options: priorityOptions,
                required: true,
              } as SchemaProps<TaskEdit>,
            ],
          ]),
      ...(pendingEdit &&
      (pendingEditSafeObject as Task).getBillableType() === 'Flat Rate'
        ? [
            [
              {
                name: 'getFlatRate',
                label: 'Flat Rate',
                startAdornment: '$',
              } as SchemaProps<TaskEdit>,
            ],
          ]
        : []),
      ...(pendingEdit &&
      (pendingEditSafeObject as Task).getBillableType() === 'Hourly'
        ? [
            [
              {
                name: 'getHourlyStart',
                label: 'Time Start',
                type: 'datetime',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getHourlyEnd',
                label: 'Time End',
                type: 'datetime',
              } as SchemaProps<TaskEdit>,
            ],
          ]
        : []),
      ...(pendingEdit &&
      ['Spiff', 'Tool Purchase'].includes(
        (pendingEditSafeObject as Task).getBillableType() || '',
      )
        ? []
        : [
            [
              {
                name: 'assignedTechnicians',
                label: 'Task Assignments(s)',
                type: 'technicians',
                required: true,
              } as SchemaProps<TaskEdit>,
            ],
          ]),
      ...(pendingEdit &&
      (pendingEditSafeObject as Task).getBillableType() === 'Spiff'
        ? [
            [
              {
                name: 'getSpiffAmount',
                label: 'Spiff Amount',
                type: 'number',
                startAdornment: '$',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getSpiffJobNumber',
                label: 'Job #',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getDatePerformed',
                label: 'Date Performed',
                type: 'date',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getSpiffTypeId',
                label: 'Spiff Type',
                options: SPIFF_TYPES_OPTIONS,
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getSpiffAddress',
                label: 'Address',
                multiline: true,
              } as SchemaProps<TaskEdit>,
            ],
          ]
        : []),
      ...(pendingEdit &&
      (pendingEditSafeObject as Task).getBillableType() === 'Tool Purchase'
        ? [
            [
              {
                name: 'getToolpurchaseDate',
                label: 'Purchase Date',
                type: 'date',
              } as SchemaProps<TaskEdit>,
            ],
            [
              {
                name: 'getToolpurchaseCost',
                label: 'Tool Cost',
                type: 'number',
                startAdornment: '$',
              } as SchemaProps<TaskEdit>,
            ],
          ]
        : []),
    ];
  }, [
    SPIFF_TYPES_OPTIONS,
    billableTypes,
    pendingEdit,
    priorityOptions,
    statusOptions,
  ]);
  const SCHEMA_SEARCH: Schema<TaskEdit> = [
    [
      {
        name: 'getReferenceNumber',
        label: 'Reference #',
        type: 'search',
      },
      {
        name: 'getPriorityId',
        label: 'Proprity',
        options: [{ label: OPTION_ALL, value: 0 }, ...priorityOptions],
      },
      {
        name: 'getBriefDescription',
        label: 'Description',
        type: 'search',
      },
      {
        name: 'getStatusId',
        label: 'Status',
        options: [{ label: OPTION_ALL, value: 0 }, ...statusOptions],
        actions: [{ label: 'Search', onClick: handleSearch }],
      },
    ],
  ];
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
  const formKey = useMemo(
    () =>
      SCHEMA_TASK.reduce((aggr, item) => [...aggr, ...item], [])
        .map(({ name }) => name)
        .join('_'),
    [SCHEMA_TASK],
  );
  const isLastTaskEventStarted =
    taskEvents[0] && taskEvents[0].getStatusId() === 2;
  let safePendingEdit = pendingEdit
    ? makeSafeFormObject(pendingEdit as Task, new Task())
    : pendingEdit;
  return (
    <>
      <div>
        <SectionBar
          title={`${typeTitle} Tasks`}
          actions={
            [
              {
                label: 'Add Task',
                onClick: async () => {
                  await handleSetPendingEdit(newTask as TaskEdit);
                },
                disabled: !loadedInit,
              },
              ...(onClose
                ? [{ label: 'Close', variant: 'outlined', onClick: onClose }]
                : []),
            ] as ActionsProps
          }
          pagination={{
            count,
            rowsPerPage: ROWS_PER_PAGE,
            page,
            onPageChange: handlePageChange,
          }}
        />
        <PlainForm
          schema={SCHEMA_SEARCH}
          data={search}
          onChange={output => {
            handleSetSearch(
              makeSafeFormObject(output as Task, new Task()) as TaskEdit,
            );
          }}
        />
        <InfoTable
          columns={COLUMNS}
          data={
            loading || loadingInit
              ? makeFakeRows(7, 5)
              : tasks.map(task => {
                  return [
                    {
                      value: task.getId(),
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: task.getReferenceNumber(),
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: prioritiesMap[task.getPriorityId()],
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: task.getBriefDescription(),
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: statusesMap[task.getStatusId()],
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: formatDateTime(task.getTimeCreated()),
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                    },
                    {
                      value: formatDateTime(task.getTimeDue()),
                      onClick: () =>
                        handleSetPendingEdit({
                          ...task,
                          assignedTechnicians: '',
                        } as TaskEdit),
                      actions: [
                        <IconButton
                          key="edit"
                          size="small"
                          onClick={() =>
                            handleSetPendingEdit({
                              ...task,
                              assignedTechnicians: '',
                            } as TaskEdit)
                          } // FIXME
                        >
                          <EditIcon />
                        </IconButton>,
                        <IconButton
                          key="delete"
                          size="small"
                          onClick={() => handleSetPendingDelete(task)}
                        >
                          <DeleteIcon />
                        </IconButton>,
                      ],
                    },
                  ] as Row;
                })
          }
          loading={loading || loadingInit}
        />
      </div>
      {pendingEdit && (
        <Modal
          open
          onClose={() => handleSetPendingEdit()}
          fullScreen={!!(safePendingEdit as Task).getId()}
        >
          <div className="TasksEdit">
            <div className="TasksEditForm">
              <Form
                key={formKey}
                title={`${
                  (safePendingEdit as Task).getId() ? 'Edit' : 'Add'
                } ${typeTitle} Task`}
                onClose={() => handleSetPendingEdit()}
                onSave={handleSave}
                onChange={setPendingEdit}
                schema={SCHEMA_TASK}
                data={pendingEdit}
                disabled={saving}
              />
            </div>
            {!!(safePendingEdit as Task).getId() && (
              <div className="TasksEditAside">
                <SectionBar
                  title="Task Actions"
                  actions={
                    taskEventsLoading
                      ? []
                      : [
                          {
                            label: isLastTaskEventStarted
                              ? 'Completed'
                              : 'Start',
                            onClick: isLastTaskEventStarted
                              ? () => handleSetTaskEventEditing(taskEvents[0])
                              : handleStartTaskAction,
                          },
                        ]
                  }
                  fixedActions
                />
                <InfoTable
                  columns={[
                    { name: 'Started / Finished' },
                    { name: 'Action Taken' },
                    { name: 'Action Needed' },
                    { name: 'Technician / Status' },
                  ]}
                  data={
                    taskEventsLoading
                      ? makeFakeRows(4, 3)
                      : taskEvents.map(taskEvent => {
                          return [
                            {
                              value: (
                                <>
                                  <div>
                                    {taskEvent.getTimeStarted()
                                      ? formatDateTime(
                                          taskEvent.getTimeStarted(),
                                        )
                                      : '-'}
                                  </div>
                                  <div>
                                    {taskEvent.getTimeFinished()
                                      ? formatDateTime(
                                          taskEvent.getTimeFinished(),
                                        )
                                      : '-'}
                                  </div>
                                </>
                              ),
                            },
                            { value: taskEvent.getActionTaken() },
                            { value: taskEvent.getActionNeeded() },
                            {
                              value: (
                                <>
                                  <div>{taskEvent.getTechnicianUserName()}</div>
                                  <div
                                    style={{
                                      color:
                                        taskEvent.getStatusId() === 2
                                          ? 'red'
                                          : 'green',
                                    }}
                                  >
                                    {taskEvent.getStatusId() === 2
                                      ? 'In Progress'
                                      : 'Completed'}
                                  </div>
                                </>
                              ),
                              actions: [
                                ...(taskEvent.getStatusId() === 2
                                  ? []
                                  : [
                                      <IconButton
                                        key="edit"
                                        size="small"
                                        onClick={() =>
                                          handleSetTaskEventEditing(taskEvent)
                                        }
                                      >
                                        <EditIcon />
                                      </IconButton>,
                                    ]),
                                <IconButton
                                  key="delete"
                                  size="small"
                                  onClick={() =>
                                    handleSetTaskEventDeleting(taskEvent)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>,
                              ],
                            },
                          ];
                        })
                  }
                  loading={taskEventsLoading}
                />
                <Documents
                  title="Documents"
                  taskId={(safePendingEdit as Task).getId()}
                  withDownloadIcon
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
              </div>
            )}
          </div>
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDelete
          open
          onClose={() => handleSetPendingDelete()}
          kind={`${typeTitle} Task`}
          name={`${pendingDelete.getId()}`}
          onConfirm={() => handleDelete()}
        />
      )}
      {taskEventDeleting && (
        <ConfirmDelete
          open
          onClose={() => handleSetTaskEventDeleting()}
          kind="Task Action"
          name={`started at ${formatDateTime(
            taskEventDeleting.getTimeStarted(),
          )}`}
          onConfirm={handleDeleteTaskEvent}
        />
      )}
      {taskEventEditing && (
        <Modal open onClose={() => handleSetTaskEventEditing()}>
          <Form
            title={`${
              taskEventEditing.getTimeFinished() ? 'Edit' : 'Complete'
            } Task Action`}
            schema={SCHEMA_TASK_EVENT}
            data={taskEventEditing}
            onClose={() => handleSetTaskEventEditing()}
            onSave={handleSaveTaskEvent}
          />
        </Modal>
      )}
    </>
  );
};
