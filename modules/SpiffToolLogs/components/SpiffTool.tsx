import React, { FC, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import {
  SpiffToolAdminAction,
  SpiffToolAdminActionClient,
} from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { User } from '@kalos-core/kalos-rpc/User';
import { Event } from '@kalos-core/kalos-rpc/Event';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
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
  loadUsersByIds,
  trailingZero,
  getWeekOptions,
  loadSpiffToolAdminActionsByTaskId,
  loadTechnicians,
  loadEventsByJobOrContractNumbers,
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
type EventType = Event.AsObject;
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

const SPIFF_TYPES = [
  { ext: 'ACJM', label: 'ACJM - A/C Job Manager', value: 1 },
  { ext: 'ACIN', label: 'ACIN - A/C Install', value: 2 },
  { ext: 'CNCT', label: 'CNCT - PM Contract / Contract Lead', value: 3 },
  { ext: 'CMSN', label: 'CMSN - Commission', value: 4 },
  { ext: 'OUTO', label: 'OUTO - Out of Town', value: 5 },
  { ext: 'PRMA', label: 'PRMA - PM', value: 6 },
  { ext: 'PHJM', label: 'PHJM - P/H Job Manager', value: 7 },
  { ext: 'PHIN', label: 'PHIN - P/H Install', value: 8 },
  { ext: 'UNCT', label: 'UNCT - Uncategorized', value: 10 },
  { ext: 'AIRU', label: 'AIRU - Air Knight or UV Light Sales', value: 14 },
  { ext: 'FITY', label: 'FITY - Infinity Air Purifier Sale', value: 15 },
  { ext: 'SWAY', label: 'SWAY - Prop Mngr PM Cnct Lead', value: 16 },
  { ext: 'CIND', label: 'CIND - Contract Creation Spiff', value: 17 },
  { ext: 'BENT', label: 'BENT - System Sales Commission', value: 18 },
  { ext: 'ACLD', label: 'ACLD - AC Sale Lead', value: 19 },
  { ext: 'ROCK', label: 'ROCK - Quoted Repairs Spiff', value: 20 },
];

const SPIFF_TYPES_OPTIONS: Option[] = SPIFF_TYPES.map(({ label, value }) => ({
  label,
  value,
}));

const SPIFF_EXT: { [key: number]: string } = SPIFF_TYPES.reduce(
  (aggr, { value, ext }) => ({ ...aggr, [value]: ext }),
  {},
);

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
  const [users, setUsers] = useState<{ [key: number]: UserType }>({});
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const [statuses, setStatuses] = useState<SpiffToolAdminActionType[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState<boolean>(false);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
  const [events, setEvents] = useState<{ [key: string]: EventType }>({});
  const [unlinkedSpiffJobNumber, setUnlinkedSpiffJobNumber] = useState<string>(
    '',
  );
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
    if (type === 'Spiff') {
      const refNumbers = resultsList.map(
        ({ spiffJobNumber }) => spiffJobNumber,
      );
      const newEvents = await loadEventsByJobOrContractNumbers(refNumbers);
      setEvents({ ...events, ...newEvents });
    }
    const users = await loadUsersByIds(userIds);
    setCount(count);
    setUsers(users);
    setEntries(resultsList);
    setLoading(false);
  }, [
    setEntries,
    setLoading,
    setUsers,
    setCount,
    page,
    searchForm,
    type,
    events,
    setEvents,
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
      const event = events[spiffJobNumber];
      if (event) {
        const url = [
          'https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall',
          `id=${event.id}`,
          `user_id=${event.customer?.id}`,
          `property_id=${event.propertyId}`,
        ].join('&');
        const win = window.open(url, '_blank');
        if (win) {
          win.focus();
        }
      } else {
        setUnlinkedSpiffJobNumber(spiffJobNumber);
      }
    },
    [events, setUnlinkedSpiffJobNumber],
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
    { name: 'Duplicates' },
  ];
  const newTask = new Task();
  newTask.setTimeDue(timestamp());
  newTask.setDatePerformed(timestamp());
  newTask.setToolpurchaseDate(timestamp());
  newTask.setSpiffTypeId(+SPIFF_TYPES_OPTIONS[0].value);
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
          spiffTypeId,
          referenceNumber,
        } = entry;
        const technician = users[+externalId];
        const isDuplicate = false;
        const technicianText = technician
          ? `${technician.firstname} ${technician.lastname.substr(0, 1)}.`
          : '';
        const technicianValue = (
          <Link onClick={handleClickTechnician(technician.id)}>
            {technicianText}
          </Link>
        );
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
            value: isAdmin ? technicianValue : technicianText,
          },
          {
            value:
              type === 'Spiff' ? (
                <Link onClick={handleClickSpiffJobNumber(spiffJobNumber)}>
                  {spiffJobNumber}
                </Link>
              ) : (
                referenceNumber
              ),
          }, // TODO: Link
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
