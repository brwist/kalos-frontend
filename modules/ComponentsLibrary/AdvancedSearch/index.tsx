import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { User } from '@kalos-core/kalos-rpc/User';
import cloneDeep from 'lodash/cloneDeep';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core';
import { ActionsProps } from '../Actions';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { InfoTable, Columns, Data } from '../InfoTable';
import { ServiceCall } from '../ServiceCall';
import { ConfirmDelete } from '../ConfirmDelete';
import { Modal } from '../Modal';
import { CustomerInformation } from '../CustomerInformation';
import { CustomerEdit } from '../CustomerEdit';
import { PropertyEdit } from '../PropertyEdit';
import { PropertyInfo } from '../../PropertyInformation/components/PropertyInfo';
import { CustomerDetails } from '../../CustomerDetails/components/CustomerDetails';
import { AddServiceCall } from '../../AddServiceCallGeneral/components/AddServiceCall';
import { PrintHeader } from '../PrintHeader';
import { PrintTable } from '../PrintTable';
import { EmployeeDepartments } from '../EmployeeDepartments';
import { Form } from '../Form';
import {
  loadEventsByFilter,
  loadUsersByFilter,
  loadPropertiesByFilter,
  makeFakeRows,
  formatDate,
  getCustomerName,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
  getCustomerPhone,
  EventsFilter,
  EventsSort,
  LoadEventsByFilter,
  UsersFilter,
  UsersSort,
  LoadUsersByFilter,
  PropertiesFilter,
  PropertiesSort,
  LoadPropertiesByFilter,
  EventType,
  UserType,
  PropertyType,
  loadJobTypes,
  loadJobSubtypes,
  JobTypeType,
  JobSubtypeType,
  deleteEventById,
  deleteUserById,
  deletePropertyById,
  getBusinessName,
  getCustomerPhoneWithExt,
  TimesheetDepartmentType,
  loadTimesheetDepartments,
  getDepartmentName,
  loadUserById,
  saveUser,
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  EVENT_STATUS_LIST,
} from '../../../constants';
//@ts-ignore
import logoKalos from './kalos-logo-2019.png';

type Kind = 'serviceCalls' | 'customers' | 'properties' | 'employees';

export interface Props {
  loggedUserId: number;
  title: string;
  kinds: Kind[];
  deletableEvents?: boolean;
  editableCustomers?: boolean;
  deletableCustomers?: boolean;
  editableEmployees?: boolean;
  deletableEmployees?: boolean;
  printableEmployees?: boolean;
  editableProperties?: boolean;
  deletableProperties?: boolean;
  eventsWithAccounting?: boolean;
  eventsWithAdd?: boolean;
  onSelectEvent?: (event: EventType) => void;
  onClose?: () => void;
}

type SearchForm = (EventsFilter | UsersFilter | PropertiesFilter) & {
  kind: Kind;
};

const JOB_STATUS_OPTIONS: Option[] = [
  { label: OPTION_ALL, value: 0 },
  ...EVENT_STATUS_LIST.map(label => ({
    label,
    value: label,
  })),
];

const ACCOUNTING = 'Accounting';
const SERVICE = 'Service';

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const AdvancedSearch: FC<Props> = ({
  loggedUserId,
  title,
  kinds,
  deletableEvents,
  editableCustomers,
  deletableCustomers,
  editableEmployees,
  deletableEmployees,
  printableEmployees = false,
  editableProperties,
  deletableProperties,
  eventsWithAccounting = false,
  eventsWithAdd = false,
  onSelectEvent,
  onClose,
}) => {
  const classes = useStyles();
  const employeePrintRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState<number>(0);
  const [loadedDicts, setLoadedDicts] = useState<boolean>(false);
  const [loadingDicts, setLoadingDicts] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobTypeType[]>([]);
  const [jobSubtypes, setJobSubtypes] = useState<JobSubtypeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [accounting, setAccounting] = useState<boolean>(false);
  const defaultFilter: SearchForm = {
    kind: kinds[0],
    jobTypeId: 0,
    jobSubtypeId: 0,
    logJobStatus: '',
    employeeDepartmentId: -1,
  };
  const [filter, setFilter] = useState<SearchForm>(defaultFilter);
  const [formKey, setFormKey] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [eventsSort, setEventsSort] = useState<EventsSort>({
    orderByField: 'dateStarted',
    orderBy: 'date_started',
    orderDir: 'DESC',
  });
  const [usersSort, setUsersSort] = useState<UsersSort>({
    orderByField: 'lastname',
    orderBy: 'user_lastname',
    orderDir: 'ASC',
  });
  const [propertiesSort, setPropertiesSort] = useState<PropertiesSort>({
    orderByField: 'address',
    orderBy: 'property_address',
    orderDir: 'ASC',
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [pendingEventAdding, setPendingEventAdding] = useState<boolean>(false);
  const [pendingEventEditing, setPendingEventEditing] = useState<EventType>();
  const [pendingEventDeleting, setPendingEventDeleting] = useState<EventType>();
  const [pendingEmployeeViewing, setPendingEmployeeViewing] = useState<
    UserType
  >();
  const [pendingEmployeeEditing, setPendingEmployeeEditing] = useState<
    UserType
  >();
  const [pendingEmployeeDeleting, setPendingEmployeeDeleting] = useState<
    UserType
  >();
  const [pendingCustomerViewing, setPendingCustomerViewing] = useState<
    UserType
  >();
  const [pendingCustomerEditing, setPendingCustomerEditing] = useState<
    UserType
  >();
  const [pendingCustomerDeleting, setPendingCustomerDeleting] = useState<
    UserType
  >();
  const [pendingPropertyViewing, setPendingPropertyViewing] = useState<
    PropertyType
  >();
  const [pendingPropertyEditing, setPendingPropertyEditing] = useState<
    PropertyType
  >();
  const [pendingPropertyDeleting, setPendingPropertyDeleting] = useState<
    PropertyType
  >();
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [employeeDepartmentsOpen, setEmployeeDepartmentsOpen] = useState<
    boolean
  >(false);
  const loadDicts = useCallback(async () => {
    setLoadingDicts(true);
    const jobTypes = await loadJobTypes();
    setJobTypes(jobTypes);
    const jobSubtypes = await loadJobSubtypes();
    setJobSubtypes(jobSubtypes);
    setLoadingDicts(false);
    if (kinds.includes('employees')) {
      const departments = await loadTimesheetDepartments();
      setDepartments(departments);
      const loggedUser = await loadUserById(loggedUserId);
      setIsAdmin(loggedUser.isAdmin);
    }
    setFormKey(formKey + 1);
    setLoadedDicts(true);
  }, [
    setLoadingDicts,
    setJobTypes,
    setJobSubtypes,
    // setFormKey,
    formKey,
    kinds,
    setDepartments,
    setLoadedDicts,
    setIsAdmin,
  ]);
  const load = useCallback(async () => {
    setLoading(true);
    const { kind, ...filterCriteria } = filter;
    if (kind === 'serviceCalls') {
      const criteria: LoadEventsByFilter = {
        page,
        filter: filterCriteria,
        sort: eventsSort,
      };
      const { results, totalCount } = await loadEventsByFilter(criteria);
      setCount(totalCount);
      setEvents(results);
    }
    if (kind === 'customers' || kind === 'employees') {
      const criteria: LoadUsersByFilter = {
        page,
        filter: {
          ...filterCriteria,
          ...(kind === 'employees' ? { isEmployee: 1 } : {}),
        } as UsersFilter,
        sort: usersSort,
      };
      if (
        kind === 'customers' ||
        (filterCriteria as UsersFilter).employeeDepartmentId! < 0
      ) {
        delete criteria.filter.employeeDepartmentId;
      }
      const { results, totalCount } = await loadUsersByFilter(criteria);
      setCount(totalCount);
      setUsers(results);
    }
    if (kind === 'properties') {
      const criteria: LoadPropertiesByFilter = {
        page,
        filter: filterCriteria as PropertiesFilter,
        sort: propertiesSort,
      };
      //@ts-ignore
      delete criteria.filter.employeeDepartmentId;
      const { results, totalCount } = await loadPropertiesByFilter(criteria);
      setCount(totalCount);
      setProperties(results);
    }
    setLoading(false);
  }, [
    filter,
    page,
    setCount,
    setEvents,
    setUsers,
    setProperties,
    setLoading,
    eventsSort,
    usersSort,
    propertiesSort,
  ]);
  useEffect(() => {
    if (!loaded && loadedDicts) {
      setLoaded(true);
      load();
    }
    if (!loadedDicts) {
      loadDicts();
    }
  }, [loaded, setLoaded, load, loadedDicts, loadDicts]);
  const reload = useCallback(() => setLoaded(false), [setLoaded]);
  const handleEventsSortChange = useCallback(
    (sort: EventsSort) => () => {
      setEventsSort(sort);
      setPage(0);
      setLoaded(false);
    },
    [setEventsSort, setPage, setLoaded],
  );
  const handleUsersSortChange = useCallback(
    (sort: UsersSort) => () => {
      setUsersSort(sort);
      setPage(0);
      setLoaded(false);
    },
    [setUsersSort, setPage, setLoaded],
  );
  const handlePropertiesSortChange = useCallback(
    (sort: PropertiesSort) => () => {
      setPropertiesSort(sort);
      setPage(0);
      setLoaded(false);
    },
    [setPropertiesSort, setPage, setLoaded],
  );
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleLoad = useCallback(() => {
    setPage(0);
    setLoaded(false);
  }, [setLoaded]);
  const handleResetSearchForm = useCallback(() => {
    setFilter({
      ...defaultFilter,
      kind: filter.kind,
    });
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFilter, setLoaded, filter, formKey, setFormKey]);
  const handleFormChange = useCallback(
    (data: SearchForm) => {
      if (!data.kind) {
        setFilter({ ...defaultFilter, ...data });
      } else {
        const isTypeChanged = data.kind !== filter.kind;
        if (isTypeChanged) {
          setFilter({ kind: data.kind });
          setPage(0);
          setFormKey(formKey + 1);
          setLoaded(false);
        } else {
          setFilter(data);
        }
      }
    },
    [setFilter, filter, formKey, setFormKey, setLoaded, kinds],
  );
  const handlePendingEventAddingToggle = useCallback(
    (pendingEventAdding: boolean) => () =>
      setPendingEventAdding(pendingEventAdding),
    [setPendingEventAdding],
  );
  const handlePendingEventEditingToggle = useCallback(
    (pendingEventEditing?: EventType) => () =>
      setPendingEventEditing(pendingEventEditing),
    [setPendingEventEditing],
  );
  const handlePendingEventDeletingToggle = useCallback(
    (pendingEventDeleting?: EventType) => () =>
      setPendingEventDeleting(pendingEventDeleting),
    [setPendingEventDeleting],
  );
  const handleDeleteServiceCall = useCallback(async () => {
    if (pendingEventDeleting) {
      const { id } = pendingEventDeleting;
      setPendingEventDeleting(undefined);
      setLoading(true);
      await deleteEventById(id);
      setLoaded(false);
    }
  }, [pendingEventDeleting, setLoaded, setPendingEventDeleting, setLoading]);
  const handleDeleteCustomer = useCallback(async () => {
    if (pendingCustomerDeleting) {
      const { id } = pendingCustomerDeleting;
      setPendingCustomerDeleting(undefined);
      setLoading(true);
      await deleteUserById(id);
      setLoaded(false);
    }
  }, [
    pendingCustomerDeleting,
    setLoaded,
    setPendingCustomerDeleting,
    setLoading,
  ]);
  const handleDeleteEmployee = useCallback(async () => {
    if (pendingEmployeeDeleting) {
      const { id } = pendingEmployeeDeleting;
      setPendingEmployeeDeleting(undefined);
      setLoading(true);
      await deleteUserById(id);
      setLoaded(false);
    }
  }, [
    pendingEmployeeDeleting,
    setLoaded,
    setPendingEmployeeDeleting,
    setLoading,
  ]);
  const handleDeleteProperty = useCallback(async () => {
    if (pendingPropertyDeleting) {
      const { id } = pendingPropertyDeleting;
      setPendingPropertyDeleting(undefined);
      setLoading(true);
      await deletePropertyById(id);
      setLoaded(false);
    }
  }, [
    pendingPropertyDeleting,
    setLoaded,
    setPendingPropertyDeleting,
    setLoading,
  ]);
  const handlePendingEmployeeViewingToggle = useCallback(
    (pendingEmployeeViewing?: UserType) => () =>
      setPendingEmployeeViewing(pendingEmployeeViewing),
    [setPendingEmployeeViewing],
  );
  const handlePendingEmployeeEditingToggle = useCallback(
    (pendingEmployeeEditing?: UserType) => () =>
      setPendingEmployeeEditing(pendingEmployeeEditing),
    [setPendingEmployeeEditing],
  );
  const handlePendingEmployeeDeletingToggle = useCallback(
    (pendingEmployeeDeleting?: UserType) => () =>
      setPendingEmployeeDeleting(pendingEmployeeDeleting),
    [setPendingEmployeeDeleting],
  );
  const handlePendingCustomerViewingToggle = useCallback(
    (pendingCustomerViewing?: UserType) => () =>
      setPendingCustomerViewing(pendingCustomerViewing),
    [setPendingCustomerViewing],
  );
  const handlePendingCustomerEditingToggle = useCallback(
    (pendingCustomerEditing?: UserType) => () =>
      setPendingCustomerEditing(pendingCustomerEditing),
    [setPendingCustomerEditing],
  );
  const onSaveCustomer = useCallback(() => {
    setPendingCustomerEditing(undefined);
    setLoaded(false);
  }, [setPendingCustomerEditing, setLoaded]);
  const onSaveEmployee = useCallback(
    async (data: UserType) => {
      if (pendingEmployeeEditing) {
        setSaving(true);
        await saveUser(data, pendingEmployeeEditing.id);
        setPendingEmployeeEditing(undefined);
        setSaving(false);
        setLoaded(false);
      }
    },
    [setPendingEmployeeEditing, setLoaded, setSaving, pendingEmployeeEditing],
  );
  const handlePendingCustomerDeletingToggle = useCallback(
    (pendingCustomerDeleting?: UserType) => () =>
      setPendingCustomerDeleting(pendingCustomerDeleting),
    [setPendingCustomerDeleting],
  );
  const handlePendingPropertyViewingToggle = useCallback(
    (pendingPropertyViewing?: PropertyType) => () =>
      setPendingPropertyViewing(pendingPropertyViewing),
    [setPendingPropertyViewing],
  );
  const handlePendingPropertyEditingToggle = useCallback(
    (pendingPropertyEditing?: PropertyType) => () =>
      setPendingPropertyEditing(pendingPropertyEditing),
    [setPendingPropertyEditing],
  );
  const onSaveProperty = useCallback(() => {
    setPendingPropertyEditing(undefined);
    setLoaded(false);
  }, [setPendingPropertyEditing, setLoaded]);
  const handlePendingPropertyDeletingToggle = useCallback(
    (pendingPropertyDeleting?: PropertyType) => () =>
      setPendingPropertyDeleting(pendingPropertyDeleting),
    [setPendingPropertyDeleting],
  );
  const handleAccountingToggle = useCallback(() => setAccounting(!accounting), [
    accounting,
    setAccounting,
  ]);
  const handleSelectEvent = useCallback(
    (event: EventType) => () => {
      if (onSelectEvent) {
        onSelectEvent(event);
      }
      if (onClose) {
        onClose();
      }
    },
    [onSelectEvent, onClose],
  );
  const handlePrintEmployees = useReactToPrint({
    content: () => employeePrintRef.current,
    copyStyles: true,
  });
  const handleEmployeeDepartmentsOpenToggle = useCallback(
    (open: boolean) => () => setEmployeeDepartmentsOpen(open),
    [setEmployeeDepartmentsOpen],
  );
  const searchActions: ActionsProps = [
    {
      label: 'Reset',
      variant: 'outlined',
      onClick: handleResetSearchForm,
    },
    {
      label: 'Search',
      onClick: handleLoad,
    },
  ];
  const TYPES: Option[] = [
    ...(kinds.includes('serviceCalls')
      ? [{ label: 'Service Calls', value: 'serviceCalls' }]
      : []),
    ...(kinds.includes('customers')
      ? [{ label: 'Customers', value: 'customers' }]
      : []),
    ...(kinds.includes('employees')
      ? [{ label: 'Employees', value: 'employees' }]
      : []),
    ...(kinds.includes('properties')
      ? [{ label: 'Properties', value: 'properties' }]
      : []),
  ];
  const SCHEMA_KIND: Schema<SearchForm> = [
    [
      {
        name: 'kind',
        label: 'Search',
        options: TYPES,
      },
    ],
  ];
  const SCHEMA_EVENTS: Schema<EventsFilter> = [
    [
      {
        name: 'firstname',
        label: 'First Name',
        type: 'search',
      },
      {
        name: 'lastname',
        label: 'Last Name',
        type: 'search',
      },
      {
        name: 'businessname',
        label: 'Business Name',
        type: 'search',
      },
    ],
    [
      {
        name: 'logJobNumber',
        label: 'Job #',
        type: 'search',
      },
      {
        name: 'jobTypeId',
        label: 'Job Type',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...jobTypes.map(({ id: value, name: label }) => ({ label, value })),
        ],
      },
      {
        name: 'jobSubtypeId',
        label: 'Job Subtype',
        options: [
          { label: OPTION_ALL, value: 0 },
          ...jobSubtypes.map(({ id: value, name: label }) => ({
            label,
            value,
          })),
        ],
      },
      {
        name: 'logJobStatus',
        label: 'Job Status',
        options: JOB_STATUS_OPTIONS,
      },
    ],
    [
      {
        name: 'dateStarted',
        label: 'Date Started',
        type: 'date',
      },
      {
        name: 'address',
        label: 'Address',
        type: 'search',
      },
      {
        name: 'city',
        label: 'City',
        type: 'search',
      },
      {
        name: 'zip',
        label: 'Zip Code',
        type: 'search',
        actions: searchActions,
      },
    ],
  ];
  const SCHEMA_USERS: Schema<UsersFilter> = [
    [
      {
        name: 'firstname',
        label: 'First Name',
        type: 'search',
      },
      {
        name: 'lastname',
        label: 'Last Name',
        type: 'search',
      },
      {
        name: 'businessname',
        label: 'Business Name',
        type: 'search',
      },
    ],
    [
      {
        name: 'email',
        label: 'Email',
        type: 'search',
      },
      {
        name: 'phone',
        label: 'Primary Phone',
        type: 'search',
        actions: searchActions,
      },
    ],
  ];
  const SCHEMA_EMPLOYEES: Schema<UsersFilter> = [
    [
      {
        name: 'firstname',
        label: 'First Name',
        type: 'search',
      },
      {
        name: 'lastname',
        label: 'Last Name',
        type: 'search',
      },
      {
        name: 'employeeDepartmentId',
        label: 'Department',
        options: [
          { label: OPTION_ALL, value: -1 },
          ...departments.map(({ id, description, value }) => ({
            label: `${value} - ${description}`,
            value: id,
          })),
        ],
      },
      {
        name: 'empTitle',
        label: 'Title',
        type: 'search',
      },
    ],
    [
      {
        name: 'email',
        label: 'Email',
        type: 'search',
      },
      {
        name: 'cellphone',
        label: 'Cell',
        type: 'search',
      },
      {
        name: 'phone',
        label: 'Office',
        type: 'search',
      },
      {
        name: 'ext',
        label: 'Ext.',
        type: 'search',
        actions: searchActions,
      },
    ],
  ];
  const SCHEMA_EMPLOYEES_VIEW: Schema<UserType> = [
    [
      {
        name: 'email',
        label: 'Email',
        readOnly: true,
      },
    ],
    [
      {
        name: 'firstname',
        label: 'First Name',
        readOnly: true,
      },
    ],
    [
      {
        name: 'lastname',
        label: 'Last Name',
        readOnly: true,
      },
    ],
    [
      {
        name: 'phone',
        label: 'Phone',
        readOnly: true,
      },
    ],
    [
      {
        name: 'ext',
        label: 'Phone ext.',
        readOnly: true,
      },
    ],
    [
      {
        name: 'empTitle',
        label: 'Title',
        readOnly: true,
      },
    ],
    [
      {
        name: 'employeeDepartmentId',
        label: 'Department',
        options: [
          { label: OPTION_ALL, value: -1 },
          ...departments.map(({ id, description, value }) => ({
            label: `${value} - ${description}`,
            value: id,
          })),
        ],
        readOnly: true,
      },
    ],
  ];
  const SCHEMA_EMPLOYEES_EDIT: Schema<UserType> = [
    [{ name: 'isEmployee', type: 'hidden' }],
    [{ headline: true, label: 'Personal Details' }],
    [
      {
        name: 'firstname',
        label: 'First Name',
        required: true,
      },
      {
        name: 'lastname',
        label: 'Last Name',
        required: true,
      },
      {
        name: 'login',
        label: 'Login',
        required: true,
      },
      {
        name: 'pwd',
        label: 'Password',
        type: 'password',
        required: true,
      },
    ],
    [
      {
        name: 'address',
        label: 'Street Address',
        multiline: true,
      },
      {
        name: 'city',
        label: 'City',
      },
      {
        name: 'zip',
        label: 'Zipcode',
      },
      {
        name: 'state',
        label: 'State', // TODO options
      },
    ],
    [
      {
        name: 'empTitle',
        label: 'Title',
      },
      {
        name: 'id', // FIXME
        label: 'Hire Date',
      },
      {
        name: 'employeeFunctionId', // FIXME
        label: 'Employee Role',
      },
      {
        name: 'employeeDepartmentId',
        label: 'Employee Segment',
        options: departments.map(({ id, description, value }) => ({
          label: `${value} - ${description}`,
          value: id,
        })),
        required: true,
      },
    ],
    [
      {
        name: 'phone',
        label: 'Primary Phone',
      },
      {
        name: 'cellphone',
        label: 'Cell Phone',
      },
      {
        name: 'ext',
        label: 'Ext',
      },
      {
        name: 'toolFund',
        label: 'Tool Fund Allowance',
      },
    ],
    [
      {
        name: 'email',
        label: 'Email',
      },
      {
        name: 'phoneEmail',
        label: 'Email-to-SMS',
      },
      {},
      {},
    ],
    [{ headline: true, label: 'Employee Permission Details' }],
    [
      {
        name: 'serviceCalls',
        label: 'Runs Service Calls',
        type: 'checkbox',
      },
      {
        name: 'isAdmin',
        label: 'Admin Menu Rights',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME include_in_pdf_list
        label: 'Add To Directory PDF',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME user_pwreset
        label: 'Force P/W Reset',
        type: 'checkbox',
      },
      {
        name: 'paidServiceCallStatus',
        label: '"Paid" Service Call Status',
        type: 'checkbox',
      },
      {
        name: 'showBilling',
        label: 'Show billing to user',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME can_delete_serviceItem_photo
        label: 'Can delete service item photos',
        type: 'checkbox',
      },
      {
        name: 'isOfficeStaff',
        label: 'Office Staff',
        type: 'checkbox',
      },
      {
        name: 'isHvacTech',
        label: 'Hvac Tech',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME can_access_reports
        label: 'Access Reports',
        type: 'checkbox',
      },
      {
        name: 'techAssist',
        label: 'Tech Assist',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME edit_directory_view
        label: 'Edit Directory View',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME have_roo_btn_access
        label: 'Roo Button Access',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME can_approve_requestOff
        label: 'Review and Approve Requests Off',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME userStatus
        label: 'Activate User',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME userStatus
        label: 'Deactivate User',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME email_right
        label: 'Send Emails',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME timesheet_right
        label: 'Approve Time',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME tasks_right
        label: 'Handle Tasks',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME edit_right
        label: 'Manage Employees',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME delete_right
        label: 'Delete Customers',
        type: 'checkbox',
      },
    ],
    [{ headline: true, label: 'Kalos Special Features' }],
    [
      {
        name: 'isColorMute',
        label: 'Color Mute [2017]',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME admin_matrics
        label: 'Admin Metrics',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME tech_matrics
        label: 'Tech Metrics',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME install_matrics
        label: 'Install Metrics',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME garage_door_matrics
        label: 'Garage Door Metrics',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME refrigeration_matrics
        label: 'Refrigeration Metrics',
        type: 'checkbox',
      },
    ],
    [
      {
        name: 'isAdmin', // FIXME electrician_matrics
        label: 'Electrician Metrics',
        type: 'checkbox',
      },
      {},
      {},
    ],
    [{ headline: true, label: 'Paid Time-Off' }],
    [{}],
    [{ headline: true, label: 'Dispatch Mode Permission' }],
    [
      {
        name: 'isAdmin', // FIXME can_access_dispatch_mode
        label: 'Access Dispatch Mode',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME access_dismiss_employee
        label: 'Can Dismiss Employee',
        type: 'checkbox',
      },
      {
        name: 'isAdmin', // FIXME is_training_admin
        label: 'Training Admin',
        type: 'checkbox',
      },
    ],
    [{ headline: true, label: 'Photo' }],
  ];
  const SCHEMA_PROPERTIES: Schema<PropertiesFilter> = [
    [
      {
        name: 'subdivision',
        label: 'Subdivision',
        type: 'search',
      },
      {
        name: 'address',
        label: 'Address',
        type: 'search',
      },
      {
        name: 'city',
        label: 'City',
        type: 'search',
      },
      {
        name: 'zip',
        label: 'Zip Code',
        type: 'search',
        actions: searchActions,
      },
    ],
  ];
  const makeSchema = (schema: Schema<SearchForm>) => {
    const kindsAmount = SCHEMA_KIND[0][0].options?.length || 0;
    if (kindsAmount <= 1) return schema;
    const clonedSchema = cloneDeep(schema);
    clonedSchema[0].unshift(SCHEMA_KIND[0][0]);
    return clonedSchema;
  };
  const getSchema = useCallback(() => {
    const { kind } = filter;
    if (kind === 'serviceCalls')
      return makeSchema(SCHEMA_EVENTS as Schema<SearchForm>);
    if (kind === 'customers')
      return makeSchema(SCHEMA_USERS as Schema<SearchForm>);
    if (kind === 'employees')
      return makeSchema(SCHEMA_EMPLOYEES as Schema<SearchForm>);
    if (kind === 'properties')
      return makeSchema(SCHEMA_PROPERTIES as Schema<SearchForm>);
    return [];
  }, [filter, jobTypes, jobSubtypes]);
  const getColumns = (kind: Kind): Columns => {
    if (kind === 'serviceCalls')
      return accounting
        ? [
            {
              name: 'Date Started',
              ...(eventsSort.orderByField === 'dateStarted'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'dateStarted',
                orderBy: 'date_started',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            { name: 'Customer Name' },
            { name: 'Business Name' },
            { name: 'Address' },
            { name: 'City' },
            { name: 'Zip' },
            { name: 'Phone' },
            {
              name: 'Job #',
              ...(eventsSort.orderByField === 'logJobNumber'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'logJobNumber',
                orderBy: 'log_jobNumber',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Type',
              ...(eventsSort.orderByField === 'jobTypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'jobTypeId',
                orderBy: 'job_type_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Subtype',
              ...(eventsSort.orderByField === 'jobSubtypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'jobSubtypeId',
                orderBy: 'job_subtype_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
          ]
        : [
            {
              name: 'Date Started',
              ...(eventsSort.orderByField === 'dateStarted'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'dateStarted',
                orderBy: 'date_started',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            { name: 'Customer Name - Business Name' },
            { name: 'Address City Zip Phone' },
            {
              name: 'Job #',
              ...(eventsSort.orderByField === 'logJobNumber'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'logJobNumber',
                orderBy: 'log_jobNumber',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Type / Subtype',
              ...(eventsSort.orderByField === 'jobTypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'jobTypeId',
                orderBy: 'job_type_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Status',
              ...(eventsSort.orderByField === 'logJobStatus'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'logJobStatus',
                orderBy: 'log_jobStatus',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
          ];
    if (kind === 'customers')
      return [
        {
          name: 'First Name',
          ...(usersSort.orderByField === 'firstname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'firstname',
            orderBy: 'user_firstname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Last Name',
          ...(usersSort.orderByField === 'lastname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'lastname',
            orderBy: 'user_lastname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Business Name',
          ...(usersSort.orderByField === 'businessname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'businessname',
            orderBy: 'user_businessname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Primary Phone',
          ...(usersSort.orderByField === 'phone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'phone',
            orderBy: 'user_phone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Email',
          ...(usersSort.orderByField === 'email'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'email',
            orderBy: 'user_email',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        { name: '' },
      ];
    if (kind === 'employees')
      return [
        {
          name: 'Name',
          ...(usersSort.orderByField === 'lastname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'lastname',
            orderBy: 'user_lastname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Title',
          ...(usersSort.orderByField === 'businessname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'businessname',
            orderBy: 'user_businessname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Email',
          ...(usersSort.orderByField === 'email'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'email',
            orderBy: 'user_email',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Office, ext.',
          ...(usersSort.orderByField === 'phone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'phone',
            orderBy: 'user_phone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Cell',
          ...(usersSort.orderByField === 'cellphone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'cellphone',
            orderBy: 'user_cellphone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];
    if (kind === 'properties')
      return [
        {
          name: 'Address',
          ...(propertiesSort.orderByField === 'address'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'address',
            orderBy: 'property_address',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Subdivision',
          ...(propertiesSort.orderByField === 'subdivision'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'subdivision',
            orderBy: 'property_subdivision',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'City',
          ...(propertiesSort.orderByField === 'city'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'city',
            orderBy: 'property_City',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Zip Code',
          ...(propertiesSort.orderByField === 'zip'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'zip',
            orderBy: 'property_zip',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];
    return [];
  };
  const getData = useCallback((): Data => {
    const { kind } = filter;
    if (kind === 'serviceCalls')
      return loading || loadingDicts
        ? makeFakeRows(accounting ? 10 : 6, 3)
        : events.map(entry => {
            const {
              dateStarted,
              customer,
              property,
              logJobNumber,
              jobType,
              jobSubtype,
              logJobStatus,
            } = entry;
            const canceledStyle =
              !accounting && logJobStatus === 'Canceled'
                ? { color: 'red' }
                : {};
            return customer
              ? [
                  {
                    value: formatDate(dateStarted),
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                  },
                  {
                    value: accounting
                      ? getCustomerName(customer)
                      : getCustomerNameAndBusinessName(customer),
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                  },
                  ...(accounting
                    ? [
                        {
                          value: getBusinessName(customer),
                          onClick: onSelectEvent
                            ? handleSelectEvent(entry)
                            : undefined,
                        },
                      ]
                    : []),
                  {
                    value: accounting
                      ? property?.address || ''
                      : `${getPropertyAddress(property)} ${getCustomerPhone(
                          customer,
                        )}`,
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                  },
                  ...(accounting
                    ? [
                        {
                          value: property?.city || '',
                          onClick: onSelectEvent
                            ? handleSelectEvent(entry)
                            : undefined,
                        },
                      ]
                    : []),
                  ...(accounting
                    ? [
                        {
                          value: property?.zip || '',
                          onClick: onSelectEvent
                            ? handleSelectEvent(entry)
                            : undefined,
                        },
                      ]
                    : []),
                  ...(accounting
                    ? [
                        {
                          value: property?.phone || '',
                          onClick: onSelectEvent
                            ? handleSelectEvent(entry)
                            : undefined,
                        },
                      ]
                    : []),
                  {
                    value: (
                      <span style={canceledStyle}>
                        {accounting ? logJobNumber.substr(0, 8) : logJobNumber}
                      </span>
                    ),
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                  },
                  {
                    value: (
                      <span style={canceledStyle}>
                        {accounting ? jobType : `${jobType} / ${jobSubtype}`}
                      </span>
                    ),
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                  },
                  {
                    value: (
                      <span style={canceledStyle}>
                        {accounting ? jobSubtype : logJobStatus}
                      </span>
                    ),
                    onClick: onSelectEvent
                      ? handleSelectEvent(entry)
                      : undefined,
                    actions: [
                      ...(onSelectEvent
                        ? []
                        : [
                            <IconButton
                              key="edit"
                              size="small"
                              onClick={handlePendingEventEditingToggle(entry)}
                            >
                              <EditIcon />
                            </IconButton>,
                          ]),
                      ...(deletableEvents
                        ? [
                            <IconButton
                              key="delete"
                              size="small"
                              onClick={handlePendingEventDeletingToggle(entry)}
                            >
                              <DeleteIcon />
                            </IconButton>,
                          ]
                        : []),
                    ],
                  },
                ]
              : [];
          });
    if (kind === 'customers')
      return loading
        ? makeFakeRows(6, 3)
        : users.map(entry => {
            const { firstname, lastname, businessname, phone, email } = entry;
            return [
              { value: firstname },
              { value: lastname },
              { value: businessname },
              { value: phone },
              { value: email },
              {
                value: '',
                actions: [
                  <IconButton
                    key="view"
                    size="small"
                    onClick={handlePendingCustomerViewingToggle(entry)}
                  >
                    <SearchIcon />
                  </IconButton>,
                  ...(editableCustomers
                    ? [
                        <IconButton
                          key="edit"
                          size="small"
                          onClick={handlePendingCustomerEditingToggle(entry)}
                        >
                          <EditIcon />
                        </IconButton>,
                      ]
                    : []),
                  ...(deletableCustomers
                    ? [
                        <IconButton
                          key="delete"
                          size="small"
                          onClick={handlePendingCustomerDeletingToggle(entry)}
                        >
                          <DeleteIcon />
                        </IconButton>,
                      ]
                    : []),
                ],
              },
            ];
          });
    if (kind === 'employees')
      return loading
        ? makeFakeRows(5, 3)
        : users.map(entry => {
            const { empTitle, email, cellphone } = entry;
            return [
              { value: getCustomerName(entry) },
              { value: empTitle },
              { value: email },
              { value: getCustomerPhoneWithExt(entry) },
              {
                value: cellphone,
                actions: [
                  <IconButton
                    key="view"
                    size="small"
                    onClick={handlePendingEmployeeViewingToggle(entry)}
                  >
                    <SearchIcon />
                  </IconButton>,
                  ...(editableEmployees && isAdmin
                    ? [
                        <IconButton
                          key="edit"
                          size="small"
                          onClick={handlePendingEmployeeEditingToggle(entry)}
                        >
                          <EditIcon />
                        </IconButton>,
                      ]
                    : []),
                  ...(deletableEmployees && isAdmin
                    ? [
                        <IconButton
                          key="delete"
                          size="small"
                          onClick={handlePendingEmployeeDeletingToggle(entry)}
                        >
                          <DeleteIcon />
                        </IconButton>,
                      ]
                    : []),
                ],
              },
            ];
          });
    if (kind === 'properties')
      return loading
        ? makeFakeRows(4, 3)
        : properties.map(entry => {
            const { address, city, zip, subdivision } = entry;
            return [
              { value: address },
              { value: subdivision },
              { value: city },
              {
                value: zip,
                actions: [
                  <IconButton
                    key="view"
                    size="small"
                    onClick={handlePendingPropertyViewingToggle(entry)}
                  >
                    <SearchIcon />
                  </IconButton>,
                  ...(editableProperties
                    ? [
                        <IconButton
                          key="edit"
                          size="small"
                          onClick={handlePendingPropertyEditingToggle(entry)}
                        >
                          <EditIcon />
                        </IconButton>,
                      ]
                    : []),
                  ...(deletableProperties
                    ? [
                        <IconButton
                          key="delete"
                          size="small"
                          onClick={handlePendingPropertyDeletingToggle(entry)}
                        >
                          <DeleteIcon />
                        </IconButton>,
                      ]
                    : []),
                ],
              },
            ];
          });
    return [];
  }, [
    filter,
    loading,
    events,
    loadingDicts,
    accounting,
    onSelectEvent,
    isAdmin,
  ]);
  const makeNewEmployee = () => {
    const req = new User();
    req.setIsEmployee(1);
    return req.toObject();
  };
  return (
    <div>
      <SectionBar
        title={title}
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
        loading={loading || loadingDicts}
        actions={[
          ...(kinds.includes('employees')
            ? [
                {
                  label: 'Employee Departments',
                  onClick: handleEmployeeDepartmentsOpenToggle(true),
                },
              ]
            : []),
          ...(kinds.includes('employees') && isAdmin
            ? [
                {
                  label: 'Add New Employee',
                  onClick: handlePendingEmployeeEditingToggle(
                    makeNewEmployee(),
                  ),
                },
              ]
            : []),
          ...(printableEmployees
            ? [
                {
                  label: 'Print',
                  onClick: handlePrintEmployees!,
                },
              ]
            : []),
          ...(eventsWithAccounting
            ? [
                {
                  label: accounting ? SERVICE : ACCOUNTING,
                  onClick: handleAccountingToggle,
                },
              ]
            : []),
          ...(eventsWithAdd
            ? [
                {
                  label: 'Add Service Call',
                  onClick: handlePendingEventAddingToggle(true),
                },
              ]
            : []),
          ...(onClose
            ? [
                {
                  label: 'Close',
                  onClick: onClose,
                },
              ]
            : []),
        ]}
      />
      <PlainForm
        key={formKey}
        schema={getSchema()}
        data={filter}
        onChange={handleFormChange}
        compact
        className={classes.form}
        disabled={loadingDicts}
      />
      <div style={{ display: 'none' }}>
        <div ref={employeePrintRef}>
          <PrintHeader
            title="Employees"
            subtitle={
              (filter as UsersFilter).employeeDepartmentId! > 0
                ? `Department: ${getDepartmentName(
                    departments.find(
                      ({ id }) =>
                        id === (filter as UsersFilter).employeeDepartmentId,
                    ),
                  )}`
                : ''
            }
            logo={logoKalos}
          />
          <PrintTable
            columns={['Name', 'Title', 'Email', 'Phone, ext.']}
            data={getData().map(rows => rows.map(row => row.value))}
          />
        </div>
      </div>
      <InfoTable
        columns={getColumns(filter.kind)}
        data={getData()}
        loading={loading || loadingDicts}
        hoverable
      />
      {pendingEventAdding && (
        <Modal open onClose={handlePendingEventAddingToggle(false)} fullScreen>
          <AddServiceCall
            loggedUserId={loggedUserId}
            onClose={handlePendingEventAddingToggle(false)}
            onSave={reload}
          />
        </Modal>
      )}
      {pendingEventEditing && pendingEventEditing.customer && (
        <Modal
          open
          onClose={handlePendingEventEditingToggle(undefined)}
          fullScreen
        >
          <ServiceCall
            loggedUserId={loggedUserId}
            serviceCallId={pendingEventEditing.id}
            userID={pendingEventEditing.customer.id}
            propertyId={pendingEventEditing.propertyId}
            onClose={handlePendingEventEditingToggle(undefined)}
            onSave={reload}
          />
        </Modal>
      )}
      {pendingEventDeleting && (
        <ConfirmDelete
          open
          onClose={handlePendingEventDeletingToggle(undefined)}
          onConfirm={handleDeleteServiceCall}
          kind="Service Call"
          name={`with Job # ${pendingEventDeleting.logJobNumber}`}
        />
      )}
      {pendingCustomerViewing && (
        <Modal
          open
          onClose={handlePendingCustomerViewingToggle(undefined)}
          fullScreen
        >
          <CustomerDetails
            loggedUserId={loggedUserId}
            userID={pendingCustomerViewing.id}
            onClose={handlePendingCustomerViewingToggle(undefined)}
          />
        </Modal>
      )}
      {pendingCustomerEditing && (
        <Modal
          open
          onClose={handlePendingCustomerEditingToggle(undefined)}
          fullScreen
        >
          <CustomerEdit
            onClose={handlePendingCustomerEditingToggle(undefined)}
            userId={pendingCustomerEditing.id}
            customer={pendingCustomerEditing}
            onSave={onSaveCustomer}
          />
        </Modal>
      )}
      {pendingCustomerDeleting && (
        <ConfirmDelete
          open
          onClose={handlePendingCustomerDeletingToggle(undefined)}
          onConfirm={handleDeleteCustomer}
          kind="Customer"
          name={getCustomerNameAndBusinessName(pendingCustomerDeleting)}
        />
      )}
      {pendingPropertyViewing && (
        <Modal
          open
          onClose={handlePendingPropertyViewingToggle(undefined)}
          fullScreen
        >
          <CustomerInformation
            userID={pendingPropertyViewing.userId}
            propertyId={pendingPropertyViewing.id}
            onClose={handlePendingPropertyViewingToggle(undefined)}
          />
          <PropertyInfo
            loggedUserId={loggedUserId}
            userID={pendingPropertyViewing.userId}
            propertyId={pendingPropertyViewing.id}
          />
        </Modal>
      )}
      {pendingPropertyEditing && (
        <Modal
          open
          onClose={handlePendingPropertyEditingToggle(undefined)}
          fullScreen
        >
          <PropertyEdit
            userId={pendingPropertyEditing.userId}
            propertyId={pendingPropertyEditing.id}
            property={pendingPropertyEditing}
            onSave={onSaveProperty}
            onClose={handlePendingPropertyEditingToggle(undefined)}
          />
        </Modal>
      )}
      {pendingPropertyDeleting && (
        <ConfirmDelete
          open
          onClose={handlePendingPropertyDeletingToggle(undefined)}
          onConfirm={handleDeleteProperty}
          kind="Property"
          name={`with address ${getPropertyAddress(pendingPropertyDeleting)}`}
        />
      )}
      {employeeDepartmentsOpen && (
        <Modal
          open
          onClose={handleEmployeeDepartmentsOpenToggle(false)}
          fullScreen
        >
          <EmployeeDepartments
            loggedUserId={loggedUserId}
            onClose={handleEmployeeDepartmentsOpenToggle(false)}
          />
        </Modal>
      )}
      {pendingEmployeeViewing && (
        <Modal open onClose={handlePendingEmployeeViewingToggle(undefined)}>
          <SectionBar
            title="View Employee"
            actions={[
              {
                label: 'Close',
                onClick: handlePendingEmployeeViewingToggle(undefined),
              },
            ]}
            fixedActions
          />
          <PlainForm
            schema={SCHEMA_EMPLOYEES_VIEW}
            data={pendingEmployeeViewing}
            onChange={() => {}}
          />
        </Modal>
      )}
      {pendingEmployeeEditing && (
        <Modal
          open
          onClose={handlePendingEmployeeEditingToggle(undefined)}
          fullScreen
        >
          <Form
            title={`${pendingEmployeeEditing.id ? 'Edit' : 'Add'} Employee`}
            schema={SCHEMA_EMPLOYEES_EDIT}
            data={pendingEmployeeEditing}
            onClose={handlePendingEmployeeEditingToggle(undefined)}
            onSave={onSaveEmployee}
            disabled={saving}
          />
        </Modal>
      )}
      {pendingEmployeeDeleting && (
        <ConfirmDelete
          open
          onClose={handlePendingEmployeeDeletingToggle(undefined)}
          onConfirm={handleDeleteEmployee}
          kind="Employee"
          name={getCustomerNameAndBusinessName(pendingEmployeeDeleting)}
        />
      )}
    </div>
  );
};
