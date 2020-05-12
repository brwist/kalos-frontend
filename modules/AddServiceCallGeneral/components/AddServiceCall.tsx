import React, { FC, useState, useCallback } from 'react';
import { SectionBar } from '../../ComponentsLibrary/SectionBar';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import { loadUsersByFilter, UserType, makeFakeRows } from '../../../helpers';
import { SearchForm, FormType, getFormInit } from './SearchForm';
import { CustomerItem, Props as CustomerItemProps } from './CustomerItem';
import { ROWS_PER_PAGE } from '../../../constants';

export type Props = Pick<CustomerItemProps, 'loggedUserId'>;

export const AddServiceCall: FC<Props> = props => {
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
          <CustomerItem key={entry.id} customer={entry} {...props} />
        ))
      )}
    </div>
  );
};
