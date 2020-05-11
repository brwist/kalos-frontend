import React, { FC, useState, useCallback, useEffect } from 'react';
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

export interface Props {}

type Kind = 'serviceCalls' | 'customers' | 'properties' | 'contracts';

const DEFAULT_KIND = 'serviceCalls';

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

export const Search: FC<Props> = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const searchBy = FIELDS[DEFAULT_KIND][0].value as string;
  const [filter, setFilter] = useState<SearchForm>({
    kind: DEFAULT_KIND,
    searchBy,
    searchPhrase: searchBy.endsWith('Date') ? timestamp(true) : '',
  });
  const [formKey, setFormKey] = useState<number>(0);
  const [events, setEvents] = useState<EventType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const load = useCallback(async () => {
    setLoading(true);
    const criteria = {
      page,
      searchBy: filter.searchBy,
      searchPhrase: filter.searchPhrase,
    };
    if (filter.kind === 'serviceCalls') {
      const { results, totalCount } = await loadEventsByFilter(criteria);
      setCount(totalCount);
      setEvents(results);
    } else if (filter.kind === 'customers') {
      const { results, totalCount } = await loadUsersByFilter(criteria);
      setCount(totalCount);
      setUsers(results);
    } else if (filter.kind === 'properties') {
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
      load();
    },
    [setPage, load],
  );
  const handleFormChange = useCallback(
    (data: SearchForm) => {
      const isTypeChange = data.kind !== filter.kind;
      const searchBy = FIELDS[data.kind][0].value as string;
      setFilter({
        ...data,
        ...(isTypeChange
          ? {
              searchBy,
              searchPhrase: searchBy.endsWith('Date') ? timestamp(true) : '',
            }
          : {}),
      });
      if (isTypeChange) {
        setFormKey(formKey + 1);
      }
    },
    [setFilter, filter, formKey, setFormKey],
  );
  const SCHEMA: Schema<SearchForm> = [
    [
      { name: 'kind', label: 'Search', options: TYPES },
      { name: 'searchBy', label: 'Search By', options: FIELDS[filter.kind] },
      {
        name: 'searchPhrase',
        label: 'Search Phrase',
        type: filter.searchBy.endsWith('Date') ? 'date' : 'text',
        actions: [{ label: 'Search', onClick: load }],
      },
    ],
  ];
  const getData = useCallback((): Data => {
    const { kind } = filter;
    if (kind === 'serviceCalls')
      return loading
        ? makeFakeRows(7, 3)
        : events
            .filter(({ propertyId }) => propertyId !== 0)
            .map(
              ({
                dateStarted,
                customer,
                property,
                logJobNumber,
                jobType,
                jobSubtype,
                logJobStatus,
              }) =>
                customer
                  ? [
                      { value: formatDate(dateStarted) },
                      { value: getCustomerName(customer) },
                      { value: getBusinessName(customer) },
                      { value: getPropertyAddress(property) },
                      { value: logJobNumber },
                      { value: `${jobType} / ${jobSubtype}` },
                      { value: logJobStatus },
                    ]
                  : [],
            );
    if (kind === 'customers')
      return loading
        ? makeFakeRows(5, 3)
        : users.map(({ firstname, lastname, businessname, phone, email }) => [
            { value: firstname },
            { value: lastname },
            { value: businessname },
            { value: phone },
            { value: email },
          ]);
    if (kind === 'properties')
      return loading
        ? makeFakeRows(4, 3)
        : properties.map(({ address, city, zip, subdivision }) => [
            { value: address },
            { value: subdivision },
            { value: city },
            { value: zip },
          ]);
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
      />
    </div>
  );
};
