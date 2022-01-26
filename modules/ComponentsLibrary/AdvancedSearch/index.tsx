// this files ts-ignore lines have been checked
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
import GroupIcon from '@material-ui/icons/Group';
import RateReviewOutlined from '@material-ui/icons/RateReviewOutlined';
import { ActionsProps } from '../Actions';
import { SectionBar } from '../SectionBar';
import { PlainForm, Schema, Option } from '../PlainForm';
import { InfoTable, Columns, Data } from '../InfoTable';
import { ServiceCall } from '../ServiceCall';
import { ServiceCallNew } from '../ServiceCall/indexv2';
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
import { EmployeePermissions } from '../EmployeePermissions';
import { PrintHeaderSubtitleItem } from '../PrintHeader';
import { Tooltip } from '../Tooltip';
import {
  loadEventsByFilter,
  loadPropertiesByFilter,
  loadContractsByFilter,
  makeFakeRows,
  formatDate,
  EventsFilter,
  MapClientService,
  EventsSort,
  LoadEventsByFilter,
  PropertiesFilter,
  ContractsFilter,
  PropertiesSort,
  LoadPropertiesByFilter,
  LoadContractsByFilter,
  PropertyClientService,
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
  makeSafeFormObject,
  ActivityLogClientService,
  QuoteLinePartClientService,
  QuoteLineClientService,
  usd,
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  EVENT_STATUS_LIST,
  USA_STATES_OPTIONS,
} from '../../../constants';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { Contract } from '@kalos-core/kalos-rpc/Contract';
import { JobType } from '@kalos-core/kalos-rpc/JobType';
import { JobSubtype } from '@kalos-core/kalos-rpc/JobSubtype';
import { TimesheetDepartment } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { EmployeeFunction } from '@kalos-core/kalos-rpc/EmployeeFunction';

import './styles.less';
import { log } from 'console';
import { ActivityLog } from '@kalos-core/kalos-rpc/ActivityLog';
import format from 'date-fns/esm/format';
import { ServiceRequest } from '../ServiceCall/requestIndex';
import { QuoteLine } from '@kalos-core/kalos-rpc/QuoteLine';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

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
  onSelectEvent?: (event: Event) => void;
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
  const [loggedUser, setLoggedUser] = useState<User>(new User());
  const [loadedDicts, setLoadedDicts] = useState<boolean>(false);
  const [flatRateIsOpen, setFlatRateIsOpen] = useState<boolean>(false);
  const [flatRate, setFlatRate] = useState<QuoteLine[]>([]);
  const [loadingDicts, setLoadingDicts] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [jobSubtypes, setJobSubtypes] = useState<JobSubtype[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingEditPermissions, setPendingEditPermissions] = useState<User>();

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
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [employeeImages, setEmployeeImages] = useState<{
    [key: string]: string;
  }>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [eventsSort, setEventsSort] = useState<EventsSort>({
    orderByField: 'getDateStarted',
    orderBy: 'date_started',
    orderDir: 'DESC',
  });
  const [usersSort, setUsersSort] = useState<UsersSort>({
    orderByField: 'getLastname',
    orderBy: 'user_lastname',
    orderDir: 'ASC',
  });
  const [propertiesSort, setPropertiesSort] = useState<PropertiesSort>({
    orderByField: 'getAddress',
    orderBy: 'property_address',
    orderDir: 'ASC',
  });
  const [contractsSort, setContractsSort] = useState<ContractsSort>({
    orderByField: 'getNumber',
    orderBy: 'number',
    orderDir: 'ASC',
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [pendingEventAdding, setPendingEventAdding] = useState<boolean>(false);
  const [pendingEventEditing, setPendingEventEditing] = useState<Event>();
  const [pendingEventEditingNew, setPendingEventEditingNew] = useState<Event>();
  const [pendingEventDeleting, setPendingEventDeleting] = useState<Event>();
  const [employeeUploadedPhoto, setEmployeeUploadedPhoto] =
    useState<string>('');
  const [employeeFormKey, setEmployeeFormKey] = useState<number>(0);
  const [pendingEmployeeViewing, setPendingEmployeeViewing] = useState<User>();
  const [pendingEmployeeEditing, setPendingEmployeeEditing] = useState<User>();
  const [pendingEmployeeDeleting, setPendingEmployeeDeleting] =
    useState<User>();
  const [pendingCustomerViewing, setPendingCustomerViewing] = useState<User>();
  const [pendingCustomerEditing, setPendingCustomerEditing] = useState<User>();
  const [pendingCustomerDeleting, setPendingCustomerDeleting] =
    useState<User>();
  const [pendingPropertyViewing, setPendingPropertyViewing] =
    useState<Property>();
  const [pendingPropertyEditing, setPendingPropertyEditing] =
    useState<Property>();
  const [pendingPropertyDeleting, setPendingPropertyDeleting] =
    useState<Property>();
  const [departments, setDepartments] = useState<TimesheetDepartment[]>([]);
  const [employeeFunctions, setEmployeeFunctions] = useState<
    EmployeeFunction[]
  >([]);
  const [employeeDepartmentsOpen, setEmployeeDepartmentsOpen] =
    useState<boolean>(false);
  const [pendingAddProperty, setPendingAddProperty] = useState<boolean>(false);
  const handleTogglePendingAddProperty = useCallback(
    (pendingAddProperty: boolean) => () =>
      setPendingAddProperty(pendingAddProperty),
    [setPendingAddProperty],
  );
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(window.innerWidth*.5);

  const loadDicts = useCallback(async () => {
    setLoadingDicts(true);
    const jobTypes = await JobTypeClientService.loadJobTypes();
    setJobTypes(jobTypes);
    const jobSubtypes = await JobSubtypeClientService.loadJobSubtypes();
    setJobSubtypes(jobSubtypes);
    setLoadingDicts(false);
    const userReq = new User();
    userReq.setId(loggedUserId);
    const loggedUser = await UserClientService.Get(userReq);
    setLoggedUser(loggedUser);
    let qlResults: QuoteLine[] = [];
    let startingPage = 0;
    const quoteReq = new QuoteLine();
    quoteReq.setIsActive(1);
    quoteReq.setIsFlatrate('1');
    quoteReq.setPageNumber(startingPage);
    quoteReq.setWithoutLimit(true);
    try {
      qlResults = (
        await QuoteLineClientService.BatchGet(quoteReq)
      ).getResultsList();
    } catch (e) {
      console.log('could not fetch results for flat rate', e);
    }

    qlResults = qlResults.sort(function (a, b) {
      if (a.getDescription() < b.getDescription()) {
        return -1;
      }
      if (a.getDescription() > b.getDescription()) {
        return 1;
      }
      return 0;
    });
    setFlatRate(qlResults);

    console.log(qlResults.length);
    if (kinds.includes('employees')) {
      //const departments = await TimesheetDepartmentClientService.loadTimeSheetDepartments();
      const departmentRequest = new TimesheetDepartment();
      departmentRequest.setIsActive(1);
      const departments = (
        await TimesheetDepartmentClientService.BatchGet(departmentRequest)
      ).getResultsList();
      setDepartments(departments);
      const employeeFunctions =
        await EmployeeFunctionClientService.loadEmployeeFunctions();
      setEmployeeFunctions(employeeFunctions);

      setIsAdmin(loggedUser.getIsAdmin());
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
        req: new Event(),
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
        criteria.filter.employeeDepartmentId = 0;
      }
      let userResults = [new User()];
      if (kind === 'customers') {
        const { results, totalCount } =
          await UserClientService.loadUsersByFilter(criteria);
        setUsers(results);
        setCount(totalCount);
      } else {
        const userReq = new User();
        userReq.setOverrideLimit(true);
        userReq.setIsEmployee(1);
        userReq.setIsActive(1);
        userReq.setOrderBy(criteria.sort.orderBy);
        userReq.setOrderDir(criteria.sort.orderDir);
        const userRes = await UserClientService.BatchGet(userReq);
        userResults = userRes.getResultsList();

        const compare = (a: User, b: User) => {
          const lastA = a.getLastname().toLowerCase();
          const lastB = b.getLastname().toLowerCase();
          const firstA = a.getFirstname().toLowerCase();
          const firstB = b.getFirstname().toLowerCase();
          if (
            criteria.sort.orderDir === 'ASC' &&
            criteria.sort.orderBy == 'user_lastname'
          ) {
            if (lastA + firstA < lastB + firstB) return -1;
            if (lastA + firstA > lastB + firstB) return 1;
          }
          if (
            criteria.sort.orderDir === 'DESC' &&
            criteria.sort.orderBy == 'user_lastname'
          ) {
            if (lastA + firstA > lastB + firstB) return -1;
            if (lastA + firstA < lastB + firstB) return 1;
          }
          if (
            criteria.sort.orderDir === 'ASC' &&
            criteria.sort.orderBy == 'user_firstname'
          ) {
            if (firstA + lastA > firstB + lastB) return -1;
            if (firstA + lastA < firstB + lastB) return 1;
          }
          if (
            criteria.sort.orderDir === 'DESC' &&
            criteria.sort.orderBy == 'user_firstname'
          ) {
            if (firstA + lastA < firstB + lastB) return -1;
            if (firstA + lastA > firstB + lastB) return 1;
          }
          return 0;
        };
        const sortedResultsList = userRes.getResultsList().sort(compare);
        setCount(userRes.getTotalCount());
        setUsers(sortedResultsList);
      }
      if (kind === 'employees') {
        const images = await Promise.all(
          userResults
            .filter(i => !!i.getImage())
            .map(async i => ({
              image: i.getImage(),
              url: await S3ClientService.getFileS3BucketUrl(
                i.getImage(),
                'kalos-employee-images',
              ),
            })),
        );

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
        req: new Property(),
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
        req: new Contract(),
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
      setLoadedDicts(true);
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
    (pendingEventEditing?: Event) => () => {
      if (pendingEventEditing) {
        document.location.href = [
          getCFAppUrl('admin:service.editServicecall'),
          `id=${pendingEventEditing.getId()}`,
          `user_id=${pendingEventEditing.getCustomer()?.getId()}`,
          `property_id=${pendingEventEditing.getProperty()?.getId()}`,
        ].join('&');
      }
      // setPendingEventEditing(pendingEventEditing); // TODO restore when EditServiceCall is finished
    },
    [],
  );
  const handlePendingEventEditingNewToggle = useCallback(
    (pendingEventEditingNew?: Event, showFull = false, openDrawer = false) => () => {
      console.log(pendingEventEditingNew);
      setPendingEventEditingNew(pendingEventEditingNew);
      if (showFull) {
        setOpenDrawer(openDrawer);
      }
    },
    [setPendingEventEditingNew, setOpenDrawer],
  );
  const handlePendingEventDeletingToggle = useCallback(
    (pendingEventDeleting?: Event) => () =>
      setPendingEventDeleting(pendingEventDeleting),
    [setPendingEventDeleting],
  );
  const handleDeleteServiceCall = useCallback(async () => {
    if (pendingEventDeleting) {
      const id = pendingEventDeleting.getId();
      setPendingEventDeleting(undefined);
      setLoading(true);
      await EventClientService.deleteEventById(id);
      setLoaded(false);
    }
  }, [pendingEventDeleting, setLoaded, setPendingEventDeleting, setLoading]);
  const handleDeleteCustomer = useCallback(async () => {
    if (pendingCustomerDeleting) {
      const id = pendingCustomerDeleting.getId();
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
      const id = pendingEmployeeDeleting.getId();
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
      const id = pendingPropertyDeleting.getId();
      const actLog = new ActivityLog();
      actLog.setUserId(loggedUserId);
      actLog.setPropertyId(id);
      actLog.setActivityName(
        `Deleting Property : ${pendingPropertyDeleting.getAddress()}`,
      );
      actLog.setActivityDate(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
      setPendingPropertyDeleting(undefined);
      setLoading(true);
      try {
        await PropertyClientService.deletePropertyById(id);
        await ActivityLogClientService.Create(actLog);
      } catch (err) {
        console.error(err);
      }
      setLoaded(false);
    }
  }, [
    pendingPropertyDeleting,
    setLoaded,
    setPendingPropertyDeleting,
    setLoading,
    loggedUserId,
  ]);
  const handlePendingEmployeeViewingToggle = useCallback(
    (pendingEmployeeViewing?: User) => () =>
      setPendingEmployeeViewing(pendingEmployeeViewing),
    [setPendingEmployeeViewing],
  );
  const handlePendingEmployeeEditingToggle = useCallback(
    (pendingEmployeeEditing?: User) => () =>
      setPendingEmployeeEditing(pendingEmployeeEditing),
    [setPendingEmployeeEditing],
  );
  const handlePendingEmployeeDeletingToggle = useCallback(
    (pendingEmployeeDeleting?: User) => () =>
      setPendingEmployeeDeleting(pendingEmployeeDeleting),
    [setPendingEmployeeDeleting],
  );
  const handlePendingCustomerViewingToggle = useCallback(
    (pendingCustomerViewing?: User) => () =>
      setPendingCustomerViewing(pendingCustomerViewing),
    [setPendingCustomerViewing],
  );
  const handlePendingCustomerEditingToggle = useCallback(
    (pendingCustomerEditing?: User) => () =>
      setPendingCustomerEditing(pendingCustomerEditing),
    [setPendingCustomerEditing],
  );
  const onSaveCustomer = useCallback(() => {
    setPendingCustomerEditing(undefined);
    setLoaded(false);
  }, [setPendingCustomerEditing, setLoaded]);
  const onSaveEmployee = useCallback(
    async (data: User) => {
      if (pendingEmployeeEditing) {
        setSaving(true);
        if (employeeUploadedPhoto) {
          await uploadFileToS3Bucket(
            data.getImage(),
            employeeUploadedPhoto,
            'kalos-employee-images',
          );
        }
        const newData = makeSafeFormObject(data, new User());
        const address = newData.getAddress();
        const city = newData.getCity();
        const addressState = newData.getState();
        const zip = newData.getZip();

        const geo = await MapClientService.loadGeoLocationByAddress(
          `${address}, ${city}, ${addressState} ${zip}`,
        );
        if (geo) {
          newData.setGeolocationLat(geo.geolocationLat);
          newData.setGeolocationLng(geo.geolocationLng);
        }
        if (newData.getFieldMaskList().length > 0) {
          await UserClientService.saveUser(
            newData,
            pendingEmployeeEditing.getId(),
          );
        }
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
    (pendingCustomerDeleting?: User) => () =>
      setPendingCustomerDeleting(pendingCustomerDeleting),
    [setPendingCustomerDeleting],
  );
  const handlePendingPropertyViewingToggle = useCallback(
    (pendingPropertyViewing?: Property) => () =>
      setPendingPropertyViewing(pendingPropertyViewing),
    [setPendingPropertyViewing],
  );
  const handlePendingPropertyEditingToggle = useCallback(
    (pendingPropertyEditing?: Property) => () =>
      setPendingPropertyEditing(pendingPropertyEditing),
    [setPendingPropertyEditing],
  );
  const onSaveProperty = useCallback(() => {
    setPendingPropertyEditing(undefined);
    setPendingAddProperty(false);
    setLoaded(false);
  }, [setPendingPropertyEditing, setLoaded, setPendingAddProperty]);
  const handlePendingPropertyDeletingToggle = useCallback(
    (pendingPropertyDeleting?: Property) => () =>
      setPendingPropertyDeleting(pendingPropertyDeleting),
    [setPendingPropertyDeleting],
  );
  const handleAccountingToggle = useCallback(
    () => setAccounting(!accounting),
    [accounting, setAccounting],
  );
  const handleSelectEvent = useCallback(
    (event: Event) => () => {
      if (accounting) {
        window.open(
          [
            getCFAppUrl('admin:service.editServicecall'),
            `id=${event.getId()}`,
            `user_id=${event.getCustomer()?.getId()}`,
            `property_id=${event.getProperty()?.getId()}`,
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
    setPendingEmployeeEditing(pendingEmployeeEditing);
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
            ...jobTypes.map(jt => ({ label: jt.getName(), value: jt.getId() })),
          ],
        },
        {
          name: 'jobSubtypeId',
          label: 'Job Subtype',
          options: [
            { label: OPTION_ALL, value: 0 },
            ...jobSubtypes.map(jst => ({
              label: jst.getName(),
              value: jst.getId(),
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
            ...departments.map(d => ({
              label: `${d.getValue()} - ${d.getDescription()}`,
              value: d.getId(),
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
          name: 'id',
          label: 'Badge',
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

  const SCHEMA_EMPLOYEES_VIEW: Schema<User> = [
    [
      {
        name: 'getEmail',
        label: 'Email',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getFirstname',
        label: 'First Name',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getLastname',
        label: 'Last Name',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getPhone',
        label: 'Phone',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getExt',
        label: 'Phone ext.',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getEmpTitle',
        label: 'Title',
        readOnly: true,
      },
    ],
    [
      {
        name: 'getEmployeeDepartmentId',
        label: 'Department',
        options: departments.map(d => ({
          label: `${d.getValue()} - ${d.getDescription()}`,
          value: d.getId(),
        })),
        readOnly: true,
      },
    ],
  ];
  const makeSchemaEmployeesEdit = (entry: User): Schema<User> => [
    [{ name: 'getIsEmployee', type: 'hidden' }],
    [{ headline: true, label: 'Personal Details' }],
    [
      {
        name: 'getFirstname',
        label: 'First Name',
        required: true,
      },
      {
        name: 'getLastname',
        label: 'Last Name',
        required: true,
      },
    ],
    [
      {
        name: 'getAddress',
        label: 'Street Address',
        multiline: true,
      },
      {
        name: 'getCity',
        label: 'City',
      },
      {
        name: 'getZip',
        label: 'Zipcode',
      },
      {
        name: 'getState',
        label: 'State',
        options: USA_STATES_OPTIONS,
      },
    ],
    [
      {
        name: 'getEmpTitle',
        label: 'Title',
      },
      // {
      //   name: 'id', // TODO
      //   label: 'Hire Date',
      // },
      {
        name: 'getEmployeeFunctionId',
        label: 'Employee Role',
        options: employeeFunctions.map(ef => ({
          label: ef.getName(),
          value: ef.getId(),
        })),
      },
      {
        name: 'getEmployeeDepartmentId',
        label: 'Employee Segment',
        options: departments.map(d => ({
          label: `${d.getValue()} - ${d.getDescription()}`,
          value: d.getId(),
        })),
        required: true,
      },
    ],
    [
      {
        name: 'getPhone',
        label: 'Primary Phone',
      },
      {
        name: 'getCellphone',
        label: 'Cell Phone',
      },
      {
        name: 'getExt',
        label: 'Ext',
      },
      {
        name: 'getToolFund',
        label: 'Tool Fund Allowance',
      },
    ],
    [
      {
        name: 'getEmail',
        label: 'Email',
      },
      {
        name: 'getPhoneEmail',
        label: 'Email-to-SMS',
      },
      {},
      {},
    ],
    [{ headline: true, label: 'Employee Permission Details' }],
    [
      {
        name: 'getServiceCalls',
        label: 'Runs Service Calls',
        type: 'checkbox',
      },
      {
        name: 'getIsAdmin',
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
        name: 'getPaidServiceCallStatus',
        label: '"Paid" Service Call Status',
        type: 'checkbox',
      },
      {
        name: 'getShowBilling',
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
        name: 'getIsOfficeStaff',
        label: 'Office Staff',
        type: 'checkbox',
      },
      {
        name: 'getIsHvacTech',
        label: 'Hvac Tech',
        type: 'checkbox',
      },
      // {
      //   name: 'isAdmin', // FIXME can_access_reports
      //   label: 'Access Reports',
      //   type: 'checkbox',
      // },
      {
        name: 'getTechAssist',
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
        name: 'getIsColorMute',
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
        name: 'getHireDate',
        label: 'Hire Date',
        type: 'date',
        disabled: true,
      },
      {
        name: 'getAnnualHoursPto',
        label: 'Annual PTO Allowance',
        type: 'number',
      },
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
              employeeUploadedPhoto || entry.getImage()
                ? {
                    backgroundImage: `url('${
                      employeeUploadedPhoto || employeeImages[entry.getImage()]
                    }')`,
                  }
                : {}
            }
          />
        ),
      },
      {
        name: 'getImage',
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
              ...(eventsSort.orderByField === 'getDateStarted'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getDateStarted',
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
              ...(eventsSort.orderByField === 'getLogJobNumber'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getLogJobNumber',
                orderBy: 'log_jobNumber',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Type',
              ...(eventsSort.orderByField === 'getJobTypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getJobTypeId',
                orderBy: 'job_type_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Subtype',
              ...(eventsSort.orderByField === 'getJobSubtypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getJobSubtypeId',
                orderBy: 'job_subtype_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
          ]
        : [
            {
              name: 'Date Started',
              ...(eventsSort.orderByField === 'getDateStarted'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getDateStarted',
                orderBy: 'date_started',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            { name: 'Customer Name - Business Name' },
            { name: 'Address City Zip Phone' },
            {
              name: 'Job # / PO',
              ...(eventsSort.orderByField === 'getLogJobNumber'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getLogJobNumber',
                orderBy: 'log_jobNumber',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Type / Subtype',
              ...(eventsSort.orderByField === 'getJobTypeId'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getJobTypeId',
                orderBy: 'job_type_id',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
            {
              name: 'Job Status',
              ...(eventsSort.orderByField === 'getLogJobStatus'
                ? {
                    dir: eventsSort.orderDir,
                  }
                : {}),
              onClick: handleEventsSortChange({
                orderByField: 'getLogJobStatus',
                orderBy: 'log_jobStatus',
                orderDir: eventsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
              }),
            },
          ];
    if (kind === 'customers')
      return [
        {
          name: 'First Name',
          ...(usersSort.orderByField === 'getFirstname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getFirstname',
            orderBy: 'user_firstname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Last Name',
          ...(usersSort.orderByField === 'getLastname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getLastname',
            orderBy: 'user_lastname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Business Name',
          ...(usersSort.orderByField === 'getBusinessname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getBusinessname',
            orderBy: 'user_businessname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Primary Phone',
          ...(usersSort.orderByField === 'getPhone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getPhone',
            orderBy: 'user_phone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Email',
          ...(usersSort.orderByField === 'getEmail'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getEmail',
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
          ...(usersSort.orderByField === 'getLastname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getLastname',
            orderBy: 'user_lastname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Title',
          ...(usersSort.orderByField === 'getBusinessname'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getBusinessname',
            orderBy: 'user_businessname',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Email',
          ...(usersSort.orderByField === 'getEmail'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getEmail',
            orderBy: 'user_email',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Office, ext.',
          ...(usersSort.orderByField === 'getPhone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getPhone',
            orderBy: 'user_phone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Cell',
          ...(usersSort.orderByField === 'getCellphone'
            ? {
                dir: usersSort.orderDir,
              }
            : {}),
          onClick: handleUsersSortChange({
            orderByField: 'getCellphone',
            orderBy: 'user_cellphone',
            orderDir: usersSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];
    if (kind === 'properties')
      return [
        {
          name: 'Address',
          ...(propertiesSort.orderByField === 'getAddress'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'getAddress',
            orderBy: 'property_address',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Subdivision',
          ...(propertiesSort.orderByField === 'getSubdivision'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'getSubdivision',
            orderBy: 'property_subdivision',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'City',
          ...(propertiesSort.orderByField === 'getCity'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'getCity',
            orderBy: 'property_City',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Zip Code',
          ...(propertiesSort.orderByField === 'getZip'
            ? {
                dir: propertiesSort.orderDir,
              }
            : {}),
          onClick: handlePropertiesSortChange({
            orderByField: 'getZip',
            orderBy: 'property_zip',
            orderDir: propertiesSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];
    if (kind === 'contracts')
      return [
        {
          name: 'Contract #',
          ...(contractsSort.orderByField === 'getNumber'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'getNumber',
            orderBy: 'number',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Start Date',
          ...(contractsSort.orderByField === 'getDateStarted'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'getDateStarted',
            orderBy: 'dateStarted',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract End Date',
          ...(contractsSort.orderByField === 'getDateEnded'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'getDateEnded',
            orderBy: 'dateEnded',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Business Name',
          ...(contractsSort.orderByField === 'getBusinessName'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'getBusinessName',
            orderBy: 'businessName',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
        {
          name: 'Contract Last Name',
          ...(contractsSort.orderByField === 'getLastName'
            ? {
                dir: contractsSort.orderDir,
              }
            : {}),
          onClick: handleContractsSortChange({
            orderByField: 'getLastName',
            orderBy: 'lastName',
            orderDir: contractsSort.orderDir === 'ASC' ? 'DESC' : 'ASC',
          }),
        },
      ];

    return [];
  };
  const handleContractClick = useCallback(
    (entry: Contract) => () => {
      window.open(
        cfURL(
          'admin:contracts.summary',
          `&contract_id=${entry.getId()}&lsort=contract_number&lorder=ASC&lmaxrow=40&lstartrow=1&lnamesearch=&lsearchfield=special`,
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
              const dateStarted = entry.getDateStarted();
              const customer = entry.getCustomer();
              const property = entry.getProperty();
              const logJobNumber = entry.getLogJobNumber();
              const jt = entry.getJobType();
              const jst = entry.getJobSubtype();
              const logJobStatus = entry.getLogJobStatus();
              const logPo = entry.getLogPo();
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
                                  `&id=${entry.getId()}&user_id=${property?.getUserId()}&property_id=${entry.getPropertyId()}`,
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
                          : handlePendingCustomerViewingToggle(customer),
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
                        ? property?.getAddress() || ''
                        : `${getPropertyAddress(
                            property,
                          )} ${UserClientService.getCustomerPhone(customer)}`,
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : handlePendingPropertyViewingToggle(property),
                    },
                    ...(accounting
                      ? [
                          {
                            value: property?.getCity() || '',
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
                            value: property?.getZip() || '',
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
                            value: property?.getPhone() || '',
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
                                  `&id=${entry.getId()}&user_id=${property?.getUserId()}&property_id=${entry.getPropertyId()}`,
                                ),
                                '_blank',
                              ),
                    },
                    {
                      value: (
                        <span style={canceledStyle}>
                          {accounting ? jt : `${jt} / ${jst}`}
                        </span>
                      ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          : () =>
                              window.open(
                                cfURL(
                                  'service.editServiceCall',
                                  `&id=${entry.getId()}&user_id=${property?.getUserId()}&property_id=${entry.getPropertyId()}`,
                                ),
                                '_blank',
                              ),
                    },
                    {
                      value: (
                        <span style={canceledStyle}>
                          {accounting ? jst : logJobStatus}
                        </span>
                      ),
                      onClick:
                        onSelectEvent || accounting
                          ? handleSelectEvent(entry)
                          :
                              // window.open(
                              //   cfURL(
                              //     'service.editServiceCall',
                              //     `&id=${entry.getId()}&user_id=${property?.getUserId()}&property_id=${entry.getPropertyId()}`,
                              //   ),
                              //   '_blank',
                              // ),
                              handlePendingEventEditingNewToggle(entry, true, true),
                      actions: [
                        ...(onSelectEvent
                          ? []
                          : [
                              <Tooltip
                                key="cfEditSC"
                                content="Edit Service Call"
                                placement="top"
                              >
                                <IconButton
                                  key="edit"
                                  size="small"
                                  onClick={handlePendingEventEditingNewToggle(entry, true, true)}
                                    // () => (
                                      // window.open(
                                      //   cfURL(
                                      //     'service.editServiceCall',
                                      //     `&id=${entry.getId()}&user_id=${property?.getUserId()}&property_id=${entry.getPropertyId()}`,
                                      //   ),
                                      // );
                                      // )
                                      /* TODO: complete edit service call module */
                                    /*handlePendingEventEditingToggle(entry)*/
                                  
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>,
                              <Tooltip
                                key="jsxEditSC"
                                content="Edit Service Request"
                                placement="top"
                              >
                                <IconButton
                                  key="editNew"
                                  size="small"
                                  onClick={handlePendingEventEditingNewToggle(
                                    entry,
                                  )}
                                >
                                  <RateReviewOutlined />
                                </IconButton>
                              </Tooltip>,
                            ]),
                        ...(deletableEvents
                          ? [
                              <Tooltip
                                key="deleteSC"
                                content="Delete Service Call"
                                placement="top"
                              >
                                <IconButton
                                  key="delete"
                                  size="small"
                                  onClick={handlePendingEventDeletingToggle(
                                    entry,
                                  )}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>,
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
              return [
                {
                  value: entry.getFirstname(),
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: entry.getLastname(),
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: entry.getBusinessname(),
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: entry.getPhone(),
                  onClick: handlePendingCustomerViewingToggle(entry),
                },
                {
                  value: entry.getEmail(),
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
              .filter(u => {
                const usersFilter = filter as UsersFilter;
                const matchedFirstname = usersFilter.firstname
                  ? u
                      .getFirstname()
                      .toLowerCase()
                      .includes(usersFilter.firstname.toLowerCase())
                  : true;
                const matchedLastname = usersFilter.lastname
                  ? u
                      .getLastname()
                      .toLowerCase()
                      .includes(usersFilter.lastname.toLowerCase())
                  : true;
                const matchedEmpTitle = usersFilter.empTitle
                  ? u
                      .getEmpTitle()
                      .toLowerCase()
                      .includes(usersFilter.empTitle.toLowerCase())
                  : true;
                const matchedEmail = usersFilter.email
                  ? u
                      .getEmail()
                      .toLowerCase()
                      .includes(usersFilter.email.toLowerCase())
                  : true;
                const matchedPhone = usersFilter.phone
                  ? u
                      .getPhone()
                      .toLowerCase()
                      .includes(usersFilter.phone.toLowerCase())
                  : true;
                const matchedExt = usersFilter.ext
                  ? u
                      .getExt()
                      .toLowerCase()
                      .includes(usersFilter.ext.toLowerCase())
                  : true;
                const matchedCellphone = usersFilter.cellphone
                  ? u
                      .getCellphone()
                      .toLowerCase()
                      .includes(usersFilter.cellphone.toLowerCase())
                  : true;
                const intId = usersFilter.id ? parseInt(usersFilter.id, 10) : 0;
                const matchedId = intId > 0 ? u.getId() === intId : true;
                const matchedDepartment =
                  usersFilter.employeeDepartmentId &&
                  usersFilter.employeeDepartmentId > 0
                    ? u.getEmployeeDepartmentId() ===
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
                  matchedDepartment &&
                  matchedId
                );
              })
              .map(entry => {
                const image = entry.getImage();
                const id = entry.getId();
                const email = entry.getEmail();
                const cellphone = entry.getCellphone();
                const empTitle = entry.getEmpTitle();
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

                      ...(loggedUser
                        .getPermissionGroupsList()
                        .findIndex(p => p.getName() == 'Manager') != -1 ||
                      loggedUser
                        .getPermissionGroupsList()
                        .findIndex(p => p.getName() == 'Payroll') != -1
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

                      ...(loggedUser
                        .getPermissionGroupsList()
                        .findIndex(p => p.getName() == 'PermissionManager') !=
                      -1
                        ? [
                            <Tooltip
                              key="permission"
                              content="View/Edit Permissions"
                              placement="top"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setPendingEditPermissions(entry);
                                }}
                              >
                                <GroupIcon />
                              </IconButton>
                            </Tooltip>,
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
              const address = entry.getAddress();
              const city = entry.getCity();
              const zip = entry.getZip();
              const subdivision = entry.getSubdivision();
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
              const number = entry.getNumber();
              const dateStarted = entry.getDateStarted();
              const dateEnded = entry.getDateEnded();
              const lastName = entry.getLastName();
              const businessName = entry.getBusinessName();
              const user = new User();
              user.setId(entry.getUserId());
              const formattedDS = formatDate(dateStarted);
              const formattedDE = formatDate(dateEnded);
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
                      onClick={handlePendingCustomerViewingToggle(user)}
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
      handlePendingEventEditingNewToggle,
      deletableEvents,
      handlePendingEventDeletingToggle,
      editableCustomers,
      handlePendingCustomerEditingToggle,
      deletableCustomers,
      handlePendingEmployeeDeletingToggle,
      handlePendingCustomerDeletingToggle,
      employeeImages,
      loggedUser,
      handlePendingEmployeeViewingToggle,
      isAdmin,
      editableEmployees,
      handlePendingEmployeeEditingToggle,
      editableProperties,
      handlePendingPropertyEditingToggle,
      deletableProperties,
      handlePendingPropertyDeletingToggle,
      handleContractClick,
      openDrawer,
    ],
  );
  const makeNewEmployee = () => {
    const req = new User();
    req.setIsEmployee(1);
    return req;
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
                u => u.getId() === (filter as UsersFilter).employeeDepartmentId,
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
                onPageChange: handleChangePage,
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
                {
                  label: 'View Flat Rate',
                  onClick: () => setFlatRateIsOpen(true),
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
        styles={{width:openDrawer ? window.innerWidth-drawerWidth : "100%"}}
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
                  'Id',
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
          onSubmit={handleLoad}
          className="AdvancedSearchForm"
          disabled={loadingDicts}
        />
      )}
      <InfoTable
        columns={getColumns(filter.kind)}
        data={getData()}
        loading={loading || loadingDicts}
        hoverable
        styles={{maxWidth:openDrawer ? window.innerWidth-drawerWidth : "100%", overflowX:"scroll"}}
      />
      {openDrawer && pendingEventEditingNew && (
        <Drawer
          sx={{width:{xs: "100%", md: "50%"}, backgroundColor:"red"}}
          anchor="right"
          variant="persistent"
          open={openDrawer}
          onClose={()=>{}}
          PaperProps={
            {sx:{width:{xs: "100%", md: "50%"}, borderLeft:"8px", borderStyle:"solid", borderColor:"grey", zIndex:1}}}
          // transitionDuration={{enter: 4, exit: 4}}
          elevation={15}
        >

          <ServiceCallNew
            loggedUserId={loggedUserId}
            serviceCallId={pendingEventEditingNew.getId()}
            userID={pendingEventEditingNew.getCustomer()?.getId() || 0}
            propertyId={pendingEventEditingNew.getPropertyId()}
            onClose={handlePendingEventEditingNewToggle(undefined, true, false)}
            onSave={reload}
            />
        </Drawer>
      )}
      </div>
      {flatRateIsOpen && flatRate && (
        <Modal open onClose={() => setFlatRateIsOpen(false)}>
          <InfoTable
            columns={[{ name: 'Description' }, { name: 'Cost' }]}
            data={flatRate.map(value => {
              return [
                {
                  value: value.getDescription(),
                },
                {
                  value: usd(parseInt(value.getAdjustment())),
                },
              ];
            })}
          />
        </Modal>
      )}
      {pendingEventAdding && (
        <Modal open onClose={handlePendingEventAddingToggle(false)} fullScreen>
          <AddServiceCall
            loggedUserId={loggedUserId}
            onClose={handlePendingEventAddingToggle(false)}
            onSave={reload}
          />
        </Modal>
      )}
      {pendingEventEditing && pendingEventEditing.getCustomer() && (
        <Modal
          open
          onClose={handlePendingEventEditingToggle(undefined)}
          fullScreen
        >
          <ServiceCall
            loggedUserId={loggedUserId}
            serviceCallId={pendingEventEditing.getId()}
            userID={pendingEventEditing.getCustomer()?.getId() || 0}
            propertyId={pendingEventEditing.getPropertyId()}
            onClose={handlePendingEventEditingToggle(undefined)}
            onSave={reload}
          />
        </Modal>
      )}
      {pendingEventEditingNew && !openDrawer && (
        <Modal
          open
          onClose={handlePendingEventEditingNewToggle(undefined)}
          fullScreen
        >
          <ServiceRequest
            loggedUserId={loggedUserId}
            serviceCallId={pendingEventEditingNew.getId()}
            userID={pendingEventEditingNew.getCustomer()?.getId() || 0}
            propertyId={pendingEventEditingNew.getPropertyId()}
            onClose={handlePendingEventEditingNewToggle(undefined)}
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
          name={`with Job # ${pendingEventDeleting.getLogJobNumber()}`}
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
            userID={pendingCustomerViewing.getId()}
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
            userId={pendingCustomerEditing.getId()}
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

      {pendingEditPermissions && (
        <Modal
          fullScreen={true}
          open={pendingEditPermissions != undefined}
          onClose={() => setPendingEditPermissions(undefined)}
        >
          <EmployeePermissions
            loggedUserId={loggedUserId}
            userId={pendingEditPermissions.getId()}
            onClose={() => setPendingEditPermissions(undefined)}
          ></EmployeePermissions>
        </Modal>
      )}
      {pendingPropertyViewing && (
        <Modal
          open
          onClose={handlePendingPropertyViewingToggle(undefined)}
          fullScreen
        >
          {!propertyCustomerId && (
            <CustomerInformation
              userID={pendingPropertyViewing.getUserId()}
              propertyId={pendingPropertyViewing.getId()}
              onClose={handlePendingPropertyViewingToggle(undefined)}
            />
          )}
          <PropertyInfo
            loggedUserId={loggedUserId}
            userID={pendingPropertyViewing.getUserId()}
            propertyId={pendingPropertyViewing.getId()}
            viewedAsCustomer={!!propertyCustomerId}
            onClose={handlePendingPropertyViewingToggle(undefined)}
          />
        </Modal>
      )}
      {pendingPropertyEditing && (
        <Modal open onClose={handlePendingPropertyEditingToggle(undefined)}>
          <PropertyEdit
            userId={pendingPropertyEditing.getUserId()}
            propertyId={pendingPropertyEditing.getId()}
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
              pendingEmployeeViewing.getImage()
                ? {
                    backgroundImage: `url('${
                      employeeImages[pendingEmployeeViewing.getImage()]
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
            title={`${
              pendingEmployeeEditing.getId() ? 'Edit' : 'Add'
            } Employee`}
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
