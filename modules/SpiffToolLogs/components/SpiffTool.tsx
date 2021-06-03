import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { TaskClient, Task } from '@kalos-core/kalos-rpc/Task';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Tooltip } from '../../ComponentsLibrary/Tooltip';
import { Modal } from '../../ComponentsLibrary/Modal';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { Option } from '../../ComponentsLibrary/Field';
import { Link } from '../../ComponentsLibrary/Link';
import { ConfirmDelete } from '../../ComponentsLibrary/ConfirmDelete';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { PlainForm } from '../../ComponentsLibrary/PlainForm';
import { Confirm } from '../../ComponentsLibrary/Confirm';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import {
  SpiffToolLogEdit,
  getStatusFormInit,
} from '../../ComponentsLibrary/SpiffToolLogEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { SpiffToolAdminAction } from '@kalos-core/kalos-rpc/SpiffToolAdminAction';
import {
  getRPCFields,
  timestamp,
  formatDate,
  makeFakeRows,
  trailingZero,
  getWeekOptions,
  escapeText,
  formatDay,
  makeLast12MonthsOptions,
  TaskType,
  UserType,
  SpiffTypeType,
  SpiffToolAdminActionType,
  TaskEventDataType,
  UserClientService,
  formatWeek,
  EventClientService,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, OPTION_ALL } from '../../../constants';
import './spiffTool.less';
import { Payroll, RoleType } from '../../ComponentsLibrary/Payroll';
import { PropLinkServiceClient } from '@kalos-core/kalos-rpc/compiled-protos/prop_link_pb_service';
import { PermissionGroup } from '@kalos-core/kalos-rpc/compiled-protos/user_pb';

const TaskClientService = new TaskClient(ENDPOINT);

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
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

export interface Props {
  type: 'Spiff' | 'Tool';
  loggedUserId: number;
  kind?: string;
  week?: string;
  ownerId?: number;
  needsManagerAction?: boolean;
  needsPayrollAction?: boolean;
  needsAuditAction?: boolean;
  option?: string;
  role?: string;
  toggle: boolean;
  onClose?: () => void;
}

export const SpiffTool: FC<Props> = ({
  type,
  loggedUserId,
  ownerId,
  option,
  kind = option === WEEKLY ? WEEKLY : MONTHLY,
  week,
  needsManagerAction,
  needsPayrollAction,
  needsAuditAction,
  role,
  toggle,
  onClose,
}) => {
  const WEEK_OPTIONS =
    kind === WEEKLY ? getWeekOptions(52, 0, -1) : getWeekOptions();
  if (week && !WEEK_OPTIONS.map(({ value }) => value).includes(week)) {
    WEEK_OPTIONS.push({ label: formatWeek(week), value: week });
  }
  const MONTHS_OPTIONS: Option[] = makeLast12MonthsOptions(true);
  const getSearchFormInit = useCallback(
    () => ({
      description: '',
      month:
        week || (MONTHS_OPTIONS[MONTHS_OPTIONS.length - 1].value as string),
      kind,
      technician: ownerId || loggedUserId,
    }),
    [MONTHS_OPTIONS, kind, ownerId, week, loggedUserId],
  );
  const [loaded, setLoaded] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<TaskType>();
  const [extendedEditing, setExtendedEditing] = useState<TaskType>();
  const [deleting, setDeleting] = useState<TaskType>();
  const [loggedInUser, setLoggedInUser] = useState<UserType>();
  const [entries, setEntries] = useState<TaskType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [departments, setDepartments] = useState<PermissionGroup.AsObject[]>();
  const [page, setPage] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const [technicians, setTechnicians] = useState<UserType[]>([]);
  const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
  const [spiffTypes, setSpiffTypes] = useState<SpiffTypeType[]>([]);
  const [payrollOpen, setPayrollOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<RoleType>();
  const [pendingPayroll, setPendingPayroll] = useState<TaskType>();
  const [pendingPayrollReject, setPendingPayrollReject] = useState<TaskType>();
  const [pendingAudit, setPendingAudit] = useState<TaskType>();

  const [
    serviceCallEditing,
    setServiceCallEditing,
  ] = useState<TaskEventDataType>();
  const [unlinkedSpiffJobNumber, setUnlinkedSpiffJobNumber] = useState<string>(
    '',
  );
  const [
    statusEditing,
    setStatusEditing,
  ] = useState<SpiffToolAdminActionType>();
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
    console.log(loggedUserId);
    const userResult = await UserClientService.loadUserById(loggedUserId);
    const tempRole = userResult.permissionGroupsList.find(
      p => p.type === 'role',
    );
    const tempDepartments = userResult.permissionGroupsList.filter(
      p => p.type === 'department',
    );
    if (tempRole != undefined) {
      setUserRole(tempRole.name as RoleType);
    }
    if (tempDepartments) {
      setDepartments(tempDepartments);
    }
    setLoggedInUser(loggedInUser);
    setSearchFormKey(searchFormKey + 1);
  }, [
    loggedUserId,
    setLoggedInUser,
    searchFormKey,
    setSearchFormKey,
    loggedInUser,
  ]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (type === 'Spiff' && spiffTypes.length === 0) {
        const { resultsList: spiffTypes } = (
          await TaskClientService.GetSpiffTypes()
        ).toObject();
        setSpiffTypes(spiffTypes);
      }

      const { description, month, kind, technician } = searchForm;
      const req = new Task();
      req.setPageNumber(page);
      req.setIsActive(true);
      req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
      req.setOrderDir('DESC');
      if (needsManagerAction) {
        req.setFieldMaskList(['AdminActionId']);
      }
      if (needsPayrollAction && toggle == false) {
        console.log('we want to see things that are not processed');
        req.setAdminActionId(0);
        req.setPayrollProcessed(true);
        req.setNotEqualsList(['AdminActionId', 'PayrollProcessed']);
        //req.setFieldMaskList(['PayrollProcessed']);
        const action = new SpiffToolAdminAction();
        action.setStatus(1);
        req.setSearchAction(action);
      }
      if (needsPayrollAction && toggle == true) {
        console.log('we want to see stuff we have done');
        req.setPayrollProcessed(false);
        req.setNotEqualsList(['PayrollProcessed']);
      }
      if (needsAuditAction) {
        req.setNotEqualsList(['AdminActionId']);
        req.setFieldMaskList(['NeedsAuditing']);
        req.setNeedsAuditing(true);
        const action = new SpiffToolAdminAction();
        action.setStatus(1);
        req.setSearchAction(action);
      }
      if (technician) {
        req.setExternalId(technician);
      }
      req.setBillableType(type === 'Spiff' ? 'Spiff' : 'Tool Purchase');
      if (description !== '') {
        req.setBriefDescription(`%${description}%`);
      }
      //const action = new SpiffToolAdminAction();
      //action.setStatus(1);
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
      console.log(req);
      const res = await TaskClientService.BatchGet(req);
      const resultsList = res.getResultsList().map(el => el.toObject());
      const count = res.getTotalCount();
      setCount(count);
      setEntries(resultsList);
      setLoading(false);
      return resultsList;
    } catch (err) {
      console.log(err);
    }
  }, [
    setEntries,
    setLoading,
    setCount,
    page,
    searchForm,
    type,
    setSpiffTypes,
    spiffTypes,
    needsManagerAction,
    needsPayrollAction,
    needsAuditAction,
    toggle,
  ]);
  const loadUserTechnicians = useCallback(async () => {
    const technicians = await UserClientService.loadTechnicians();
    setTechnicians(technicians);
  }, [setTechnicians]);
  const handleSetPayrollOpen = useCallback(
    (open: boolean) => setPayrollOpen(open),
    [setPayrollOpen],
  );
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handlePendingPayrollToggle = useCallback(
    (task?: TaskType) => () => setPendingPayroll(task),
    [setPendingPayroll],
  );
  const handlePendingPayrollToggleReject = useCallback(
    (task?: TaskType) => () => setPendingPayrollReject(task),
    [setPendingPayrollReject],
  );
  const handlePendingAuditToggle = useCallback(
    (task?: TaskType) => () => setPendingAudit(task),
    [setPendingAudit],
  );
  const handleSetExtendedEditing = useCallback(
    (extendedEditing?: TaskType) => async () => {
      setExtendedEditing(extendedEditing);
      setStatusEditing(undefined);
    },
    [setExtendedEditing, setStatusEditing],
  );
  const handleSetEditing = useCallback(
    (editing?: TaskType) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: TaskType) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const { id } = pendingPayroll;
      setLoading(true);
      setPendingPayroll(undefined);
      const t = new Task();
      t.setPayrollProcessed(true);
      t.setId(id);
      t.setFieldMaskList(['PayrollProcessed']);
      await TaskClientService.Update(t);
      load();
    }
  }, [load, pendingPayroll]);
  const handlePayrollReject = useCallback(async () => {
    if (pendingPayrollReject) {
      const { id } = pendingPayrollReject;
      setLoading(true);
      setPendingPayroll(undefined);
      const t = new Task();
      t.setPayrollProcessed(false);
      t.setId(id);
      t.setAdminActionId(0);
      //rest of implementation, do we handle the Rejection in the joined table?
      t.setFieldMaskList(['PayrollProcessed', 'AdminActionId']);
      await TaskClientService.Update(t);
      load();
    }
  }, [load, pendingPayrollReject]);
  const handleAudit = useCallback(async () => {
    if (pendingAudit) {
      const { id } = pendingAudit;
      setLoading(true);
      setPendingAudit(undefined);
      const t = new Task();
      t.setId(id);
      t.setNeedsAuditing(false);
      t.setFieldMaskList(['NeedsAuditing']);
      await TaskClientService.Update(t);
      load();
    }
  }, [load, pendingAudit]);
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
          req.setCreatorUserId(loggedUserId);
          req.setBillableType('Spiff');
          req.setStatusId(1);
          req.setAdminActionId(0);
          let tempEvent = await EventClientService.LoadEventByServiceCallID(
            parseInt(data.spiffJobNumber),
          );
          req.setSpiffAddress(
            tempEvent.property ? tempEvent.property?.address : '',
          );
          data.spiffJobNumber = tempEvent.logJobNumber;
          req.setSpiffJobNumber(data.spiffJobNumber);

          fieldMaskList.push(
            'TimeCreated',
            'TimeDue',
            'PriorityId',
            'ExternalCode',
            'ExternalId',
            'CreatorUserId',
            'BillableType',
            'SpiffJobNumber',
            'SpiffAddress',
            'AdminActionID',
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
    [loggedUserId, editing, setSaving, setEditing, type, load],
  );
  const handleSaveExtended = useCallback(async () => {
    if (extendedEditing) {
      setExtendedEditing(undefined);
      setLoaded(false);
    }
  }, [extendedEditing, setExtendedEditing, setLoaded]);
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
    [searchForm, setSearchFormKey, searchFormKey, MONTHS_OPTIONS, WEEK_OPTIONS],
  );
  const handleMakeSearch = useCallback(() => setLoaded(false), [setLoaded]);
  const handleResetSearch = useCallback(() => {
    setSearchForm(getSearchFormInit());
    setSearchFormKey(searchFormKey + 1);
    setLoaded(false);
  }, [
    setLoaded,
    setSearchForm,
    searchFormKey,
    setSearchFormKey,
    getSearchFormInit,
  ]);
  const reloadExtendedEditing = useCallback(async () => {
    if (extendedEditing) {
      const entries = await load();
      setExtendedEditing(entries.find(({ id }) => id === extendedEditing.id));
    }
  }, [extendedEditing, load, setExtendedEditing]);
  const handleClickAddStatus = useCallback(
    (entry: TaskType) => () => {
      handleSetExtendedEditing(entry)();
      setStatusEditing(getStatusFormInit(+STATUSES[0].value));
    },
    [setStatusEditing, handleSetExtendedEditing],
  );
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
  const handleOpenServiceCall = useCallback(
    (entry: TaskType) => (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      e.preventDefault();
      const { event } = entry;
      if (!event) return;
      setServiceCallEditing(event);
    },
    [setServiceCallEditing],
  );
  const handleUnsetServiceCallEditing = useCallback(
    () => setServiceCallEditing(undefined),
    [setServiceCallEditing],
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
  const isAdmin = loggedInUser && !!loggedInUser.isAdmin; // FIXME isSpiffAdmin correct?
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      loadLoggedInUser();
      load();
    }
    if ((isAdmin || userRole === 'Manager') && !loadedTechnicians) {
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
    load,
    userRole,
    loadLoggedInUser,
  ]);
  const SCHEMA: Schema<TaskType> =
    type === 'Spiff'
      ? [
          [
            {
              name: 'externalId',
              label: 'Technician',
              type: 'technician',
              disabled: role != 'Manager' ? true : false,
            },
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
            { name: 'spiffJobNumber', label: 'Job Number', required: true },
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
  const COLUMNS: Columns = [
    { name: 'Claim Date' },
    { name: `${type === 'Spiff' ? 'Spiff' : 'Tool'} ID #` },
    { name: type === 'Spiff' ? 'Spiff' : 'Tool' },
    ...(type === 'Spiff' ? [{ name: 'Job Date' }] : []),
    { name: 'Technician' },
    { name: type === 'Spiff' ? 'Job #' : 'Reference #' },
    { name: 'Status' },
    { name: 'Processed Date' },
    { name: 'Amount' },
    ...(type === 'Spiff' ? [{ name: 'Duplicates' }] : []),
  ];
  const renderStatus = (status: number) => (
    <div className="SpiffToolLogStatus">
      <div
        className="SpiffToolLogStatusColor"
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
          payrollProcessed,
          referenceNumber,
          actionsList,
          event,
          ownerName,
          duplicatesList,
          adminActionId,
        } = entry;
        const isDuplicate =
          duplicatesList.filter(({ actionsList }) => actionsList.length > 0)
            .length > 0;
        const technicianValue = (
          <Link onClick={handleClickTechnician(+externalId)}>{ownerName}</Link>
        );
        const actions = isAdmin
          ? [
              needsManagerAction ? (
                <IconButton
                  key={2}
                  size="small"
                  onClick={handleClickAddStatus(entry)}
                  disabled={actionsList[0] && actionsList[0].status === 1}
                >
                  <ThumbsUpDownIcon />
                </IconButton>
              ) : (
                <React.Fragment />
              ),
              <IconButton
                key={0}
                size="small"
                onClick={handleSetExtendedEditing(entry)}
              >
                <EditIcon />
              </IconButton>,
              needsPayrollAction ? (
                <IconButton
                  key={3}
                  size="small"
                  onClick={handlePendingPayrollToggle(entry)}
                >
                  <AccountBalanceWalletIcon />
                </IconButton>
              ) : (
                <React.Fragment />
              ),
              needsPayrollAction ? (
                <IconButton
                  key={3}
                  size="small"
                  onClick={handlePendingPayrollToggleReject(entry)}
                >
                  <NotInterestedIcon />
                </IconButton>
              ) : (
                <React.Fragment />
              ),
              needsAuditAction ? (
                <IconButton
                  key={3}
                  size="small"
                  onClick={handlePendingAuditToggle(entry)}
                >
                  <RateReviewIcon />
                </IconButton>
              ) : (
                <React.Fragment />
              ),
              role != 'Payroll' && role != 'Auditor' ? (
                <IconButton
                  key={1}
                  size="small"
                  onClick={handleSetDeleting(entry)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : (
                <React.Fragment />
              ),
            ]
          : [
              <IconButton key={0} size="small">
                <SearchIcon />
              </IconButton>,
            ];
        return [
          {
            value: formatDate(timeDue),
            onClick: handleSetExtendedEditing(entry),
          },
          { value: spiffToolId, onClick: handleSetExtendedEditing(entry) },
          {
            value: `${
              type === 'Spiff' ? `${SPIFF_EXT[spiffTypeId] || ''} ` : ''
            }${briefDescription}`,
            onClick: handleSetExtendedEditing(entry),
          },
          ...(type === 'Spiff'
            ? [
                {
                  value: formatDate(datePerformed),
                  onClick: handleSetExtendedEditing(entry),
                },
              ]
            : []),
          {
            value: isAdmin ? technicianValue : ownerName,
            onClick: handleSetExtendedEditing(entry),
          },
          {
            value:
              type === 'Spiff' ? (
                event && event.id ? (
                  <Link onClick={handleOpenServiceCall(entry)}>
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
          {
            value: renderActionsList(actionsList),
            onClick: handleSetExtendedEditing(entry),
          },
          {
            value:
              actionsList.length === 0
                ? 'No Action Taken '
                : formatDate(actionsList[0].dateProcessed) === '1/1/1'
                ? 'Not Processed'
                : formatDate(actionsList[0].dateProcessed),
          },
          {
            value: '$' + (type === 'Spiff' ? spiffAmount : toolpurchaseCost),
            onClick: handleSetExtendedEditing(entry),
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
                        classes={{ root: 'SpiffToolLogDuplicateIcon' }}
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
  return (
    <div>
      {payrollOpen && (
        <Modal
          open={true}
          onClose={() => handleSetPayrollOpen(false)}
          fullScreen
        >
          <SectionBar
            title={'Process Payroll'}
            actions={[
              {
                label: 'Close',
                onClick: () => handleSetPayrollOpen(false),
              },
            ]}
            fixedActions
          />
          <Payroll userID={loggedUserId}></Payroll>
        </Modal>
      )}
      <SectionBar
        title={type === 'Spiff' ? 'Spiff Report' : 'Tool Purchases'}
        actions={
          role === 'Manager' || role !== 'Payroll'
            ? [
                {
                  label: 'Add Spiff',
                  onClick: handleSetEditing(makeNewTask()),
                },
                // {
                //   label: 'Process Payroll',
                //   onClick: () => handleSetPayrollOpen(true),
                // },
                ...(onClose
                  ? [
                      {
                        label: 'Close',
                        onClick: onClose,
                      },
                    ]
                  : []),
              ]
            : [
                /*
                {
                  label: 'Add',
                  onClick: handleSetEditing(makeNewTask()),
                },
                */
                ...(onClose
                  ? [
                      {
                        label: 'Close',
                        onClick: onClose,
                      },
                    ]
                  : []),
              ]
        }
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
        <Modal open onClose={handleSetExtendedEditing()} fullScreen>
          <SpiffToolLogEdit
            onClose={handleSetExtendedEditing()}
            data={extendedEditing}
            loading={loading}
            userId={ownerId}
            loggedUserId={loggedUserId}
            onSave={handleSaveExtended}
            onStatusChange={reloadExtendedEditing}
            type={type}
            statusEditing={statusEditing}
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
      {unlinkedSpiffJobNumber !== '' && (
        <Modal open onClose={handleClearUnlinkedSpiffJobNumber}>
          <SectionBar
            title="Invalid Job #"
            actions={[
              { label: 'Close', onClick: handleClearUnlinkedSpiffJobNumber },
            ]}
            fixedActions
          />
          <div className="SpiffToolLogUnlinked">
            Job # <strong>{unlinkedSpiffJobNumber}</strong> does not appear to
            be connected to a valid Service Call.
          </div>
        </Modal>
      )}
      {serviceCallEditing && (
        <Modal open onClose={handleUnsetServiceCallEditing} fullScreen>
          <ServiceCall
            loggedUserId={loggedUserId}
            serviceCallId={serviceCallEditing.id}
            onClose={handleUnsetServiceCallEditing}
            propertyId={serviceCallEditing.propertyId}
            userID={serviceCallEditing.customerId}
          />
        </Modal>
      )}
      {pendingPayroll && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingPayrollToggle()}
          onConfirm={handlePayroll}
        >
          Are you sure you want to process payroll for this Spiff/Tool?
        </Confirm>
      )}
      {pendingPayrollReject && (
        <Confirm
          title="Confirm Reject"
          open
          onClose={handlePendingPayrollToggleReject()}
          onConfirm={handlePayrollReject}
        >
          Are you sure you want to process payroll for this Spiff/Tool?
        </Confirm>
      )}
      {pendingAudit && (
        <Confirm
          title="Confirm Approve"
          open
          onClose={handlePendingAuditToggle()}
          onConfirm={handleAudit}
        >
          Are you sure you want complete Auditing for this Spiff/Tool?
        </Confirm>
      )}
    </div>
  );
};
