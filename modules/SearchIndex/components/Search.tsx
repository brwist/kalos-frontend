import React, { FC, useState, useCallback, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';
import { Event } from '@kalos-core/kalos-rpc/Event';
import { User } from '@kalos-core/kalos-rpc/User';
import { Property } from '@kalos-core/kalos-rpc/Property';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { PlainForm, Schema, Option } from '../../ComponentsLibrary/PlainForm';
import { InfoTable, Columns, Data } from '../../ComponentsLibrary/InfoTable';
import {
  timestamp,
  makeOptions,
  loadEventsByFilter,
  loadUsersByFilter,
  loadPropertiesByFilter,
  makeFakeRows,
  formatDate,
  getCustomerName,
  getBusinessName,
  getPropertyAddress,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type EventType = Event.AsObject;
type UserType = User.AsObject;
type PropertyType = Property.AsObject;

type Kind = 'serviceCalls' | 'customers' | 'properties' | 'contracts';

export interface Props {
  defaultKind?: Kind;
}

type SearchForm = {
  kind: Kind;
  searchBy: string;
  searchPhrase: string;
};

const TYPES: Option[] = [
  { label: 'Service Calls', value: 'serviceCalls' },
  { label: 'Customers', value: 'customers' },
  { label: 'Properties', value: 'properties' },
  //   { label: 'Contracts', value: 'contracts' },
];

const makeColumn = (columns: string[]): Columns =>
  columns.map(name => ({ name }));

const FIELDS: { [key in Kind]: Option[] } = {
  serviceCalls: makeOptions([
    'Start Date',
    'Job Number',
    'Business Name',
    'Lastname',
    'Address',
    'City',
    'Zip Code',
  ]),
  customers: makeOptions([
    'First Name',
    'Last Name',
    'Business Name',
    'Primary Phone',
    'Email',
  ]),
  properties: makeOptions(['Address', 'Subdivision', 'City', 'Zip Code']),
  contracts: makeOptions([]),
};

const COLUMNS: { [key in Kind]: Columns } = {
  serviceCalls: makeColumn([
    'Start Date',
    'Customer Name',
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
  contracts: makeColumn([]),
};

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const Search: FC<Props> = ({ defaultKind = 'serviceCalls' }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const searchBy = FIELDS[defaultKind][0].value as string;
  const [filter, setFilter] = useState<SearchForm>({
    kind: defaultKind,
    searchBy,
    searchPhrase: searchBy.endsWith('Date') ? timestamp(true) : '',
  });
  const [formKey, setFormKey] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const load = useCallback(
    async (_criteria?: SearchForm) => {
      setLoading(true);
      const _filter = _criteria || filter;
      const criteria = {
        page,
        searchBy: _filter.searchBy,
        searchPhrase: _filter.searchPhrase,
      };
      if (_filter.kind === 'serviceCalls') {
        const { results, totalCount } = await loadEventsByFilter(criteria);
        setCount(totalCount);
        setEvents(results);
      } else if (_filter.kind === 'customers') {
        const { results, totalCount } = await loadUsersByFilter(criteria);
        setCount(totalCount);
        setUsers(results);
      } else if (_filter.kind === 'properties') {
        const { results, totalCount } = await loadPropertiesByFilter(criteria);
        setCount(totalCount);
        setProperties(results);
      }
      setLoading(false);
    },
    [filter, page, setCount, setEvents, setUsers, setProperties, setLoading],
  );
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      load();
    },
    [setPage, load],
  );
  const handleLoad = useCallback(() => load(), [load]);
  const handleFormChange = useCallback(
    (data: SearchForm) => {
      const isTypeChanged = data.kind !== filter.kind;
      const isSearchByChanged = data.searchBy !== filter.searchBy;
      const searchBy = FIELDS[data.kind][0].value as string;
      const criteria = {
        ...data,
        ...(isTypeChanged
          ? {
              searchBy,
              searchPhrase: searchBy.endsWith('Date') ? timestamp(true) : '',
            }
          : {}),
        ...(isSearchByChanged
          ? {
              searchPhrase: data.searchBy.endsWith('Date')
                ? timestamp(true)
                : '',
            }
          : {}),
      };
      setFilter(criteria);
      if (isTypeChanged || isSearchByChanged) {
        setFormKey(formKey + 1);
      }
      if (isTypeChanged) {
        load(criteria);
      }
    },
    [setFilter, filter, formKey, setFormKey, load],
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
  const SCHEMA: Schema<SearchForm> = [
    [
      { name: 'kind', label: 'Search', options: TYPES },
      { name: 'searchBy', label: 'Search By', options: FIELDS[filter.kind] },
      {
        name: 'searchPhrase',
        label: 'Search Phrase',
        type: filter.searchBy.endsWith('Date') ? 'date' : 'search',
        actions: [{ label: 'Search', onClick: handleLoad }],
      },
    ],
  ];
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
        schema={SCHEMA}
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
