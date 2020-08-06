import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { Task } from '@kalos-core/kalos-rpc/Task';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SectionBar } from '../SectionBar';
import { InfoTable, Columns, Row } from '../InfoTable';
import { ActionsProps } from '../Actions';
import { Modal } from '../Modal';
import { ConfirmDelete } from '../ConfirmDelete';
import { Form, Schema } from '../Form';
import { PlainForm, SchemaProps } from '../PlainForm';
import { PROJECT_TASK_PRIORITY_ICONS } from '../EditProject';
import {
  TaskType,
  loadTasks,
  makeFakeRows,
  timestamp,
  loadProjectTaskPriorities,
  TaskPriorityType,
  loadProjectTaskStatuses,
  TaskStatusType,
  loadProjectTaskBillableTypes,
  upsertTask,
  formatDateTime,
  deletetSpiffTool,
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  PROJECT_TASK_STATUS_COLORS,
  OPTION_ALL,
  OPTION_BLANK,
} from '../../../constants';

type ExternalCode = 'customers' | 'employee' | 'properties';
interface Props {
  externalCode: ExternalCode;
  externalId: number;
  onClose?: () => void;
}

type TaskEdit = Partial<TaskType> & {
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

export const Tasks: FC<Props> = ({ externalCode, externalId, onClose }) => {
  const searchInit = useMemo(() => {
    const req = new Task();
    req.setStatusId(0);
    req.setPriorityId(0);
    return {
      ...req.toObject(),
      assignedTechnicians: '',
    };
  }, []);
  const [loadedInit, setLoadedInit] = useState<boolean>(false);
  const [loadingInit, setLoadingInit] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [priorities, setPriorities] = useState<TaskPriorityType[]>([]);
  const [search, setSearch] = useState<TaskEdit>(searchInit);
  const [statuses, setStatuses] = useState<TaskStatusType[]>([]);
  const [billableTypes, setBillableTypes] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pendingEdit, setPendingEdit] = useState<TaskEdit>();
  const [pendingDelete, setPendingDelete] = useState<TaskType>();
  const loadInit = useCallback(async () => {
    setLoadingInit(true);
    const priorities = await loadProjectTaskPriorities();
    const statuses = await loadProjectTaskStatuses();
    const billableTypes = await loadProjectTaskBillableTypes();
    setPriorities(priorities);
    setStatuses(statuses);
    setBillableTypes(billableTypes);
    setLoadingInit(false);
    setLoadedInit(true);
  }, [
    setLoadedInit,
    setLoadingInit,
    setPriorities,
    setStatuses,
    setBillableTypes,
  ]);
  const load = useCallback(async () => {
    setLoading(true);
    const { referenceNumber, priorityId, briefDescription, statusId } = search;
    const { resultsList, totalCount } = await loadTasks({
      pageNumber: page,
      externalCode,
      externalId,
      referenceNumber,
      priorityId,
      briefDescription,
      statusId,
    });
    setTasks(resultsList);
    setCount(totalCount);
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
    async ({ assignedTechnicians, ...data }: TaskEdit) => {
      setSaving(true);
      const saveData = { ...data, externalCode, externalId };
      if (saveData.billableType === OPTION_BLANK) {
        saveData.billableType = '';
      }
      if (!saveData.hasOwnProperty('priorityId')) {
        saveData.priorityId = 2;
      }
      const technicians = assignedTechnicians
        ? assignedTechnicians.split(',').map(id => +id)
        : []; // TODO save technicians to TaskAssignment
      await upsertTask(saveData);
      setSaving(false);
      setPendingEdit(undefined);
      setLoaded(false);
    },
    [setSaving, externalCode, externalId],
  );
  const handleDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(undefined);
    setLoading(true);
    await deletetSpiffTool(id);
    setLoaded(false);
  }, [pendingDelete, setPendingDelete, setLoading, setLoaded]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoading],
  );
  const handleSetPendingEdit = useCallback(
    (pendingEdit?: TaskEdit) => () => setPendingEdit(pendingEdit),
    [setPendingEdit],
  );
  const handleSetPendingDelete = useCallback(
    (pendingDelete?: TaskType) => () => setPendingDelete(pendingDelete),
    [setPendingDelete],
  );
  const handleSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const newTask = useMemo(() => {
    const req = new Task();
    req.setTimeDue(timestamp());
    req.setStatusId(1); // New
    req.setPriorityId(2); // Normal
    req.setBillableType(OPTION_BLANK);
    return { ...req.toObject(), assignedTechnicians: '' };
  }, []);
  const statusesMap: { [key: number]: string } = useMemo(
    () =>
      statuses.reduce(
        (aggr, { id, description }) => ({ ...aggr, [id]: description }),
        {},
      ),
    [statuses],
  );
  const prioritiesMap: { [key: number]: string } = useMemo(
    () =>
      priorities.reduce(
        (aggr, { id, description }) => ({ ...aggr, [id]: description }),
        {},
      ),
    [priorities],
  );
  const statusOptions = useMemo(
    () =>
      statuses.map(({ id, description }) => ({
        value: id,
        label: description,
        color: PROJECT_TASK_STATUS_COLORS[id],
      })),
    [statuses],
  );
  const priorityOptions = useMemo(
    () =>
      priorities.map(({ id, description }) => ({
        value: id,
        label: description,
        icon: PROJECT_TASK_PRIORITY_ICONS[id],
      })),
    [priorities],
  );
  const typeTitle = useMemo(() => {
    if (externalCode === 'customers') return 'Customer';
    if (externalCode === 'employee') return 'Employee';
    if (externalCode === 'properties') return 'Property';
    return '';
  }, [externalCode]);
  const SCHEMA_TASK: Schema<TaskEdit> = [
    [{ name: 'id', type: 'hidden' }],
    [
      {
        name: 'billableType',
        label: 'Task type',
        options: [OPTION_BLANK, ...billableTypes],
      },
    ],
    [
      {
        name: 'billable',
        label: 'Billable?',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'referenceNumber',
        label:
          pendingEdit && pendingEdit.billableType === 'Parts Run'
            ? 'Job / Reference #'
            : 'Reference #',
      },
    ],
    ...(pendingEdit &&
    ['Spiff', 'Tool Purchase'].includes(pendingEdit.billableType || '')
      ? []
      : [
          [
            {
              name: 'timeDue',
              label: 'Time Due',
              type: 'datetime',
            } as SchemaProps<TaskEdit>,
          ],
        ]),
    ...(pendingEdit && pendingEdit.billableType === 'Parts Run'
      ? [
          [
            {
              name: 'address',
              label: 'Destination',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'orderNum',
              label: 'Order #',
            } as SchemaProps<TaskEdit>,
          ],
        ]
      : []),
    [
      {
        name: 'briefDescription',
        label: 'Brief Description',
        multiline: true,
      },
    ],
    ...(pendingEdit &&
    ['Spiff', 'Tool Purchase'].includes(pendingEdit.billableType || '')
      ? []
      : [
          [
            {
              name: 'details',
              label: 'Details',
              multiline: true,
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'notes',
              label: 'Notes',
              multiline: true,
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'statusId',
              label: 'Status',
              options: statusOptions,
              required: true,
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'priorityId',
              label: 'Proprity',
              options: priorityOptions,
              required: true,
            } as SchemaProps<TaskEdit>,
          ],
        ]),
    ...(pendingEdit && pendingEdit.billableType === 'Flat Rate'
      ? [
          [
            {
              name: 'flatRate',
              label: 'Flat Rate',
              startAdornment: '$',
            } as SchemaProps<TaskEdit>,
          ],
        ]
      : []),
    ...(pendingEdit && pendingEdit.billableType === 'Hourly'
      ? [
          [
            {
              name: 'hourlyStart',
              label: 'Time Start',
              type: 'datetime',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'hourlyEnd',
              label: 'Time End',
              type: 'datetime',
            } as SchemaProps<TaskEdit>,
          ],
        ]
      : []),
    ...(pendingEdit &&
    ['Spiff', 'Tool Purchase'].includes(pendingEdit.billableType || '')
      ? []
      : [
          [
            {
              name: 'assignedTechnicians',
              label: 'Task Assignments(s)',
              type: 'technicians',
              // required: true, // FIXME
            } as SchemaProps<TaskEdit>,
          ],
        ]),
    ...(pendingEdit && pendingEdit.billableType === 'Spiff'
      ? [
          [
            {
              name: 'spiffAmount',
              label: 'Spiff Amount',
              type: 'number',
              startAdornment: '$',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'spiffJobNumber',
              label: 'Job #',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'datePerformed',
              label: 'Date Performed',
              type: 'date',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'spiffToolId',
              label: 'Spiff Type',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'spiffAddress',
              label: 'Address',
              multiline: true,
            } as SchemaProps<TaskEdit>,
          ],
        ]
      : []),
    ...(pendingEdit && pendingEdit.billableType === 'Tool Purchase'
      ? [
          [
            {
              name: 'toolpurchaseDate',
              label: 'Purchase Date',
              type: 'date',
            } as SchemaProps<TaskEdit>,
          ],
          [
            {
              name: 'toolpurchaseCost',
              label: 'Tool Cost',
              type: 'number',
              startAdornment: '$',
            } as SchemaProps<TaskEdit>,
          ],
        ]
      : []),
  ];
  const SCHEMA_SEARCH: Schema<TaskEdit> = [
    [
      {
        name: 'referenceNumber',
        label: 'Reference #',
        type: 'search',
      },
      {
        name: 'priorityId',
        label: 'Proprity',
        options: [{ label: OPTION_ALL, value: 0 }, ...priorityOptions],
      },
      {
        name: 'briefDescription',
        label: 'Description',
        type: 'search',
      },
      {
        name: 'statusId',
        label: 'Status',
        options: [{ label: OPTION_ALL, value: 0 }, ...statusOptions],
        actions: [{ label: 'Search', onClick: handleSearch }],
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
  return (
    <>
      <div>
        <SectionBar
          title={`${typeTitle} Tasks`}
          actions={
            [
              {
                label: 'Add Task',
                onClick: handleSetPendingEdit(newTask),
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
            onChangePage: handlePageChange,
          }}
        />
        <PlainForm schema={SCHEMA_SEARCH} data={search} onChange={setSearch} />
        <InfoTable
          columns={COLUMNS}
          data={
            loading || loadingInit
              ? makeFakeRows(7, 5)
              : tasks.map(task => {
                  const {
                    id,
                    referenceNumber,
                    priorityId,
                    briefDescription,
                    statusId,
                    timeCreated,
                    timeDue,
                  } = task;
                  return [
                    { value: id },
                    { value: referenceNumber },
                    { value: prioritiesMap[priorityId] },
                    { value: briefDescription },
                    { value: statusesMap[statusId] },
                    { value: formatDateTime(timeCreated) },
                    {
                      value: formatDateTime(timeDue),
                      actions: [
                        <IconButton
                          key="edit"
                          size="small"
                          onClick={handleSetPendingEdit({
                            ...task,
                            assignedTechnicians: '',
                          })} // FIXME
                        >
                          <EditIcon />
                        </IconButton>,
                        <IconButton
                          key="delete"
                          size="small"
                          onClick={handleSetPendingDelete(task)}
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
        <Modal open onClose={handleSetPendingEdit()}>
          <Form
            key={formKey}
            title={`${pendingEdit.id ? 'Edit' : 'Add'} ${typeTitle} Task`}
            onClose={handleSetPendingEdit()}
            onSave={handleSave}
            onChange={setPendingEdit}
            schema={SCHEMA_TASK}
            data={pendingEdit}
            disabled={saving}
          />
        </Modal>
      )}
      {pendingDelete && (
        <ConfirmDelete
          open
          onClose={handleSetPendingDelete()}
          kind={`${typeTitle} Task`}
          name={`${pendingDelete.id}`}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};
