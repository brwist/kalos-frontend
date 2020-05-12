import React, { FC, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Button } from '../../ComponentsLibrary/Button';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import {
  loadUsersByFilter,
  getCFAppUrl,
  UserType,
  makeFakeRows,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
} from '../../../helpers';
import { ROWS_PER_PAGE } from '../../../constants';

type SearchBy =
  | 'First Name'
  | 'Last Name'
  | 'Business Name'
  | 'Email'
  | 'Primary Phone';

const SEARCH_BY: SearchBy[] = [
  'First Name',
  'Last Name',
  'Business Name',
  'Email',
  'Primary Phone',
];

type Form = {
  searchBy: SearchBy;
  searchPhrase: string;
};

const getSearchInit = {
  searchBy: SEARCH_BY[0],
  searchPhrase: '',
};

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const AddServiceCall: FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<Form>(getSearchInit);
  const [entries, setEntries] = useState<UserType[]>([]);
  const [formKey, setFormKey] = useState<number>(0);
  const load = useCallback(
    async (_page?: number) => {
      setLoading(true);
      const { results, totalCount } = await loadUsersByFilter({
        page: _page === undefined ? page : _page,
        ...search,
        withProperties: true,
      });
      setEntries(results);
      setCount(totalCount);
      setLoading(false);
    },
    [search, page, setEntries, setCount, setLoading],
  );
  const handleReset = useCallback(() => {
    setSearch(getSearchInit);
    setFormKey(formKey + 1);
  }, [setSearch, formKey, setFormKey]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      load(page);
    },
    [setPage, load],
  );
  const handleSearch = useCallback(() => load(), [load]);
  const SCHEMA: Schema<Form> = [
    [
      {
        headline: true,
        label: 'Search Customer',
      },
    ],
    [
      {
        name: 'searchBy',
        label: 'Search By',
        options: SEARCH_BY,
      },
      {
        name: 'searchPhrase',
        label: 'Search Phrase',
        type: 'search',
        actions: [
          {
            label: 'Search',
            onClick: handleSearch,
          },
          { label: 'Reset', variant: 'outlined', onClick: handleReset },
        ],
      },
    ],
    [
      {
        headline: true,
        label: (
          <div>
            or
            <Button
              label="View Complete Customer Listing"
              url={getCFAppUrl('admin:customers.dashboard')}
              variant="text"
              size="xsmall"
              compact
            />
            <Button
              label="Add Customer"
              url={getCFAppUrl('admin:customers.add')}
              variant="text"
              size="xsmall"
              compact
            />
          </div>
        ),
      },
    ],
  ];
  return (
    <div>
      <SectionBar
        title="New Service Call"
        pagination={{
          count,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handlePageChange,
          page,
        }}
      />
      <PlainForm<Form>
        key={formKey}
        schema={SCHEMA}
        data={search}
        onChange={setSearch}
        compact
        className={classes.form}
      />
      {loading ? (
        <InfoTable data={makeFakeRows()} loading />
      ) : (
        entries.map(entry => (
          <div key={entry.id}>
            <InfoTable
              columns={[
                {
                  name: (
                    <Link
                      href={[
                        getCFAppUrl('admin:customers.details'),
                        `id=${entry.id}`,
                      ].join('&')}
                    >
                      <strong>{getCustomerNameAndBusinessName(entry)}</strong>
                    </Link>
                  ),
                },
              ]}
              data={entry.propertiesList.map(property => [
                {
                  value: (
                    <Link
                      href={[
                        getCFAppUrl('admin:service.addserviceCall'),
                        `user_id=${entry.id}`,
                        `property_id=${property.id}`,
                      ].join('&')}
                    >
                      {getPropertyAddress(property)}
                    </Link>
                  ),
                },
              ])}
            />
          </div>
        ))
      )}
    </div>
  );
};
