import React, { FC, useState, useCallback } from 'react';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import {
  loadUsersByFilter,
  getCFAppUrl,
  UserType,
  makeFakeRows,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
} from '../../../helpers';
import { SearchForm, FormType, getFormInit } from './SearchForm';
import { ROWS_PER_PAGE } from '../../../constants';

export const AddServiceCall: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<FormType>(getFormInit);
  const [entries, setEntries] = useState<UserType[]>([]);
  const load = useCallback(
    async (page: number, search: FormType) => {
      setLoading(true);
      const { results, totalCount } = await loadUsersByFilter({
        page,
        ...search,
        withProperties: true,
      });
      setEntries(results);
      setCount(totalCount);
      setLoading(false);
    },
    [setEntries, setCount, setLoading],
  );
  const handleReset = useCallback(() => {
    setEntries([]);
  }, [setEntries]);
  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      load(page, search);
    },
    [setPage, load, search],
  );
  const handleSearch = useCallback(
    (search: FormType) => {
      setSearch(search);
      load(page, search);
    },
    [load, setSearch, page],
  );
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
      <SearchForm onSearch={handleSearch} onReset={handleReset} />
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
