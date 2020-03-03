import React, { FC, useState, useCallback, useEffect } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { Modal } from '../Modal';
import { Form, Schema, Options } from '../Form';
import { InfoTable, Data } from '../InfoTable';
import { makeFakeRows } from '../../../helpers';

const UserClientService = new UserClient(ENDPOINT);

type Entry = User.AsObject & {
  kind: number;
};

type Style = {};

interface Props extends Style {
  open: boolean;
  onClose: () => void;
  onSelect: (entry: Entry) => void;
}

const SEARCH_OPTIONS: Options = [{ label: 'Customers', value: 1 }];

const SEARCH_SCHEMA: Schema<Entry> = [
  [{ label: 'Filter', headline: true }],
  [
    { label: 'Search', name: 'kind', options: SEARCH_OPTIONS },
    { label: 'First Name', name: 'firstname', type: 'search' },
    { label: 'Last Name', name: 'lastname', type: 'search' },
    { label: 'Business Name', name: 'businessname', type: 'search' },
    { label: 'Primary Phone', name: 'phone', type: 'search' },
    { label: 'Email', name: 'email', type: 'search' },
  ],
  [{ label: 'Matched results', headline: true }],
];

export const Search: FC<Props> = ({ open, onClose, onSelect }: Props) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<Entry>({ kind: 1 } as Entry);

  const load = useCallback(
    async (search: Entry) => {
      setLoading(true);
      const entry = new User();
      const { firstname, lastname, businessname, phone, email } = search;
      entry.setPageNumber(page);
      if (firstname) {
        entry.setFirstname(`%${firstname}%`);
      }
      if (lastname) {
        entry.setLastname(`%${lastname}%`);
      }
      if (businessname) {
        entry.setBusinessname(`%${businessname}%`);
      }
      if (phone) {
        entry.setPhone(`%${phone}%`);
      }
      if (email) {
        entry.setEmail(`%${email}%`);
      }
      const { resultsList, totalCount } = (
        await UserClientService.BatchGet(entry)
      ).toObject();
      setLoaded(true);
      setEntries(resultsList.map(item => ({ ...item, kind: 1 })));
      setCount(totalCount);
      setLoading(false);
    },
    [setLoading, page, setLoaded, setEntries, setCount, search],
  );

  useEffect(() => {
    if (open && !loaded) {
      load(search);
    }
  }, [loaded, load, open]);

  const handleChangePage = useCallback(
    (page: number) => {
      setPage(page);
      setLoaded(false);
    },
    [setPage, setLoaded],
  );

  const handleSearch = useCallback(
    (search: Entry) => {
      setSearch(search);
      load(search);
    },
    [setSearch, load],
  );

  const handleSelect = useCallback(
    (entry: Entry) => () => {
      onSelect(entry);
      onClose();
    },
    [onSelect, onClose],
  );

  const data: Data = loading
    ? makeFakeRows()
    : entries.map(entry => {
        const { firstname, lastname, businessname, phone, email } = entry;
        return [
          {
            value: (
              <strong>
                {firstname} {lastname}
              </strong>
            ),
            onClick: handleSelect(entry),
          },
          {
            value: businessname,
            onClick: handleSelect(entry),
          },
          {
            value: phone,
            onClick: handleSelect(entry),
          },
          {
            value: email,
            onClick: handleSelect(entry),
          },
        ];
      });
  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <Form
        title="Search"
        submitLabel="Search"
        cancelLabel="Close"
        schema={SEARCH_SCHEMA}
        data={search}
        onClose={onClose}
        onSave={handleSearch}
        pagination={{
          count,
          page,
          rowsPerPage: ROWS_PER_PAGE,
          onChangePage: handleChangePage,
        }}
      >
        <InfoTable data={data} loading={loading} hoverable />
      </Form>
    </Modal>
  );
};
