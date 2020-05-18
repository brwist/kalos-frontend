import React, { FC, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';
import { ActionsProps } from '../../ComponentsLibrary/Actions';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { PlainForm, Schema, Option } from '../../ComponentsLibrary/PlainForm';
import { InfoTable, Columns, Data } from '../../ComponentsLibrary/InfoTable';
import {
  loadEventsByFilter,
  loadUsersByFilter,
  loadPropertiesByFilter,
  makeFakeRows,
  formatDate,
  getCustomerName,
  getBusinessName,
  getPropertyAddress,
  EventsFilter,
  LoadEventsByFilter,
  UsersFilter,
  LoadUsersByFilter,
  PropertiesFilter,
  LoadPropertiesByFilter,
  EventType,
  UserType,
  PropertyType,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type Kind = 'serviceCalls' | 'customers' | 'properties';

export interface Props {
  defaultKind?: Kind;
}

type SearchForm = (EventsFilter | UsersFilter | PropertiesFilter) & {
  kind: Kind;
};

const TYPES: Option[] = [
  { label: 'Service Calls', value: 'serviceCalls' },
  { label: 'Customers', value: 'customers' },
  { label: 'Properties', value: 'properties' },
];

const makeColumn = (columns: string[]): Columns =>
  columns.map(name => ({ name }));

const COLUMNS: { [key in Kind]: Columns } = {
  serviceCalls: makeColumn([
    'Start Date',
    'Firstname / Lastname',
    'Business Name',
    'Address',
    'Job Number',
    'Job Type / Subtype',
    'Job Status',
  ]),
  customers: makeColumn([
    'First Name',
    'Last Name',
    'Business Name',
    'Primary Phone',
    'Email',
  ]),
  properties: makeColumn(['Address', 'Subdivision', 'City', 'Zip Code']),
};

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const Search: FC<Props> = ({ defaultKind = 'customers' }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [filter, setFilter] = useState<SearchForm>({ kind: defaultKind });
  const [formKey, setFormKey] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const { kind, ...filterCriteria } = filter;
    if (kind === 'serviceCalls') {
      const criteria: LoadEventsByFilter = {
        page,
        filter: filterCriteria,
        sort: {
          orderByField: 'dateCreated',
          orderBy: 'date_created',
          orderDir: 'desc',
        },
      };
      const { results, totalCount } = await loadEventsByFilter(criteria);
      setCount(totalCount);
      setEvents(results);
    }
    if (kind === 'customers') {
      const criteria: LoadUsersByFilter = {
        page,
        filter: filterCriteria as UsersFilter,
        sort: {
          orderByField: 'lastname',
          orderBy: 'user_lastname',
          orderDir: 'asc',
        },
      };

      const { results, totalCount } = await loadUsersByFilter(criteria);
      setCount(totalCount);
      setUsers(results);
    }
    if (kind === 'properties') {
      const criteria: LoadPropertiesByFilter = {
        page,
        filter: filterCriteria as PropertiesFilter,
        sort: {
          orderByField: 'address',
          orderBy: 'property_address',
          orderDir: 'asc',
        },
      };
      const { results, totalCount } = await loadPropertiesByFilter(criteria);
      setCount(totalCount);
      setProperties(results);
    }
    setLoading(false);
  }, [filter, page, setCount, setEvents, setUsers, setProperties, setLoading]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );
  const handleLoad = useCallback(() => setLoaded(false), [setLoaded]);
  const handleResetSearchForm = useCallback(() => {
    setFilter({
      kind: filter.kind,
    });
    setFormKey(formKey + 1);
    setLoaded(false);
  }, [setFilter, setLoaded, filter, formKey, setFormKey]);
  const handleFormChange = useCallback(
    (data: SearchForm) => {
      const isTypeChanged = data.kind !== filter.kind;
      setFilter(data);
      if (isTypeChanged) {
        setFormKey(formKey + 1);
        setLoaded(false);
      }
    },
    [setFilter, filter, formKey, setFormKey, setLoaded],
  );
  const onEventClick = useCallback(
    ({ id, customer, propertyId }: EventType) => () =>
      (window.location.href = [
        'https://app.kalosflorida.com/index.cfm?action=admin:service.editServiceCall',
        `id=${id}`,
        `user_id=${customer ? customer.id : 0}`,
        `property_id=${propertyId}`,
      ].join('&')),
    [],
  );
  const onUserClick = useCallback(
    ({ id }: UserType) => () =>
      (window.location.href = [
        'https://app.kalosflorida.com/index.cfm?action=admin:customers.details',
        `id=${id}`,
      ].join('&')),
    [],
  );
  const onUserEditClick = useCallback(
    ({ id }: UserType) => () =>
      (window.location.href = [
        'https://app.kalosflorida.com/index.cfm?action=admin:customers.edit',
        `id=${id}`,
      ].join('&')),
    [],
  );
  const onPropertyClick = useCallback(
    ({ id, userId }: PropertyType) => () =>
      (window.location.href = [
        'https://app.kalosflorida.com/index.cfm?action=admin:properties.details',
        `user_id=${userId}`,
        `property_id=${id}`,
      ].join('&')),
    [],
  );
  const onPropertyEditClick = useCallback(
    ({ id, userId }: PropertyType) => () =>
      (window.location.href = [
        'https://app.kalosflorida.com/index.cfm?action=admin:properties.edit',
        `user_id=${userId}`,
        `property_id=${id}`,
      ].join('&')),
    [],
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
        name: 'dateStarted',
        label: 'Start Date',
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
        label: 'Zip',
        type: 'search',
        actions: searchActions,
      },
    ],
  ];
  const makeSchema = (schema: Schema<SearchForm>) => {
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
  }, [filter]);
  const getData = useCallback((): Data => {
    const { kind } = filter;
    if (kind === 'serviceCalls')
      return loading
        ? makeFakeRows(7, 3)
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
                  { value: formatDate(dateStarted), onClick: onEventClick },
                  {
                    value: getCustomerName(customer),
                    onClick: onEventClick(entry),
                  },
                  {
                    value: getBusinessName(customer),
                    onClick: onEventClick(entry),
                  },
                  {
                    value: getPropertyAddress(property),
                    onClick: onEventClick(entry),
                  },
                  { value: logJobNumber, onClick: onEventClick(entry) },
                  {
                    value: `${jobType} / ${jobSubtype}`,
                    onClick: onEventClick(entry),
                  },
                  { value: logJobStatus, onClick: onEventClick(entry) },
                ]
              : [];
          });
    if (kind === 'customers')
      return loading
        ? makeFakeRows(5, 3)
        : users.map(entry => {
            const { firstname, lastname, businessname, phone, email } = entry;
            return [
              { value: firstname, onClick: onUserClick(entry) },
              { value: lastname, onClick: onUserClick(entry) },
              { value: businessname, onClick: onUserClick(entry) },
              { value: phone, onClick: onUserClick(entry) },
              {
                value: email,
                onClick: onUserClick(entry),
                actions: [
                  <IconButton
                    key={0}
                    size="small"
                    onClick={onUserEditClick(entry)}
                  >
                    <EditIcon />
                  </IconButton>,
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
              { value: address, onClick: onPropertyClick(entry) },
              { value: subdivision, onClick: onPropertyClick(entry) },
              { value: city, onClick: onPropertyClick(entry) },
              {
                value: zip,
                onClick: onPropertyClick(entry),
                actions: [
                  <IconButton
                    key={0}
                    size="small"
                    onClick={onPropertyEditClick(entry)}
                  >
                    <EditIcon />
                  </IconButton>,
                ],
              },
            ];
          });
    return [];
  }, [filter, loading, events]);
  return (
    <div>
      <SectionBar
        title="Search"
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
        loading={loading}
      />
      <PlainForm
        key={formKey}
        schema={getSchema()}
        data={filter}
        onChange={handleFormChange}
        compact
        className={classes.form}
      />
      <InfoTable
        columns={COLUMNS[filter.kind]}
        data={getData()}
        loading={loading}
        hoverable
      />
    </div>
  );
};
