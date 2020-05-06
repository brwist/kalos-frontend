import React, { FC, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionClient,
} from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { SpiffType as SpiffTypeRpc } from '@kalos-core/kalos-rpc/compiled-protos/task_pb';
import { User } from '@kalos-core/kalos-rpc/User';
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
  { label: 'Approved', value: 1, color: 'green' },
  { label: 'Not Approved', value: 2, color: 'red' },
  { label: 'Revoked', value: 3, color: 'lightgray' },
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
}));

export const SpiffTool: FC<Props> = ({ type, loggedUserId }) => {
  const classes = useStyles();
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
  const [statusEditing, setStatusEditing] = useState<
    SpiffToolAdminActionType
  >();
  const [statusDeleting, setStatusDeleting] = useState<
    SpiffToolAdminActionType
  >();
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(
    ({ type, id: value }) => ({ label: escapeText(type), value }),
  );
  const SPIFF_EXT: { [key: number]: string } = spiffTypes.reduce(
    (aggr, { id, ext }) => ({ ...aggr, [id]: ext }),
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
        } = entry;
        const isDuplicate = false;
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
                    <IconButton size="small">
                      <FlagIcon />
                    </IconButton>
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
