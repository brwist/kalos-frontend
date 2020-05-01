import React, { FC, useState, useEffect, useCallback } from 'react';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionClient,
} from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { User } from '@kalos-core/kalos-rpc/User';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
  loadUserById,
  loadUsersByIds,
  trailingZero,
  getWeekOptions,
  loadSpiffToolAdminActionsByTaskId,
  loadTechnicians,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, MONTHS } from '../../../constants';

const TaskClientService = new TaskClient(ENDPOINT);
const SpiffToolAdminActionClientService = new SpiffToolAdminActionClient(
  ENDPOINT,
);

const ALL = '-- All --';
const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const WEEK_OPTIONS = getWeekOptions();
const STATUSES: Option[] = [
  { label: 'Approved', value: 1 },
  { label: 'Not Approved', value: 2 },
  { label: 'Revoked', value: 3 },
];
const STATUS_TXT: { [key: number]: string } = STATUSES.reduce(
  (aggr, { label, value }) => ({ ...aggr, [value]: label }),
  {},
);

type TaskType = Task.AsObject;
type UserType = User.AsObject;
type SpiffToolAdminActionType = SpiffToolAdminAction.AsObject;
type SearchType = {
  description: string;
  month: string;
  kind: string;
  technician: number;
};

export interface Props {
  type: 'Spiff' | 'Tool';
  loggedUserId: number;
}

const SPIFF_TYPES: Option[] = [
  { label: 'ACJM - A/C Job Manager 1', value: 1 },
  { label: 'ACIN - A/C Install 2', value: 2 },
  { label: 'CNCT - PM Contract / Contract Lead 3', value: 3 },
  { label: 'CMSN - Commission 4', value: 4 },
  { label: 'OUTO - Out of Town 5', value: 5 },
  { label: 'PRMA - PM 6', value: 6 },
  { label: 'PHJM - P/H Job Manager 7', value: 7 },
  { label: 'PHIN - P/H Install 8', value: 8 },
  { label: 'UNCT - Uncategorized 10', value: 10 },
  { label: 'AIRU - Air Knight or UV Light Sales 14', value: 14 },
  { label: 'FITY - Infinity Air Purifier Sale 15', value: 15 },
  { label: 'SWAY - Prop Mngr PM Cnct Lead 16', value: 16 },
  { label: 'CIND - Contract Creation Spiff 17', value: 17 },
  { label: 'BENT - System Sales Commission 18', value: 18 },
  { label: 'ACLD - AC Sale Lead 19', value: 19 },
  { label: 'ROCK - Quoted Repairs Spiff 20', value: 20 },
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

const STATUSES_COLUMNS: Columns = [
  { name: 'Date' },
  { name: 'Reviewed By' },
  { name: 'Status' },
  { name: 'Reason' },
  { name: '' },
];

export const SpiffTool: FC<Props> = ({ type, loggedUserId }) => {
  const today = new Date();
  const currMonth = today.getMonth() + 1;
  const MONTHS_OPTIONS: Option[] = [
    { label: ALL, value: ALL },
    ...MONTHS.slice(currMonth).map((month, idx) => ({
      label: `${month}, ${today.getFullYear() - 1}`,
      value: `${today.getFullYear() - 1}-${trailingZero(
        currMonth + idx + 1,
      )}-%`,
    })),
    ...MONTHS.slice(0, currMonth).map((month, idx) => ({
      label: `${month}, ${today.getFullYear()}`,
      value: `${today.getFullYear()}-${trailingZero(idx + 1)}-%`,
    })),
  ].reverse();
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
  const [users, setUsers] = useState<{ [key: number]: UserType }>({});
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const [statuses, setStatuses] = useState<SpiffToolAdminActionType[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState<boolean>(false);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
  const [statusEditing, setStatusEditing] = useState<
    SpiffToolAdminActionType
  >();
  const [statusDeleting, setStatusDeleting] = useState<
    SpiffToolAdminActionType
  >();
  const loadLoggedInUser = useCallback(async () => {
    const loggedInUser = await loadUserById(loggedUserId);
    setLoggedInUser(loggedInUser);
    setSearchFormKey(searchFormKey + 1);
  }, [loggedUserId, setLoggedInUser, searchFormKey, setSearchFormKey]);
  const isAdmin = loggedInUser && !!loggedInUser.isAdmin; // FIXME isSpiffAdmin correct?
  const load = useCallback(async () => {
    setLoading(true);
    const { description, month, kind, technician } = searchForm;
    const req = new Task();
    req.setPageNumber(page);
    req.setIsActive(1);
    if (technician) {
      req.setExternalId(technician.toString());
    }
    req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
    if (description !== '') {
      req.setBriefDescription(`%${description}%`);
    }
    if (kind === MONTHLY) {
      if (month !== ALL) {
        req.setDatePerformed(month);
      }
    } else {
      const [y, m, d] = month.split('-');
      const n = new Date(+y, +m - 1, +d + 7);
      const ltDate = `${n.getFullYear()}-${trailingZero(
        n.getMonth() + 1,
      )}-${trailingZero(n.getDate())}`;
      req.setDateRangeList(['>=', month, '<', ltDate]);
    }
    const { resultsList, totalCount: count } = (
      await TaskClientService.BatchGet(req)
    ).toObject();
    const userIds = resultsList.map(({ externalId }) => +externalId);
    const users = await loadUsersByIds(userIds);
    setCount(count);
    setUsers(users);
    setEntries(resultsList);
    setLoading(false);
  }, [setEntries, setLoading, setUsers, setCount, page, searchForm, type]);
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
  const loadStatuses = useCallback(
    async (taskId: number) => {
      setLoadingStatuses(true);
      const statuses = await loadSpiffToolAdminActionsByTaskId(taskId);
      setStatuses(statuses);
      setLoadingStatuses(false);
    },
    [setLoadingStatuses, setStatuses],
  );
  const handleSetExtendedEditing = useCallback(
    (extendedEditing?: TaskType) => async () => {
      setExtendedEditing(extendedEditing);
      if (extendedEditing) {
        loadStatuses(extendedEditing.id);
      }
    },
    [setExtendedEditing, loadStatuses],
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
          req.setDatePerformed(now);
          req.setToolpurchaseDate(now);
          req.setPriorityId(2);
          req.setExternalCode('user');
          req.setExternalId(loggedUserId.toString());
          req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
          req.setReferenceNumber('');
          req.setToolpurchaseCost(0);
          req.setStatusId(1);
          fieldMaskList.push(
            'TimeCreated',
            'TimeDue',
            'DatePerformed',
            'ToolpurchaseDate',
            'PriorityId',
            'ExternalCode',
            'ExternalId',
            'BillableType',
            'ReferenceNumber',
          );
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
        await SpiffToolAdminActionClientService[isNew ? 'Create' : 'Update'](
          req,
        );
        setLoadingStatuses(true);
        loadStatuses(taskId);
      }
    },
    [extendedEditing, setStatusEditing, statusEditing],
  );
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
  const handleDeleteStatus = useCallback(async () => {
    if (extendedEditing && statusDeleting) {
      const req = new SpiffToolAdminAction();
      req.setId(statusDeleting.id);
      setStatusDeleting(undefined);
      setLoadingStatuses(true);
      await SpiffToolAdminActionClientService.Delete(req);
      loadStatuses(extendedEditing.id);
    }
  }, [
    statusDeleting,
    setStatusDeleting,
    setLoadingStatuses,
    loadStatuses,
    extendedEditing,
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
              options: SPIFF_TYPES,
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
          [
            { name: 'spiffJobNumber', label: 'Job #' },
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
              options: SPIFF_TYPES,
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
    { name: 'Job #' },
    { name: 'Status' },
    { name: 'Amount' },
    { name: 'Duplicates' },
  ];
  const newTask = new Task();
  newTask.setTimeDue(timestamp());
  newTask.setDatePerformed(timestamp());
  newTask.setToolpurchaseDate(timestamp());
  newTask.setSpiffTypeId(+SPIFF_TYPES[0].value);
  const data: Data = loading
    ? makeFakeRows(type === 'Spiff' ? 9 : 8, 3)
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
        } = entry;
        const technician = users[+externalId];
        const isDuplicate = false;
        return [
          { value: formatDate(timeDue) },
          { value: spiffToolId },
          { value: briefDescription },
          ...(type === 'Spiff' ? [{ value: formatDate(datePerformed) }] : []),
          {
            value: technician
              ? `${technician.firstname} ${technician.lastname}`
              : '',
          },
          { value: spiffJobNumber }, // TODO: Link
          { value: '' }, // TODO
          { value: '$' + (type === 'Spiff' ? spiffAmount : toolpurchaseCost) },
          {
            value: isDuplicate ? (
              <IconButton size="small">
                <FlagIcon />
              </IconButton>
            ) : (
              ''
            ),
            actions: isAdmin
              ? [
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
                ],
          }, // FIXME
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
                { label: ALL, value: 0 },
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
  const statusesData: Data = loadingStatuses
    ? makeFakeRows(5, 3)
    : statuses.map(entry => {
        const { decisionDate, reviewedBy, status, reason } = entry;
        return [
          { value: formatDate(decisionDate) },
          { value: reviewedBy },
          { value: STATUS_TXT[status] },
          { value: reason },
          {
            value: '',
            actions: [
              <IconButton
                key={0}
                size="small"
                onClick={handleSetStatusEditing(entry)}
              >
                <EditIcon />
              </IconButton>,
              <IconButton
                key={1}
                size="small"
                onClick={handleSetStatusDeleting(entry)}
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
        actions={[
          { label: 'Add', onClick: handleSetEditing(newTask.toObject()) },
        ]}
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
              },
            ]}
            fixedActions
          />
          <InfoTable
            columns={STATUSES_COLUMNS}
            data={statusesData}
            loading={loadingStatuses}
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
    </div>
  );
};
