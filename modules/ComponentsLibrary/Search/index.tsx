import React, { FC, useState, useCallback, useEffect } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT, ROWS_PER_PAGE } from '../../../constants';
import { Modal } from '../Modal';
import { Form, Schema, Options } from '../Form';
import { InfoTable, Data, Columns } from '../InfoTable';
import { makeFakeRows } from '../../../helpers';

const UserClientService = new UserClient(ENDPOINT);
const PropertyClientService = new PropertyClient(ENDPOINT);

type Entry = (User.AsObject | Property.AsObject) & {
  kind: number;
};

export type Kind = 'Customers' | 'Properties';

interface Props {
  kinds: Kind[];
  open: boolean;
  onClose: () => void;
  onSelect: (entry: Entry) => void;
  excludeId?: number;
}

const kindsByName: { [key in Kind]: number } = {
  Customers: 1,
  Properties: 2,
};

export const Search: FC<Props> = ({
  kinds,
  open,
  onClose,
  onSelect,
  excludeId,
}: Props) => {
  const searchOptions: Options = kinds.map(kind => ({
    label: kind,
    value: kindsByName[kind],
  }));
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<Entry>({
    kind: kindsByName[kinds[0]],
  } as Entry);
  const { kind } = search;

  const load = useCallback(
    async (search: Entry) => {
      setLoading(true);
      const { kind } = search;
      if (kind === 1) {
        const {
          firstname,
          lastname,
          businessname,
          phone,
          email,
        } = search as User.AsObject;
        const entry = new User();
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
        setEntries(
          resultsList
            .filter(({ id }) => id !== excludeId)
            .map(item => ({ ...item, kind: 1 })),
        );
        setCount(totalCount);
      } else if (kind === 2) {
        const { address, subdivision, city, zip } = search as Property.AsObject;
        const entry = new Property();
        entry.setPageNumber(page);
        if (address) {
          entry.setAddress(`%${address}%`);
        }
        if (subdivision) {
          entry.setSubdivision(`%${subdivision}%`);
        }
        if (city) {
          entry.setCity(`%${city}%`);
        }
        if (zip) {
          entry.setZip(`%${zip}%`);
        }
        const { resultsList, totalCount } = (
          await PropertyClientService.BatchGet(entry)
        ).toObject();
        setLoaded(true);
        setEntries(
          resultsList
            .filter(({ id }) => id !== excludeId)
            .map(item => ({ ...item, kind: 2 })),
        );
        setCount(totalCount);
      }
      setLoading(false);
    },
    [setLoading, page, setLoaded, setEntries, setCount, search, excludeId],
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

  const handleChangeKind = useCallback(
    (newKind: number) => {
      if (kind !== newKind) {
        handleSearch({ kind: newKind } as Entry);
      }
    },
    [handleSearch, kind],
  );

  const handleSelect = useCallback(
    (entry: Entry) => () => {
      onSelect(entry);
      onClose();
    },
    [onSelect, onClose],
  );

  const schema: {
    [key: number]: {
      columns: Columns;
      schema: Schema<Entry>;
    };
  } = {
    1: {
      columns: [
        { name: 'Name' },
        { name: 'Business Name' },
        { name: 'Primary Phone' },
        { name: 'Email' },
      ],
      schema: [
        [{ label: 'Filter', headline: true }],
        [
          {
            label: 'Search',
            name: 'kind',
            options: searchOptions,
            onChange: handleChangeKind,
          },
          { label: 'First Name', name: 'firstname', type: 'search' },
          { label: 'Last Name', name: 'lastname', type: 'search' },
          { label: 'Business Name', name: 'businessname', type: 'search' },
          { label: 'Primary Phone', name: 'phone', type: 'search' },
          { label: 'Email', name: 'email', type: 'search' },
        ],
        [{ label: 'Results', headline: true }],
      ] as Schema<Entry>,
    },
    2: {
      columns: [{ name: 'Address' }, { name: 'Subdivision' }],
      schema: [
        [{ label: 'Filter', headline: true }],
        [
          {
            label: 'Search',
            name: 'kind',
            options: searchOptions,
            onChange: handleChangeKind,
          },
          { label: 'Address', name: 'address', type: 'search' },
          { label: 'Subdivision', name: 'subdivision', type: 'search' },
          { label: 'City', name: 'city', type: 'search' },
          { label: 'Zip Code', name: 'zip', type: 'search' },
        ],
        [{ label: 'Results', headline: true }],
      ] as Schema<Entry>,
    },
  };
  const data: Data = loading
    ? makeFakeRows()
    : entries.map(entry => {
        if (kind === 1) {
          const {
            firstname,
            lastname,
            businessname,
            phone,
            email,
          } = entry as User.AsObject;
          return [
            {
              value: `${firstname} ${lastname}`,
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
        }
        if (kind === 2) {
          const {
            address,
            subdivision,
            city,
            state,
            zip,
          } = entry as Property.AsObject;
          return [
            {
              value: `${address}, ${city}, ${zip} ${state}`,
              onClick: handleSelect(entry),
            },
            {
              value: subdivision,
              onClick: handleSelect(entry),
            },
          ];
        }
        return [];
      });
  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <Form
        title="Search"
        submitLabel="Search"
        cancelLabel="Close"
        schema={schema[kind].schema}
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
        <InfoTable
          columns={schema[kind].columns}
          data={data}
          loading={loading}
          hoverable
        />
      </Form>
    </Modal>
  );
};
