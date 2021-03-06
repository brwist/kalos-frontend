import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { TaskClient, Task } from '../../../@kalos-core/kalos-rpc/Task';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import ThumbsUpDownIcon from '@material-ui/icons/ThumbsUpDown';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import Alert from '@material-ui/lab/Alert';
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
import { Loader } from '../../Loader/main';
import {
  SpiffToolLogEdit,
  getStatusFormInit,
} from '../../ComponentsLibrary/SpiffToolLogEdit';
import { ServiceCall } from '../../ComponentsLibrary/ServiceCall';
import { SpiffToolAdminAction } from '../../../@kalos-core/kalos-rpc/SpiffToolAdminAction';
import { User } from '../../../@kalos-core/kalos-rpc/User';
import { SpiffType, TaskEventData } from '../../../@kalos-core/kalos-rpc/Task';

import {
  timestamp,
  formatDate,
  makeFakeRows,
  trailingZero,
  getWeekOptions,
  escapeText,
  formatDay,
  makeLast12MonthsOptions,
  UserClientService,
  formatWeek,
  EventClientService,
  makeSafeFormObject,
  usd,
} from '../../../helpers';
import { ENDPOINT, ROWS_PER_PAGE, OPTION_ALL } from '../../../constants';
import { RoleType } from '../../ComponentsLibrary/Payroll';
import { PermissionGroup } from '../../../@kalos-core/kalos-rpc/compiled-protos/user_pb';
import './SpiffTool.module.less';

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
  disableActions?: boolean;
  option?: string;
  role?: string;
  toggle?: boolean;
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
  disableActions,
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
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [toolBalance, setToolBalance] = useState<number>(0);
  const [editing, setEditing] = useState<Task>();
  const [extendedEditing, setExtendedEditing] = useState<Task>();
  const [reassign, setReassign] = useState<Task>();
  const [deleting, setDeleting] = useState<Task>();
  const [loggedInUser, setLoggedInUser] = useState<User>();
  const [entries, setEntries] = useState<Task[]>([]);
  const [count, setCount] = useState<number>(0);
  const [departments, setDepartments] = useState<PermissionGroup[]>();
  const [page, setPage] = useState<number>(0);
  const [userId, setUserId] = useState<number>(
    ownerId ? ownerId : loggedUserId,
  );
  const [searchForm, setSearchForm] = useState<SearchType>(getSearchFormInit());
  const [searchFormKey, setSearchFormKey] = useState<number>(0);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loadedTechnicians, setLoadedTechnicians] = useState<boolean>(false);
  const [spiffTypes, setSpiffTypes] = useState<SpiffType[]>([]);
  const [payrollOpen, setPayrollOpen] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<RoleType>();
  const [pendingPayroll, setPendingPayroll] = useState<Task>();
  const [pendingPayrollReject, setPendingPayrollReject] = useState<Task>();
  const [pendingAudit, setPendingAudit] = useState<Task>();
  const [pendingAdd, setPendingAdd] = useState<boolean>(false);

  const [serviceCallEditing, setServiceCallEditing] = useState<TaskEventData>();
  const [unlinkedSpiffJobNumber, setUnlinkedSpiffJobNumber] =
    useState<string>('');
  const [statusEditing, setStatusEditing] = useState<SpiffToolAdminAction>();
  const SPIFF_TYPES_OPTIONS: Option[] = spiffTypes.map(type => ({
    label: escapeText(type.getType()),
    value: type.getId(),
  }));
  const handleToggleAdd = useCallback(
    () => setPendingAdd(!pendingAdd),
    [pendingAdd],
  );
  const SPIFF_EXT: { [key: number]: string } = spiffTypes.reduce(
    (aggr, id) => ({ ...aggr, [id.getId()]: id.getExt() }),
    {},
  );
  const SPIFF_TYPE: { [key: number]: string } = spiffTypes.reduce(
    (aggr, id) => ({ ...aggr, [id.getId()]: id.getType() }),
    {},
  );
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (type === 'Spiff' && spiffTypes.length === 0) {
        const spiffTypes = (
          await TaskClientService.GetSpiffTypes()
        ).getResultsList();
        setSpiffTypes(spiffTypes);
      }

      const { description, month, kind, technician } = searchForm;
      const balance = await TaskClientService.GetToolFundBalanceByID(
        technician,
      );
      setToolBalance(balance.getValue());
      console.log('data given to request', searchForm);
      const req = new Task();
      req.setPageNumber(page);
      req.setIsActive(true);
      req.setOrderBy(type === 'Spiff' ? 'date_performed' : 'time_due');
      req.setOrderDir('DESC');
      if (needsManagerAction && toggle == false) {
        //req.setAdminActionId(0);
        req.setFieldMaskList(['AdminActionId']);
        req.setPayrollProcessed(true);
        req.setNotEqualsList(['PayrollProcessed']);
      }
      if (needsManagerAction && toggle == true) {
        req.setAdminActionId(0);
        req.addNotEquals('AdminActionId');
      }
      if (needsPayrollAction && toggle == false) {
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
        setUserId(technician);
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
      const resultsList = res.getResultsList();
      const count = res.getTotalCount();
      setCount(count);
      setEntries(resultsList);
      setLoading(false);

      return resultsList;
    } catch (err) {
      console.log(err);
      setLoading(false);
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
  const loadLoggedInUser = useCallback(async () => {
    const userResult = await UserClientService.loadUserById(loggedUserId);
    const tempRole = userResult
      .getPermissionGroupsList()
      .find(p => p.getType() === 'role');
    if (
      loggedUserId != userId &&
      tempRole?.getName() != 'Manager' &&
      tempRole?.getName() != 'Payroll'
    ) {
      setShowAlert(true);
      setLoading(false);
      console.log('no permission');
      return;
    }
    const tempDepartments = userResult
      .getPermissionGroupsList()
      .filter(p => p.getType() === 'department');
    if (tempRole != undefined) {
      setUserRole(tempRole.getName() as RoleType);
    }
    if (tempDepartments) {
      setDepartments(tempDepartments);
    }

    setLoggedInUser(loggedInUser);
    setSearchFormKey(searchFormKey + 1);
    load();
  }, [
    loggedUserId,
    setLoggedInUser,
    searchFormKey,
    userId,
    setSearchFormKey,
    loggedInUser,
    load,
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
    (task?: Task) => () => setPendingPayroll(task),
    [setPendingPayroll],
  );
  const handlePendingPayrollToggleReject = useCallback(
    (task?: Task) => () => setPendingPayrollReject(task),
    [setPendingPayrollReject],
  );
  const handlePendingAuditToggle = useCallback(
    (task?: Task) => () => setPendingAudit(task),
    [setPendingAudit],
  );
  const handleSetExtendedEditing = useCallback(
    (extendedEditing?: Task) => async () => {
      setExtendedEditing(extendedEditing);
      setStatusEditing(undefined);
    },
    [setExtendedEditing, setStatusEditing],
  );
  const handleSetReassign = useCallback(
    (reassign?: Task) => () => {
      setReassign(reassign);
    },
    [setReassign],
  );
  const handleSetEditing = useCallback(
    (editing?: Task) => () => setEditing(editing),
    [setEditing],
  );
  const handleSetDeleting = useCallback(
    (deleting?: Task) => () => setDeleting(deleting),
    [setDeleting],
  );
  const handlePayroll = useCallback(async () => {
    if (pendingPayroll) {
      const id = pendingPayroll.getId();
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
      const id = pendingPayrollReject?.getId();
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
      const id = pendingAudit.getId();
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
      req.setId(deleting.getId());
      setDeleting(undefined);
      await TaskClientService.Delete(req);
      setLoading(false);
      await load();
    }
  }, [deleting, setLoading, setDeleting, load]);
  const handleSave = useCallback(
    async (data: Task) => {
      if (editing) {
        setSaving(true);
        const temp = makeSafeFormObject(data, new Task());
        const now = timestamp();
        const isNew = !editing.getId();
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
            parseInt(temp.getSpiffJobNumber()),
          );
          req.setSpiffAddress(
            tempEvent.getProperty() !== undefined
              ? tempEvent.getProperty()!.getAddress()
              : '',
          );
          temp.setSpiffJobNumber(tempEvent.getLogJobNumber());
          req.setSpiffJobNumber(temp.getSpiffJobNumber());

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
        await TaskClientService[isNew ? 'Create' : 'Update'](req);
        setSaving(false);
        setEditing(undefined);
        await load();
      }
    },
    [loggedUserId, editing, setSaving, setEditing, type, load],
  );
  const handleSaveNewToolAllowance = useCallback(
    async (data: Task) => {
      setSaving(true);
      const now = timestamp();
      const req = makeSafeFormObject(data, new Task());
      req.setTimeCreated(now);
      req.setTimeDue(now);
      req.setPriorityId(2);
      req.setSpiffToolId('');
      req.setExternalCode('user');
      req.setCreatorUserId(loggedUserId);
      req.setBillableType('Tool Allowance');
      req.setStatusId(1);
      req.setAdminActionId(0);
      req.addFieldMask('AdminActionId');
      req.setFieldMaskList([]);
      const res = await TaskClientService.Create(req);
      /*
      const id = res.getId();
      const updateReq = new Task();
      updateReq.setId(id);
      updateReq.setFieldMaskList(['AdminActionId']);
      updateReq.setAdminActionId(0);
      await TaskClientService.Update(updateReq);
      */
      setSaving(false);
      setPendingAdd(false);
      await load();
    },
    [loggedUserId, load],
  );
  const handleSaveNewSpiff = useCallback(
    async (data: Task) => {
      setSaving(true);
      const now = timestamp();
      const req = makeSafeFormObject(data, new Task());
      req.setTimeCreated(now);
      req.setTimeDue(now);
      req.setPriorityId(2);
      req.setSpiffToolId('');

      req.setExternalCode('user');
      req.setCreatorUserId(loggedUserId);
      req.setBillableType('Spiff');
      req.setStatusId(1);
      //req.addFieldMask('AdminActionId');
      let tempEvent;
      if (req.getSpiffJobNumber() != '') {
        try {
          tempEvent = await EventClientService.LoadEventByServiceCallID(
            parseInt(req.getSpiffJobNumber()),
          );
          req.setSpiffAddress(
            tempEvent.getProperty()?.getAddress() === undefined
              ? tempEvent.getCustomer()?.getAddress() === undefined
                ? ''
                : tempEvent.getCustomer()!.getAddress()
              : tempEvent.getProperty()!.getAddress(),
          );

          req.setSpiffJobNumber(tempEvent.getLogJobNumber());
        } catch (err) {
          console.error(
            `An error occurred while loading event by server: ${err}`,
          );
        }
      }
      req.setFieldMaskList([]);
      const res = await TaskClientService.Create(req);
      const id = res.getId();
      const updateReq = new Task();
      updateReq.setId(id);
      updateReq.setFieldMaskList(['AdminActionId']);
      updateReq.setAdminActionId(0);
      await TaskClientService.Update(updateReq);
      setSaving(false);
      setPendingAdd(false);
      await load();
    },
    [loggedUserId, load],
  );
  const handleSaveExtended = useCallback(async () => {
    if (extendedEditing) {
      setExtendedEditing(undefined);
      setLoaded(false);
    }
  }, [extendedEditing, setExtendedEditing, setLoaded]);
  const handleSearchFormChange = useCallback(
    (form: SearchType) => {
      console.log('formdata', form);
      const isPeriodsChange = searchForm.kind !== form.kind;
      if (userRole != 'Manager') {
        form.technician = loggedUserId;
      }
      setSearchForm({
        ...form,
        ...(isPeriodsChange
          ? {
              month: (form.kind === MONTHLY
                ? MONTHS_OPTIONS[0]
                : WEEK_OPTIONS[0]
              ).value as string,
              technician: form.technician,
            }
          : {}),
      });
      if (isPeriodsChange) {
        setSearchFormKey(searchFormKey + 1);
      }
    },
    [
      searchForm,
      setSearchFormKey,
      loggedUserId,
      userRole,
      searchFormKey,
      MONTHS_OPTIONS,
      WEEK_OPTIONS,
    ],
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
      if (entries) {
        setExtendedEditing(
          entries.find(entry => entry.getId() === extendedEditing.getId()),
        );
      }
    }
  }, [extendedEditing, load, setExtendedEditing]);
  const handleClickAddStatus = useCallback(
    (entry: Task) => () => {
      handleSetExtendedEditing(entry)();
      setStatusEditing(getStatusFormInit(+STATUSES[0].value));
    },
    [setStatusEditing, handleSetExtendedEditing],
  );
  const handleClickTechnician = useCallback(
    (technician: number) =>
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
    (entry: Task) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      const event = entry.getEvent();
      if (!event) return;
      setServiceCallEditing(event);
    },
    [setServiceCallEditing],
  );
  const handleOpenServiceCallOld =
    (entry: Task) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      const taskEvent = entry.getEvent();
      console.log('we called the window');
      if (taskEvent) {
        const url = `https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall&id=${taskEvent.getId()}&user_id=${
          taskEvent?.getCustomerId() ? taskEvent.getCustomerId() : 0
        }&property_id=${taskEvent?.getPropertyId()}`;
        window.open(url);
      }
    };
  const handleChangeToolPurchaseOwner = async (
    entry: Task,
    newOwner: number,
  ) => {
    setSaving(true);
    entry.setCreatorUserId(loggedUserId);
    entry.setExternalId(newOwner);
    entry.setFieldMaskList(['ExternalId', 'CreatorUserId']);
    await TaskClientService.Update(entry);
    setReassign(undefined);
    setSaving(false);
    setLoaded(false);
  };
  const handleUnsetServiceCallEditing = useCallback(
    () => setServiceCallEditing(undefined),
    [setServiceCallEditing],
  );
  const handleClickSpiffJobNumber = useCallback(
    (spiffJobNumber: string) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
      setLoading(true);
      loadLoggedInUser();
    }
    if (
      (userRole == 'Manager' || userRole == 'Payroll') &&
      !loadedTechnicians
    ) {
      setLoadedTechnicians(true);
      loadUserTechnicians();
    }
  }, [
    loaded,
    setLoaded,
    loggedUserId,
    ownerId,
    loadedTechnicians,
    setLoadedTechnicians,
    loadUserTechnicians,
    load,
    userRole,
    loadLoggedInUser,
  ]);
  const actions = [];
  if (onClose != undefined) {
    actions.push({
      label: 'Close',
      onClick: onClose,
    });
  }
  if ((userRole == 'Manager' && type == 'Tool') || type == 'Spiff') {
    actions.push({
      label: type === 'Spiff' ? 'Spiff Apply' : 'Admin Add Tool Allowance',
      onClick: handleToggleAdd,
    });
  }
  const SCHEMA: Schema<Task> =
    type === 'Spiff'
      ? [
          [
            {
              name: 'getExternalId',
              label: 'Technician',
              type: 'technician',
              disabled: userRole != 'Manager' ? true : false,
            },
            {
              name: 'getTimeDue',
              label: 'Claim Date',
              readOnly: true,
              type: 'date',
            },
            {
              name: 'getSpiffAmount',
              label: 'Amount',
              startAdornment: '$',
              type: 'number',
              required: true,
            },
            {
              name: 'getSpiffJobNumber',
              label: 'Job #',
              type: 'eventId',
            },
            {
              name: 'getDatePerformed',
              label: 'Date Performed',
              type: 'date',
              required: true,
            },
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
            {
              name: 'getExternalId',
              label: 'Technician',
              type: 'technician',
              disabled: userRole != 'Manager' ? true : false,
            },
            {
              name: 'getTimeDue',
              label: 'Claim Date',
              readOnly: true,
              type: 'date',
            },
            {
              name: 'getToolpurchaseCost',
              label: 'Tool Allowance Amount',
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
              label: 'Tool Description',
              multiline: true,
            },
          ],
        ];

  const REASSIGN_SCHEMA: Schema<Task> = [
    [
      {
        name: 'getExternalId',
        label: 'Technician',
        type: 'technician',
        disabled: userRole != 'Manager' ? true : false,
      },
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
  const renderActionsList = (actionsList: SpiffToolAdminAction[]) => {
    if (actionsList.length === 0) return '';
    const status = actionsList[0].getStatus();
    const reason = actionsList[0].getReason();
    const reviewedBy = actionsList[0].getReviewedBy();

    //const { status, reason, reviewedBy } = actionsList[0];
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
    if (!userRole && userId) {
      newTask.setExternalId(userId);
    } else {
      newTask.setExternalId(loggedUserId);
    }
    return newTask;
  }, [type, SPIFF_TYPES_OPTIONS, userRole, userId, loggedUserId]);

  const data: Data = loading
    ? makeFakeRows(type === 'Spiff' ? 9 : 7, 3)
    : entries.map(entry => {
        const isDuplicate =
          entry
            .getDuplicatesList()
            .filter(dupe => dupe.getActionsList().length > 0).length > 0;
        const technicianValue = (
          <Link onClick={handleClickTechnician(+entry.getExternalId())}>
            {entry.getOwnerName()}
          </Link>
        );
        let actions =
          userRole && !disableActions
            ? [
                needsManagerAction ? (
                  <IconButton
                    key={1}
                    size="small"
                    onClick={handleClickAddStatus(entry)}
                    disabled={
                      entry.getActionsList()[0] &&
                      entry.getActionsList()[0].getStatus() === 1
                    }
                  >
                    <ThumbsUpDownIcon />
                  </IconButton>
                ) : (
                  <React.Fragment />
                ),
                <IconButton
                  key={2}
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
                    key={4}
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
                    key={5}
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
                    key={6}
                    disabled={entry.getActionsList()[0] ? true : false}
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
                <IconButton
                  key={0}
                  size="small"
                  disabled={type == 'Tool' ? true : false}
                  onClick={handleSetExtendedEditing(entry)}
                >
                  <SearchIcon />
                </IconButton>,
                <IconButton
                  key={6}
                  disabled={entry.getActionsList()[0] ? true : false}
                  size="small"
                  onClick={handleSetDeleting(entry)}
                >
                  <DeleteIcon />
                </IconButton>,
              ];
        if (disableActions || type == 'Tool') {
          actions = [];
        }
        if (disableActions || (type == 'Tool' && userRole == 'Manager')) {
          actions = [
            <IconButton
              key={'reassignButton'}
              size="small"
              onClick={handleSetReassign(entry)}
            >
              <EditIcon />
            </IconButton>,
          ];
        }
        return [
          {
            value: formatDate(entry.getTimeDue()),
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
          },
          {
            value: entry.getSpiffToolId(),
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
          },
          {
            value: `${
              type === 'Spiff'
                ? `${SPIFF_EXT[entry.getSpiffTypeId()] || ''} `
                : ''
            }${entry.getBriefDescription()}`,
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
          },
          ...(type === 'Spiff'
            ? [
                {
                  value: formatDate(entry.getDatePerformed()),
                  onClick: disableActions
                    ? undefined
                    : handleSetExtendedEditing(entry),
                },
              ]
            : []),
          {
            value: userRole ? technicianValue : entry.getOwnerName(),
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
          },
          {
            value:
              type === 'Spiff' ? (
                entry.getEvent() && entry.getEvent()!.getId() ? (
                  <Link
                    onClick={handleOpenServiceCallOld(entry)}
                    key={entry.getSpiffJobNumber()}
                  >
                    {entry.getSpiffJobNumber()}
                  </Link>
                ) : (
                  <Link
                    onClick={handleClickSpiffJobNumber(
                      entry.getSpiffJobNumber(),
                    )}
                  >
                    {entry.getSpiffJobNumber()}
                  </Link>
                )
              ) : (
                entry.getReferenceNumber()
              ),
          },
          {
            value: renderActionsList(entry.getActionsList()),
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
          },
          {
            value:
              entry.getActionsList().length === 0
                ? 'No Action Taken '
                : formatDate(entry.getActionsList()[0].getDateProcessed()) ===
                    '1/1/1' && entry.getPayrollProcessed() == true
                ? 'Processed, no Date'
                : formatDate(entry.getActionsList()[0].getDateProcessed()) ===
                    '1/1/1' && entry.getPayrollProcessed() == false
                ? 'Not Processed'
                : formatDate(entry.getActionsList()[0].getDateProcessed()),
          },
          {
            value:
              '$' +
              (type === 'Spiff'
                ? entry.getSpiffAmount()
                : entry.getToolpurchaseCost()),
            onClick: disableActions
              ? undefined
              : handleSetExtendedEditing(entry),
            actions: type === 'Spiff' ? [] : actions,
          },
          ...(type === 'Spiff'
            ? [
                {
                  value: isDuplicate ? (
                    <Tooltip
                      content={
                        <>
                          {entry
                            .getDuplicatesList()
                            .filter(
                              actions => actions.getActionsList().length > 0,
                            )
                            .map(idx => (
                              <div key={idx.getId()}>
                                {/*idx !== 0 && <hr />}*/}
                                <strong>Tech Name: </strong>
                                {idx.getOwnerName()}
                                <br />
                                <strong>Spiff: </strong>
                                {SPIFF_TYPE[idx.getSpiffTypeId()]}
                                <br />
                                <strong>Reviewed By: </strong>
                                {idx
                                  .getActionsList()[0]
                                  .getReviewedBy()
                                  .toUpperCase()}
                                <br />
                                <strong>Reason: </strong>
                                {idx.getActionsList()[0].getReason() ===
                                undefined
                                  ? 'No Reason'
                                  : idx.getActionsList()[0].getReason()}
                                <br />
                                <strong>Date Claimed: </strong>
                                {formatDay(idx.getTimeDue())}{' '}
                                {formatDate(idx.getTimeDue())}
                              </div>
                            ))}
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
        label: `Search ${type === 'Spiff' ? 'Spiffs' : `Tool Purchases`}`,
      },
      ...(userRole == 'Manager'
        ? [
            {
              name: 'technician' as const,

              label: 'Technician',
              options: [
                ...technicians.map(tech => ({
                  label: `${tech.getFirstname()} ${tech.getLastname()}`,
                  value: tech.getId(),
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
  return !loading ? (
    !showAlert ? (
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
          </Modal>
        )}
        <SectionBar
          title={type === 'Spiff' ? 'Spiff Report' : `Tool Purchases `}
          subtitle={
            type == 'Spiff' ? '' : `Current Balance: ${usd(toolBalance)}`
          }
          actions={actions}
          loading={loading}
          fixedActions
          pagination={{
            count,
            page,
            rowsPerPage: ROWS_PER_PAGE,
            onPageChange: handleChangePage,
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
            <Form<Task>
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
              role={userRole != undefined ? userRole : ''}
              loading={loading}
              userId={extendedEditing.getExternalId()}
              loggedUserId={loggedUserId}
              onSave={handleSaveExtended}
              onStatusChange={reloadExtendedEditing}
              type={type}
              statusEditing={statusEditing}
            />
          </Modal>
        )}
        {reassign && (
          <Modal key="reassignModal" open onClose={handleSetReassign}>
            <Form<Task>
              key="reassignForm"
              title={'Reassign Tool Purchase'}
              schema={REASSIGN_SCHEMA}
              onClose={handleSetReassign()}
              data={reassign}
              onSave={data => {
                handleChangeToolPurchaseOwner(
                  reassign,
                  makeSafeFormObject(data, new Task()).getExternalId(),
                );
                handleSetReassign();
              }}
              disabled={saving}
            />
          </Modal>
        )}
        {deleting && (
          <ConfirmDelete
            open
            kind={type === 'Spiff' ? 'Spiff' : 'Tool Request'}
            name={deleting.getBriefDescription()}
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
              serviceCallId={serviceCallEditing.getId()}
              onClose={handleUnsetServiceCallEditing}
              propertyId={serviceCallEditing.getPropertyId()}
              userID={serviceCallEditing.getCustomerId()}
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
        {pendingAdd && (
          <Modal open onClose={handleToggleAdd}>
            <Form<Task>
              title={
                type === 'Spiff' ? 'Add Spiff Request' : 'Add Tool Purchase'
              }
              schema={SCHEMA}
              onClose={handleToggleAdd}
              data={makeNewTask()}
              onSave={
                type == 'Spiff'
                  ? handleSaveNewSpiff
                  : handleSaveNewToolAllowance
              }
              disabled={saving}
            />
          </Modal>
        )}
      </div>
    ) : (
      <Alert severity="error">
        You don&apos;t have permission to view this Log
      </Alert>
    )
  ) : (
    <Loader></Loader>
  );
};
