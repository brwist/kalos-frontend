import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import {
  User,
  UsersFilter,
  UsersSort,
  LoadUsersByFilter,
} from '@kalos-core/kalos-rpc/User';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import cloneDeep from 'lodash/cloneDeep';
import compact from 'lodash/compact';
import IconButton from '@material-ui/core/IconButton';
import MoneyIcon from '@material-ui/icons/Money';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import BuildIcon from '@material-ui/icons/Build';
import PersonIcon from '@material-ui/icons/Person';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
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
import { PrintTable } from '../PrintTable';
import { EmployeeDepartments } from '../EmployeeDepartments';
import { Form } from '../Form';
import { SearchFormComponent } from './SearchForm';
import { PrintPage } from '../PrintPage';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { Tooltip } from '../Tooltip';
import {
  loadEventsByFilter,
  loadPropertiesByFilter,
  loadContractsByFilter,
  makeFakeRows,
  formatDate,
  EventsFilter,
  EventsSort,
  LoadEventsByFilter,
  PropertiesFilter,
  ContractsFilter,
  PropertiesSort,
  LoadPropertiesByFilter,
  LoadContractsByFilter,
  EventType,
  UserType,
  PropertyType,
  ContractType,
  JobTypeType,
  JobSubtypeType,
  PropertyClientService,
  TimesheetDepartmentType,
  EmployeeFunctionType,
  CustomEventsHandler,
  uploadFileToS3Bucket,
  getCFAppUrl,
  cfURL,
  ContractsSort,
  UserClientService,
  JobTypeClientService,
  JobSubtypeClientService,
  EventClientService,
  S3ClientService,
  EmployeeFunctionClientService,
  TimesheetDepartmentClientService,
} from '../../../helpers';
import {
  UsersSort,
  UsersFilter,
  LoadUsersByFilter,
} from '@kalos-core/kalos-rpc/User';
import { getPropertyAddress } from '@kalos-core/kalos-rpc/Property';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  EVENT_STATUS_LIST,
  USA_STATES_OPTIONS,
} from '../../../constants';
import './styles.less';

type Kind =
  | 'serviceCalls'
  | 'customers'
  | 'properties'
  | 'employees'
  | 'contracts';

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
  propertyCustomerId?: number;
  onSelectEvent?: (event: EventType) => void;
  onClose?: () => void;
}

export type SearchForm = (EventsFilter | UsersFilter | PropertiesFilter) & {
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

export const AdvancedSearch: FC<Props> = ({
  loggedUserId,
  title,
  kinds,
  deletableEvents,
  editableCustomers,
  deletableCustomers,
  editableEmployees,
  printableEmployees = false,
  editableProperties,
  deletableProperties,
  eventsWithAccounting = false,
  eventsWithAdd = false,
  onSelectEvent,
  onClose,
  propertyCustomerId = 0,
}) => {
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
  const defaultFilter: SearchForm = useMemo(
    () => ({
      kind: kinds[0],
      jobTypeId: 0,
      jobSubtypeId: 0,
      logJobStatus: '',
      employeeDepartmentId: -1,
      userId: propertyCustomerId,
    }),
    [kinds, propertyCustomerId],
  );
  const [filter, setFilter] = useState<SearchForm>(defaultFilter);
  const [formKey, setFormKey] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [employeeImages, setEmployeeImages] = useState<{
    [key: string]: string;
  }>({});
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
  const [contractsSort, setContractsSort] = useState<ContractsSort>({
    orderByField: 'number',
    orderBy: 'number',
    orderDir: 'ASC',
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [pendingEventAdding, setPendingEventAdding] = useState<boolean>(false);
  const [pendingEventEditing, setPendingEventEditing] = useState<EventType>();
  const [pendingEventDeleting, setPendingEventDeleting] = useState<EventType>();
  const [employeeUploadedPhoto, setEmployeeUploadedPhoto] = useState<string>(
    '',
  );
  const [employeeFormKey, setEmployeeFormKey] = useState<number>(0);
  const [
    pendingEmployeeViewing,
    setPendingEmployeeViewing,
  ] = useState<UserType>();
  const [
    pendingEmployeeEditing,
    setPendingEmployeeEditing,
  ] = useState<UserType>();
  const [
    pendingEmployeeDeleting,
    setPendingEmployeeDeleting,
  ] = useState<UserType>();
  const [
    pendingCustomerViewing,
    setPendingCustomerViewing,
  ] = useState<UserType>();
  const [
    pendingCustomerEditing,
    setPendingCustomerEditing,
  ] = useState<UserType>();
  const [
    pendingCustomerDeleting,
    setPendingCustomerDeleting,
  ] = useState<UserType>();
  const [
    pendingPropertyViewing,
    setPendingPropertyViewing,
  ] = useState<PropertyType>();
  const [
    pendingPropertyEditing,
    setPendingPropertyEditing,
  ] = useState<PropertyType>();
  const [
    pendingPropertyDeleting,
    setPendingPropertyDeleting,
  ] = useState<PropertyType>();
  const [departments, setDepartments] = useState<TimesheetDepartmentType[]>([]);
  const [employeeFunctions, setEmployeeFunctions] = useState<
    EmployeeFunctionType[]
  >([]);
  const [
    employeeDepartmentsOpen,
    setEmployeeDepartmentsOpen,
  ] = useState<boolean>(false);
  const [pendingAddProperty, setPendingAddProperty] = useState<boolean>(false);
  const handleTogglePendingAddProperty = useCallback(
    (pendingAddProperty: boolean) => () =>
      setPendingAddProperty(pendingAddProperty),
    [setPendingAddProperty],
  );
  const loadDicts = useCallback(async () => {
    await UserClientService;
    setLoadingDicts(true);
    const jobTypes = await JobTypeClientService.loadJobTypes();
    setJobTypes(jobTypes);
    const jobSubtypes = await JobSubtypeClientService.loadJobSubtypes();
    setJobSubtypes(jobSubtypes);
    setLoadingDicts(false);
    if (kinds.includes('employees')) {
      const departments = await TimesheetDepartmentClientService.loadTimeSheetDepartments();
      setDepartments(departments);
      const employeeFunctions = await EmployeeFunctionClientService.loadEmployeeFunctions();
      setEmployeeFunctions(employeeFunctions);
      const loggedUser = await UserClientService.loadUserById(loggedUserId);
      setIsAdmin(loggedUser.isAdmin);
    }
    setFormKey(formKey + 1);
    setLoadedDicts(true);
    CustomEventsHandler.listen(
      'AddProperty',
      handleTogglePendingAddProperty(true),
    );
  }, [
    setLoadingDicts,
    setJobTypes,
    setJobSubtypes,
    loggedUserId,
    // setFormKey,
    formKey,
    kinds,
    setDepartments,
    setLoadedDicts,
    setIsAdmin,
    setEmployeeFunctions,
    handleTogglePendingAddProperty,
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
      const { resultsList, totalCount } = await loadEventsByFilter(criteria);
      setCount(totalCount);
      setEvents(resultsList);
    }
    if (kind === 'customers' || kind === 'employees') {
      const criteria: LoadUsersByFilter = {
        page: kind === 'employees' ? -1 : page,
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
      const { results, totalCount } = await UserClientService.loadUsersByFilter(
        criteria,
      );
      setCount(totalCount);
      setUsers(results);
      if (kind === 'employees') {
        const images = await Promise.all(
          results
            .filter(({ image }) => !!image)
            .map(async ({ image }) => ({
              image,
              url: await S3ClientService.getFileS3BucketUrl(
                image,
                'kalos-employee-images',
              ),
            })),
        );

        // TODO fix type error
        setEmployeeImages(
          images.reduce(
            (aggr, { image, url }) => ({ ...aggr, [image]: url }),
            {},
          ),
        );
      }
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
    if (kind === 'contracts') {
      const criteria: LoadContractsByFilter = {
        page,
        filter: filterCriteria as ContractsFilter,
        sort: contractsSort,
      };
      //@ts-ignore
      delete criteria.filter.employeeDepartmentId;
      const { results, totalCount } = await loadContractsByFilter(criteria);
      setCount(totalCount);
      setContracts(results);
    }
    setLoading(false);
  }, [
    filter,
    page,
    setCount,
    setEvents,
    setUsers,
    setProperties,
    setContracts,
    setLoading,
    eventsSort,
    usersSort,
    propertiesSort,
    contractsSort,
    setEmployeeImages,
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

  const handleContractsSortChange = useCallback(
    (sort: ContractsSort) => () => {
      setContractsSort(sort);
      setPage(0);
      setLoaded(false);
    },
    [setContractsSort, setPage, setLoaded],
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
    if (!kinds.includes('employees')) {
      setLoaded(false);
    }
  }, [setFilter, setLoaded, filter, formKey, setFormKey, kinds, defaultFilter]);
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
    [setFilter, filter, formKey, setFormKey, setLoaded, defaultFilter],
  );
  const handlePendingEventAddingToggle = useCallback(
    (pendingEventAdding: boolean) => () =>
      setPendingEventAdding(pendingEventAdding),
    [setPendingEventAdding],
  );
  const handlePendingEventEditingToggle = useCallback(
    (pendingEventEditing?: EventType) => () => {
      if (pendingEventEditing) {
        document.location.href = [
          getCFAppUrl('admin:service.editServicecall'),
          `id=${pendingEventEditing.id}`,
          `user_id=${pendingEventEditing.customer!.id}`,
          `property_id=${pendingEventEditing.property!.id}`,
        ].join('&');
      }
      // setPendingEventEditing(pendingEventEditing); // TODO restore when EditServiceCall is finished
    },
    [],
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
      await EventClientService.deleteEventById(id);
      setLoaded(false);
    }
  }, [pendingEventDeleting, setLoaded, setPendingEventDeleting, setLoading]);
  const handleDeleteCustomer = useCallback(async () => {
    if (pendingCustomerDeleting) {
      const { id } = pendingCustomerDeleting;
      setPendingCustomerDeleting(undefined);
      setLoading(true);
      await UserClientService.deleteUserById(id);
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
      await UserClientService.deleteUserById(id);
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
      await PropertyClientService.deletePropertyById(id);
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
        if (employeeUploadedPhoto) {
          await uploadFileToS3Bucket(
            data.image,
            employeeUploadedPhoto,
            'kalos-employee-images',
          );
        }
        await UserClientService.saveUser(data, pendingEmployeeEditing.id);
        setPendingEmployeeEditing(undefined);
        setSaving(false);
        setLoaded(false);
      }
    },
    [
      setPendingEmployeeEditing,
      setLoaded,
      setSaving,
      pendingEmployeeEditing,
      employeeUploadedPhoto,
    ],
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
    setPendingAddProperty(false);
    setLoaded(false);
  }, [setPendingPropertyEditing, setLoaded, setPendingAddProperty]);
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
      if (accounting) {
        window.open(
          [
            getCFAppUrl('admin:service.editServicecall'),
            `id=${event.id}`,
            `user_id=${event.customer!.id}`,
            `property_id=${event.property!.id}`,
          ].join('&'),
          '_blank',
        );
        return;
      }
      if (onSelectEvent) {
        onSelectEvent(event);
      }
      if (onClose) {
        onClose();
      }
    },
    [onSelectEvent, onClose, accounting],
  );
  const handleEmployeeDepartmentsOpenToggle = useCallback(
    (open: boolean) => () => setEmployeeDepartmentsOpen(open),
    [setEmployeeDepartmentsOpen],
  );
  const handleEmployeePhotoUpload = useCallback(
    (file: string | ArrayBuffer | null) => {
      if (!file) return;
      setEmployeeUploadedPhoto(file as string);
    },
    [setEmployeeUploadedPhoto],
  );
  const handleDeleteEmployeePhoto = useCallback(() => {
    if (!pendingEmployeeEditing) return;
    setEmployeeUploadedPhoto('');
    setPendingEmployeeEditing({ ...pendingEmployeeEditing, image: '' });
    setEmployeeFormKey(employeeFormKey + 1);
  }, [
    setEmployeeUploadedPhoto,
    setPendingEmployeeEditing,
    pendingEmployeeEditing,
    employeeFormKey,
    setEmployeeFormKey,
  ]);
  const searchActions: ActionsProps = useMemo(
    () => [
      {
        label: 'Reset',
        variant: 'outlined',
        onClick: handleResetSearchForm,
      },
      ...(kinds.includes('employees')
        ? []
        : [
            {
              label: 'Search',
              onClick: handleLoad,
            },
          ]),
    ],
    [handleLoad, handleResetSearchForm, kinds],
  );

  const TYPES: Option[] = useMemo(
    () => [
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
      ...(kinds.includes('contracts')
        ? [{ label: 'Contracts', value: 'contracts' }]
        : []),
    ],
    [kinds],
  );

  const SCHEMA_KIND: Schema<SearchForm> = useMemo(
    () => [
      [
        {
          name: 'kind',
          label: 'Search',
          options: TYPES,
        },
      ],
    ],
    [TYPES],
  );

  const SCHEMA_EVENTS: Schema<EventsFilter> = useMemo(
    () => [
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
          name: 'logPo',
          label: 'PO',
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
          name: 'dateStartedFrom',
          label: 'Date Started - From',
          type: 'date',
        },
        {
          name: 'dateStartedTo',
          label: 'Date Started - To',
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
    ],
    [jobSubtypes, jobTypes, searchActions],
  );
  const SCHEMA_USERS: Schema<UsersFilter> = useMemo(
    () => [
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
    ],
    [searchActions],
  );
  const SCHEMA_EMPLOYEES: Schema<UsersFilter> = useMemo(
    () => [
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
    ],
    [departments, searchActions],
  );

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
        options: departments.map(({ id, description, value }) => ({
          label: `${value} - ${description}`,
          value: id,
        })),
        readOnly: true,
      },
    ],
  ];
  const makeSchemaEmployeesEdit = (entry: UserType): Schema<UserType> => [
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
        label: 'State',
        options: USA_STATES_OPTIONS,
      },
    ],
    [
      {
        name: 'empTitle',
        label: 'Title',
      },
      // {
      //   name: 'id', // TODO
      //   label: 'Hire Date',
      // },
      {
        name: 'employeeFunctionId',
        label: 'Employee Role',
        options: employeeFunctions.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
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
      // {
      //   name: 'isAdmin', // FIXME include_in_pdf_list
      //   label: 'Add To Directory PDF',
      //   type: 'checkbox',
      // },
      // {
      //   name: 'isAdmin', // FIXME user_pwreset
      //   label: 'Force P/W Reset',
      //   type: 'checkbox',
      // },
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
      // {
      //   name: 'isAdmin', // FIXME can_delete_serviceItem_photo
      //   label: 'Can delete service item photos',
      //   type: 'checkbox',
      // },
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
      // {
      //   name: 'isAdmin', // FIXME can_access_reports
      //   label: 'Access Reports',
      //   type: 'checkbox',
      // },
      {
        name: 'techAssist',
        label: 'Tech Assist',
        type: 'checkbox',
      },
      {},
      // {
      //   name: 'isAdmin', // FIXME edit_directory_view
      //   label: 'Edit Directory View',
      //   type: 'checkbox',
      // },
    ],
    // [
    //   {
    //     name: 'isAdmin', // FIXME have_roo_btn_access
    //     label: 'Roo Button Access',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME can_approve_requestOff
    //     label: 'Review and Approve Requests Off',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME userStatus
    //     label: 'Activate User',
    //     type: 'checkbox',
    //   },
    // ],
    // [
    //   {
    //     name: 'isAdmin', // FIXME userStatus
    //     label: 'Deactivate User',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME email_right
    //     label: 'Send Emails',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME timesheet_right
    //     label: 'Approve Time',
    //     type: 'checkbox',
    //   },
    // ],
    // [
    //   {
    //     name: 'isAdmin', // FIXME tasks_right
    //     label: 'Handle Tasks',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME edit_right
    //     label: 'Manage Employees',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME delete_right
    //     label: 'Delete Customers',
    //     type: 'checkbox',
    //   },
    // ],
    [{ headline: true, label: 'Kalos Special Features' }],
    [
      {
        name: 'isColorMute',
        label: 'Color Mute [2017]',
        type: 'checkbox',
      },
      // {
      //   name: 'isAdmin', // FIXME admin_matrics
      //   label: 'Admin Metrics',
      //   type: 'checkbox',
      // },
      // {
      //   name: 'isAdmin', // FIXME tech_matrics
      //   label: 'Tech Metrics',
      //   type: 'checkbox',
      // },
    ],
    // [
    //   {
    //     name: 'isAdmin', // FIXME install_matrics
    //     label: 'Install Metrics',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME garage_door_matrics
    //     label: 'Garage Door Metrics',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME refrigeration_matrics
    //     label: 'Refrigeration Metrics',
    //     type: 'checkbox',
    //   },
    // ],
    // [
    //   {
    //     name: 'isAdmin', // FIXME electrician_matrics
    //     label: 'Electrician Metrics',
    //     type: 'checkbox',
    //   },
    //   {},
    //   {},
    // ],
    [{ headline: true, label: 'Paid Time-Off' }],
    [
      {
        name: 'hireDate',
        label: 'Hire Date',
        type: 'date',
        disabled: true,
      },
      { name: 'annualHoursPto', label: 'Annual PTO Allowance', type: 'number' },
      /*{
        name: 'currentPtoAmount',
        label: 'Current Available PTO',
        type: 'number',
        disabled: true,
      }*/
    ],
    // [{ headline: true, label: 'Dispatch Mode Permission' }],
    // [
    //   {
    //     name: 'isAdmin', // FIXME can_access_dispatch_mode
    //     label: 'Access Dispatch Mode',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME access_dismiss_employee
    //     label: 'Can Dismiss Employee',
    //     type: 'checkbox',
    //   },
    //   {
    //     name: 'isAdmin', // FIXME is_training_admin
    //     label: 'Training Admin',
    //     type: 'checkbox',
    //   },
    // ],
    [{ headline: true, label: 'Photo' }],
    [
      {
        content: (
          <div
            className="AdvancedSearchEmployeeImageBig"
            style={
              employeeUploadedPhoto || entry.image
                ? {
                    backgroundImage: `url('${
                      employeeUploadedPhoto || employeeImages[entry.image]
                    }')`,
                  }
                : {}
            }
          />
        ),
      },
      {
        name: 'image',
        type: 'file',
        label: 'Photo',
        actions: [
          {
            label: 'Delete',
            variant: 'outlined',
            onClick: handleDeleteEmployeePhoto,
          },
        ],
        actionsInLabel: true,
        onFileLoad: handleEmployeePhotoUpload,
      },
      {},
      {},
    ],
  ];
  const SCHEMA_PROPERTIES: Schema<PropertiesFilter> = useMemo(
    () => [
      [
        {
          name: 'address',
          label: 'Address',
          type: 'search',
        },
        {
          name: 'subdivision',
          label: 'Subdivision',
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
    ],
    [searchActions],
  );
  const SCHEMA_CONTRACTS: Schema<ContractsFilter> = useMemo(
    () => [
      [
        {
          name: 'number',
          label: 'Contract Number',
          type: 'search',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'search',
        },
        {
          name: 'businessName',
          label: 'Business Name',
          type: 'search',
        },
      ],
      [
        {
          name: 'dateStarted',
          label: 'Contract Start Date',
          type: 'date',
        },
        {
          name: 'dateEnded',
          label: 'Contract End Date',
          type: 'date',
          actions: searchActions,
        },
      ],
    ],
    [searchActions],
  );

  const makeSchema = useCallback(
    (schema: Schema<SearchForm>) => {
      const kindsAmount = SCHEMA_KIND[0][0].options?.length || 0;
      if (kindsAmount <= 1) return schema;
      const clonedSchema = cloneDeep(schema);
      clonedSchema[0].unshift(SCHEMA_KIND[0][0]);
      return clonedSchema;
    },
    [SCHEMA_KIND],
  );

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
    if (kind === 'contracts')
      return makeSchema(SCHEMA_CONTRACTS as Schema<SearchForm>);
    return [];
  }, [
    filter,
    SCHEMA_EVENTS,
    SCHEMA_CONTRACTS,
    SCHEMA_PROPERTIES,
    SCHEMA_EMPLOYEES,
    SCHEMA_USERS,
    makeSchema,
  ]);
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
              name: 'Job # / PO',
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
              name: 'Job # / PO',
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
    if (kind === 'contracts')
      return [
        {
          name: 'Contract #',
          ...(contractsSort.orderByField === 'number'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'number',
            orderBy: 'number',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Start Date',
          ...(contractsSort.orderByField === 'dateStarted'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'dateStarted',
            orderBy: 'dateStarted',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract End Date',
          ...(contractsSort.orderByField === 'dateEnded'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'dateEnded',
            orderBy: 'dateEnded',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Business Name',
          ...(contractsSort.orderByField === 'businessName'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'businessName',
            orderBy: 'businessName',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Last Name',
          ...(contractsSort.orderByField === 'lastName'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'lastName',
            orderBy: 'lastName',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];

    return [];
  };
  const handleContractClick = useCallback(
    (entry: ContractType) => () => {
      console.log(entry);
      window.open(
        cfURL(
          'admin:contracts.summary',
          `&contract_id=${entry.id}&lsort=contract_number&lorder=ASC&lmaxrow=40&lstartrow=1&lnamesearch=&lsearchfield=special`,
        ),
        '_blank',
      );
    },
    [],
  );
  const getData = useCallback(
    (forPrint: boolean = false): Data => {
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
                logPo,
              } = entry;
              const canceledStyle =
                !accounting && logJobStatus === 'Canceled'
                  ? { color: 'red' }
                  : {};
              return customer
                ? [
                    {
                      value: formatDate(dateStarted),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : () =>
                              window.open(
                                cfURL(
                                  'service.editServiceCall',
                                  `&id=${entry.id}&user_id=${entry.property?.userId}&property_id=${entry.propertyId}`,
                                ),
                                '_blank',
                              ),
                    },
                    {
                      value: accounting
                        ? UserClientService.getCustomerName(customer)
                        : UserClientService.getCustomerNameAndBusinessName(
                            customer,
                          ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : handlePendingCustomerViewingToggle(entry.customer),
                    },
                    ...(accounting
                      ? [
                          {
                            value: UserClientService.getBusinessName(customer),
                            onClick:
                              onSelectEvent || accounting
                                ? handleSelectEvent(entry)
                                : undefined,
                          },
                        ]
                      : []),
                    {
                      value: accounting
                        ? property?.address || ''
                        : `${getPropertyAddress(
                            property,
                          )} ${UserClientService.getCustomerPhone(customer)}`,
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : handlePendingPropertyViewingToggle(entry.property),
                    },
                    ...(accounting
                      ? [
                          {
                            value: property?.city || '',
                            onClick:
                              onSelectEvent || accounting
                                ? handleSelectEvent(entry)
                                : undefined,
                          },
                        ]
                      : []),
                    ...(accounting
                      ? [
                          {
                            value: property?.zip || '',
                            onClick:
                              onSelectEvent || accounting
                                ? handleSelectEvent(entry)
                                : undefined,
                          },
                        ]
                      : []),
                    ...(accounting
                      ? [
                          {
                            value: property?.phone || '',
                            onClick:
                              onSelectEvent || accounting
                                ? handleSelectEvent(entry)
                                : undefined,
                          },
                        ]
                      : []),
                    {
                      value: (
                        <span style={canceledStyle}>
                          {accounting
                            ? compact(
                                logJobNumber
                                  .replace(/[A-Za-z]/g, '')
                                  .split('-'),
                              )
                                .join('-')
                                .replace(/~/g, '')
                            : logJobNumber}
                          {' / '}
                          {logPo || '-'}
                        </span>
                      ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : () =>
                              window.open(
                                cfURL(
                                  'service.editServiceCall',
                                  `&id=${entry.id}&user_id=${entry.property?.userId}&property_id=${entry.propertyId}`,
                                ),
                                '_blank',
                              ),
                    },
                    {
                      value: (
                        <span style={canceledStyle}>
                          {accounting ? jobType : `${jobType} / ${jobSubtype}`}
                        </span>
                      ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : () =>
                              window.open(
                                cfURL(
                                  'service.editServiceCall',
                                  `&id=${entry.id}&user_id=${entry.property?.userId}&property_id=${entry.propertyId}`,
                                ),
                                '_blank',
                              ),
                    },
                    {
                      value: (
                        <span style={canceledStyle}>
                          {accounting ? jobSubtype : logJobStatus}
                        </span>
                      ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : () =>
                              window.open(
                                cfURL(
                                  'service.editServiceCall',
                                  `&id=${entry.id}&user_id=${entry.property?.userId}&property_id=${entry.propertyId}`,
                                ),
                                '_blank',
                              ),
                      actions: [
                        ...(onSelectEvent
                          ? []
                          : [
                              <IconButton
                                key="edit"
                                size="small"
                                onClick={
                                  () => {
                                    window.open(
                                      cfURL(
                                        'service.editServiceCall',
                                        `&id=${entry.id}&user_id=${entry.property?.userId}&property_id=${entry.propertyId}`,
                                      ),
                                    );
                                    /* TODO: complete edit service call module */
                                  } /*handlePendingEventEditingToggle(entry)*/
                                }
                              >
                                <EditIcon />
                              </IconButton>,
                            ]),
                        ...(deletableEvents
                          ? [
                              <IconButton
                                key="delete"
                                size="small"
                                onClick={handlePendingEventDeletingToggle(
                                  entry,
                                )}
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
                {
                  value: firstname,
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: lastname,
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: businessname,
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: phone,
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: email,
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: '',
                  onClick: handlePendingCustomerViewingToggle(entry),
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
          : users
              .filter(
                ({
                  firstname,
                  lastname,
                  empTitle,
                  email,
                  phone,
                  ext,
                  cellphone,
                  employeeDepartmentId,
                }) => {
                  const usersFilter = filter as UsersFilter;
                  const matchedFirstname = usersFilter.firstname
                    ? firstname
                        .toLowerCase()
                        .includes(usersFilter.firstname.toLowerCase())
                    : true;
                  const matchedLastname = usersFilter.lastname
                    ? lastname
                        .toLowerCase()
                        .includes(usersFilter.lastname.toLowerCase())
                    : true;
                  const matchedEmpTitle = usersFilter.empTitle
                    ? empTitle
                        .toLowerCase()
                        .includes(usersFilter.empTitle.toLowerCase())
                    : true;
                  const matchedEmail = usersFilter.email
                    ? email
                        .toLowerCase()
                        .includes(usersFilter.email.toLowerCase())
                    : true;
                  const matchedPhone = usersFilter.phone
                    ? phone
                        .toLowerCase()
                        .includes(usersFilter.phone.toLowerCase())
                    : true;
                  const matchedExt = usersFilter.ext
                    ? ext.toLowerCase().includes(usersFilter.ext.toLowerCase())
                    : true;
                  const matchedCellphone = usersFilter.cellphone
                    ? cellphone
                        .toLowerCase()
                        .includes(usersFilter.cellphone.toLowerCase())
                    : true;
                  const matchedDepartment =
                    usersFilter.employeeDepartmentId &&
                    usersFilter.employeeDepartmentId > 0
                      ? employeeDepartmentId ===
                        usersFilter.employeeDepartmentId
                      : true;
                  return (
                    matchedFirstname &&
                    matchedLastname &&
                    matchedEmpTitle &&
                    matchedEmail &&
                    matchedPhone &&
                    matchedExt &&
                    matchedCellphone &&
                    matchedDepartment
                  );
                },
              )
              .map(entry => {
                const { id, empTitle, email, cellphone, image } = entry;
                return [
                  {
                    value: forPrint ? (
                      UserClientService.getCustomerName(entry)
                    ) : (
                      <div className="AdvancedSearchEmployee">
                        <div
                          className={clsx('AdvancedSearchEmployeeImage', {
                            image,
                          })}
                          style={
                            image
                              ? {
                                  backgroundImage: `url('${employeeImages[image]}')`,
                                }
                              : {}
                          }
                        />
                        {UserClientService.getCustomerName(entry)}
                      </div>
                    ),
                    onClick: handlePendingEmployeeViewingToggle(entry),
                  },
                  {
                    value: empTitle,
                    onClick: handlePendingEmployeeViewingToggle(entry),
                  },
                  {
                    value: email,
                    onClick: handlePendingEmployeeViewingToggle(entry),
                  },
                  {
                    value: UserClientService.getCustomerPhoneWithExt(entry),
                    onClick: handlePendingEmployeeViewingToggle(entry),
                  },
                  {
                    value: cellphone,
                    onClick: handlePendingEmployeeViewingToggle(entry),
                    actions: [
                      ...(isAdmin
                        ? [
                            <Tooltip
                              key="tool"
                              content="View Tool Log"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  window.open(
                                    [
                                      '/index.cfm?action=admin:tasks.spiff_tool_logs',
                                      `type=tool`,
                                      `rt=all`,
                                      `reportUserId=${id}`,
                                    ].join('&'),
                                  );
                                  // TODO replace with ComponentsLibrary
                                  /*document.location.href = [
                                    '/index.cfm?action=admin:tasks.spiff_tool_logs',
                                    `type=tool`,
                                    `rt=all`,
                                    `reportUserId=${id}`,
                                  ].join('&');*/
                                }}
                              >
                                <BuildIcon />
                              </IconButton>
                            </Tooltip>,
                            <Tooltip
                              key="spiff"
                              content="View Spiff Log"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // TODO replace with ComponentsLibrary
                                  window.open(
                                    [
                                      '/index.cfm?action=admin:tasks.spiff_tool_logs',
                                      `type=spiff`,
                                      `rt=all`,
                                      `reportUserId=${id}`,
                                    ].join('&'),
                                  );
                                  /*document.location.href = [
                                    '/index.cfm?action=admin:tasks.spiff_tool_logs',
                                    `type=spiff`,
                                    `rt=all`,
                                    `reportUserId=${id}`,
                                  ].join('&');*/
                                }}
                              >
                                <MoneyIcon />
                              </IconButton>
                            </Tooltip>,
                            <Tooltip
                              key="timesheet"
                              content="View Timesheet"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  // TODO replace with ComponentsLibrary
                                  window.open(
                                    [
                                      '/index.cfm?action=admin:timesheet.timesheetview_new',
                                      `user_id=${id}`,
                                    ].join('&'),
                                  );
                                }}
                              >
                                <AccessTimeIcon />
                              </IconButton>
                            </Tooltip>,
                          ]
                        : []),
                      <Tooltip
                        key="view"
                        content="View Employee"
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          onClick={handlePendingEmployeeViewingToggle(entry)}
                        >
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>,
                      ...(editableEmployees && isAdmin
                        ? [
                            <Tooltip
                              key="edit"
                              content="Edit Employee"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={handlePendingEmployeeEditingToggle(
                                  entry,
                                )}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>,
                          ]
                        : []),
                      /*
                      ...(deletableEmployees && isAdmin
                        ? [
                            <Tooltip
                              key="delete"
                              content="Delete Employee"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={handlePendingEmployeeDeletingToggle(
                                  entry,
                                )}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>,
                          ]
                        : []),
                        */
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
                {
                  value: address,
                  onClick: handlePendingPropertyViewingToggle(entry),
                },
                {
                  value: subdivision,
                  onClick: handlePendingPropertyViewingToggle(entry),
                },
                {
                  value: city,
                  onClick: handlePendingPropertyViewingToggle(entry),
                },
                {
                  value: zip,
                  onClick: handlePendingPropertyViewingToggle(entry),
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
      if (kind === 'contracts')
        return loading
          ? makeFakeRows(5, 3)
          : contracts.map(entry => {
              const {
                number,
                dateStarted,
                dateEnded,
                lastName,
                businessName,
              } = entry;
              const user = new User();
              user.setId(entry.userId);
              console.log({ dateStarted, dateEnded });
              const formattedDS = formatDate(dateStarted);
              const formattedDE = formatDate(dateEnded);
              console.log({ formattedDS, formattedDE });
              return [
                {
                  value: number,
                  onClick: handleContractClick(entry),
                },
                {
                  value: formatDate(dateStarted),
                  onClick: handleContractClick(entry),
                },
                {
                  value: formatDate(dateEnded),
                  onClick: handleContractClick(entry),
                },
                {
                  value: businessName,
                  onClick: handleContractClick(entry),
                },
                {
                  value: lastName,
                  onClick: handleContractClick(entry),
                  actions: [
                    <IconButton
                      key="view"
                      size="small"
                      onClick={handleContractClick(entry)}
                    >
                      <SearchIcon />
                    </IconButton>,
                    <IconButton
                      key="user"
                      size="small"
                      onClick={handlePendingCustomerViewingToggle(
                        user.toObject(),
                      )}
                    >
                      <PersonIcon />
                    </IconButton>,
                  ],
                },
              ];
            });
      return [];
    },
    [
      filter,
      loading,
      loadingDicts,
      accounting,
      events,
      users,
      properties,
      contracts,
      onSelectEvent,
      handleSelectEvent,
      handlePendingCustomerViewingToggle,
      handlePendingPropertyViewingToggle,
      deletableEvents,
      handlePendingEventDeletingToggle,
      editableCustomers,
      handlePendingCustomerEditingToggle,
      deletableCustomers,
      handlePendingCustomerDeletingToggle,
      employeeImages,
      handlePendingEmployeeViewingToggle,
      isAdmin,
      editableEmployees,
      handlePendingEmployeeEditingToggle,
      editableProperties,
      handlePendingPropertyEditingToggle,
      deletableProperties,
      handlePendingPropertyDeletingToggle,
      handleContractClick,
    ],
  );
  const makeNewEmployee = () => {
    const req = new User();
    req.setIsEmployee(1);
    return req.toObject();
  };
  const printHeaderSubtitle = useMemo(() => {
    const {
      firstname,
      lastname,
      empTitle,
      email,
      phone,
      ext,
      cellphone,
      employeeDepartmentId,
    } = filter as UsersFilter;
    const css = {
      display: 'inline-block',
      marginRight: 16,
    };
    return (
      <>
        {employeeDepartmentId! > 0 && (
          <PrintHeaderSubtitleItem
            label="Department"
            value={TimesheetDepartmentClientService.getDepartmentName(
              departments.find(
                ({ id }) => id === (filter as UsersFilter).employeeDepartmentId,
              )!,
            )}
          />
        )}
        {!!firstname && (
          <PrintHeaderSubtitleItem label="Firstname with" value={firstname} />
        )}
        {!!lastname && (
          <PrintHeaderSubtitleItem label="Lastname with" value={lastname} />
        )}
        {!!empTitle && (
          <PrintHeaderSubtitleItem label="Title with" value={empTitle} />
        )}
        {!!email && (
          <PrintHeaderSubtitleItem label="Email with" value={email} />
        )}
        {!!phone && (
          <PrintHeaderSubtitleItem label="Phone with" value={phone} />
        )}
        {!!ext && <PrintHeaderSubtitleItem label="Ext. with" value={ext} />}{' '}
        {!!cellphone && (
          <PrintHeaderSubtitleItem label="Cell with" value={cellphone} />
        )}
      </>
    );
  }, [filter, departments]);
  return (
    <div>
      <SectionBar
        title={title}
        pagination={
          kinds.includes('employees')
            ? undefined
            : {
                count,
                page,
                rowsPerPage: ROWS_PER_PAGE,
                onChangePage: handleChangePage,
              }
        }
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
          // ...(printableEmployees
          //   ? [
          //       {
          //         label: 'Print',
          //         onClick: handlePrintEmployees!,
          //       },
          //     ]
          //   : []),
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
          ...(propertyCustomerId
            ? [
                {
                  label: 'Add Property',
                  onClick: handleTogglePendingAddProperty(true),
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
        fixedActions
        asideContent={
          printableEmployees ? (
            <PrintPage
              headerProps={{
                title: 'Employees',
                subtitle: printHeaderSubtitle,
              }}
            >
              <PrintTable
                columns={[
                  'Name',
                  'Title',
                  'Email',
                  'Office, ext.',
                  { title: 'Cell', align: 'right' },
                ]}
                data={getData(true).map(rows => rows.map(row => row.value))}
                noEntriesText="No employees matching criteria"
              />
            </PrintPage>
          ) : null
        }
      />
      {!propertyCustomerId && (
        <SearchFormComponent
          key={formKey}
          schema={getSchema()}
          data={filter}
          onChange={handleFormChange}
          onSubmit={filter.kind === 'serviceCalls' ? handleLoad : undefined}
          className="AdvancedSearchForm"
          disabled={loadingDicts}
        />
      )}
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
          name={UserClientService.getCustomerNameAndBusinessName(
            pendingCustomerDeleting,
          )}
        />
      )}
      {pendingPropertyViewing && (
        <Modal
          open
          onClose={handlePendingPropertyViewingToggle(undefined)}
          fullScreen
        >
          {!propertyCustomerId && (
            <CustomerInformation
              userID={pendingPropertyViewing.userId}
              propertyId={pendingPropertyViewing.id}
              onClose={handlePendingPropertyViewingToggle(undefined)}
            />
          )}
          <PropertyInfo
            loggedUserId={loggedUserId}
            userID={pendingPropertyViewing.userId}
            propertyId={pendingPropertyViewing.id}
            viewedAsCustomer={!!propertyCustomerId}
            onClose={handlePendingPropertyViewingToggle(undefined)}
          />
        </Modal>
      )}
      {pendingPropertyEditing && (
        <Modal open onClose={handlePendingPropertyEditingToggle(undefined)}>
          <PropertyEdit
            userId={pendingPropertyEditing.userId}
            propertyId={pendingPropertyEditing.id}
            property={pendingPropertyEditing}
            onSave={onSaveProperty}
            onClose={handlePendingPropertyEditingToggle(undefined)}
          />
        </Modal>
      )}
      {pendingAddProperty && (
        <Modal open onClose={handleTogglePendingAddProperty(false)}>
          <PropertyEdit
            userId={propertyCustomerId}
            onSave={onSaveProperty}
            onClose={handleTogglePendingAddProperty(false)}
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
          <div
            className="AdvancedSearchEmployeeImageBig"
            style={
              pendingEmployeeViewing.image
                ? {
                    backgroundImage: `url('${
                      employeeImages[pendingEmployeeViewing.image]
                    }')`,
                  }
                : {}
            }
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
            key={employeeFormKey}
            title={`${pendingEmployeeEditing.id ? 'Edit' : 'Add'} Employee`}
            schema={makeSchemaEmployeesEdit(pendingEmployeeEditing)}
            data={pendingEmployeeEditing}
            onClose={handlePendingEmployeeEditingToggle(undefined)}
            onSave={onSaveEmployee}
            disabled={saving}
            stickySectionBar
          />
        </Modal>
      )}
      {pendingEmployeeDeleting && (
        <ConfirmDelete
          open
          onClose={handlePendingEmployeeDeletingToggle(undefined)}
          onConfirm={handleDeleteEmployee}
          kind="Employee"
          name={UserClientService.getCustomerNameAndBusinessName(
            pendingEmployeeDeleting,
          )}
        />
      )}
    </div>
  );
};
