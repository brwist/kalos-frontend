import React, { FC, useState, useCallback, useEffect } from 'react';
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
import {
  loadEventsByFilter,
  loadUsersByFilter,
  loadPropertiesByFilter,
  makeFakeRows,
  formatDate,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
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
} from '../../../helpers';
import {
  ROWS_PER_PAGE,
  OPTION_ALL,
  EVENT_STATUS_LIST,
} from '../../../constants';

type Kind = 'serviceCalls' | 'customers' | 'properties';

export interface Props {
  loggedUserId: number;
  title: string;
  kinds: Kind[];
  editableEvents?: boolean;
  deletableEvents?: boolean;
  editableCustomers?: boolean;
  deletableCustomers?: boolean;
  editableProperties?: boolean;
  deletableProperties?: boolean;
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

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const AdvancedSearch: FC<Props> = ({
  loggedUserId,
  title,
  kinds,
  editableEvents,
  deletableEvents,
  editableCustomers,
  deletableCustomers,
  editableProperties,
  deletableProperties,
}) => {
  const classes = useStyles();
  const [loadedDicts, setLoadedDicts] = useState<boolean>(false);
  const [loadingDicts, setLoadingDicts] = useState<boolean>(false);
  const [jobTypes, setJobTypes] = useState<JobTypeType[]>([]);
  const [jobSubtypes, setJobSubtypes] = useState<JobSubtypeType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const defaultFilter = {
    kind: kinds[0],
    jobTypeId: 0,
    jobSubtypeId: 0,
    logJobStatus: '',
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
  const [pendingEventEditing, setPendingEventEditing] = useState<EventType>();
  const [pendingEventDeleting, setPendingEventDeleting] = useState<EventType>();
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
  const loadDicts = useCallback(async () => {
    setLoadingDicts(true);
    const jobTypes = await loadJobTypes();
    setJobTypes(jobTypes);
    const jobSubtypes = await loadJobSubtypes();
    setJobSubtypes(jobSubtypes);
    setFormKey(formKey + 1);
    setLoadingDicts(false);
  }, [setLoadingDicts, setJobTypes, setJobSubtypes, setFormKey, formKey]);
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
    if (kind === 'customers') {
      const criteria: LoadUsersByFilter = {
        page,
        filter: filterCriteria as UsersFilter,
        sort: usersSort,
      };

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
    if (!loaded) {
      setLoaded(true);
      load();
    }
    if (!loadedDicts) {
      setLoadedDicts(true);
      loadDicts();
    }
  }, [loaded, setLoaded, load, loadedDicts, setLoadedDicts, loadDicts]);
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
  }, [pendingEventDeleting, setLoaded, setPendingEventDeleting, setLoading]);
  const handleDeleteProperty = useCallback(async () => {
    if (pendingPropertyDeleting) {
      const { id } = pendingPropertyDeleting;
      setPendingPropertyDeleting(undefined);
      setLoading(true);
      await deletePropertyById(id);
      setLoaded(false);
    }
  }, [pendingEventDeleting, setLoaded, setPendingEventDeleting, setLoading]);
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
    if (kind === 'properties')
      return makeSchema(SCHEMA_PROPERTIES as Schema<SearchForm>);
    return [];
  }, [filter, jobTypes, jobSubtypes]);
  const getColumns = (kind: Kind): Columns => {
    if (kind === 'serviceCalls')
      return [
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
        {
          name: 'Name / Business Name',
        },
        {
          name: 'Address',
        },
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
        ? makeFakeRows(6, 3)
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
            return customer
              ? [
                  { value: formatDate(dateStarted) },
                  { value: getCustomerNameAndBusinessName(customer) },
                  { value: getPropertyAddress(property) },
                  { value: logJobNumber },
                  { value: `${jobType} / ${jobSubtype}` },
                  {
                    value: logJobStatus,
                    actions: [
                      ...(editableEvents
                        ? [
                            <IconButton
                              key="edit"
                              size="small"
                              onClick={handlePendingEventEditingToggle(entry)}
                            >
                              <EditIcon />
                            </IconButton>,
                          ]
                        : []),
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
                          key="edit"
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
  }, [filter, loading, events, loadingDicts]);
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
      <InfoTable
        columns={getColumns(filter.kind)}
        data={getData()}
        loading={loading || loadingDicts}
        hoverable
      />
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
          <SectionBar
            actions={[
              {
                label: 'Close',
                onClick: handlePendingCustomerViewingToggle(undefined),
              },
            ]}
            fixedActions
          />
          <CustomerInformation userID={pendingCustomerViewing.id} />
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
      {pendingPropertyEditing && (
        <Modal
          open
          onClose={handlePendingPropertyEditingToggle(undefined)}
          fullScreen
        >
          ...
          {/* <ServiceCall
            loggedUserId={loggedUserId}
            serviceCallId={pendingEventEditing.id}
            userID={pendingEventEditing.customer.id}
            propertyId={pendingEventEditing.propertyId}
            onClose={handlePendingEventEditingToggle(undefined)}
          /> */}
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
    </div>
  );
};
