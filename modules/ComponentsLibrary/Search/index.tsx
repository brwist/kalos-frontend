import React, { FC, useState, useCallback } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT } from '../../../constants';
import { Modal } from '../Modal';
import { Form, Schema, Options } from '../Form';
import { InfoTable, Data, Columns } from '../InfoTable';
import { makeFakeRows } from '../../../helpers';

const UserClientService = new UserClient(ENDPOINT);
const PropertyClientService = new PropertyClient(ENDPOINT);

type Entry = (User | Property) & {
  kind: number;
  __user?: User;
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
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<Entry>({
    kind: kindsByName[kinds[0]],
    __user: new User(),
  } as Entry);
  const { kind } = search;

  const load = useCallback(
    async (search: Entry) => {
      setLoading(true);
      setEntries([]);
      let entries: Entry[] = [];
      const { kind } = search;
      let newUsers = {};
      if (kind === 1) {
        console.log('Search: ', search.__user);
        console.log(typeof search);
        if (
          search.firstname ||
          search.lastname ||
          search.businessname ||
          search.phone ||
          search.email
        ) {
          let req = new User();
          if (search.firstname) req.setFirstname(search.firstname);
          if (search.lastname) req.setLastname(search.lastname);
          if (search.businessname) req.setBusinessname(search.businessname);
          if (search.phone) req.setPhone(search.phone);
          if (search.email) req.setEmail(search.email);
          const res = await UserClientService.BatchGet(req);
          entries = [
            ...entries,
            ...res
              .getResultsList()
              .filter(e => e.getId() !== excludeId)
              .map(item => ({ ...item, kind: 1 } as Entry)),
          ];
        }
      } else if (kind === 2) {
        if (
          search.firstname ||
          search.lastname ||
          search.businessname ||
          search.phone ||
          search.email
        ) {
          let req = new User();
          if (search.firstname) req.setFirstname(search.firstname);
          if (search.lastname) req.setLastname(search.lastname);
          if (search.businessname) req.setBusinessname(search.businessname);
          if (search.phone) req.setPhone(search.phone);
          if (search.email) req.setEmail(search.email);
          const res = await UserClientService.BatchGet(req);
          newUsers = {
            ...newUsers,
            ...res
              .getResultsList()
              .reduce((aggr, item) => ({ ...aggr, [item.getId()]: item }), {}),
          };
          const userIds = res
            .getResultsList()
            .map(e => e.getId())
            .filter(id => id !== excludeId);
          const usersProperties = await Promise.all(
            userIds.map(async userId => {
              search.setId(userId);
              try {
                const res = await PropertyClientService.BatchGet(
                  search as Property,
                );
                return res.getResultsList().map(item => ({ ...item, kind: 2 }));
              } catch (e) {
                return [];
              }
            }),
          );
          entries = [
            ...entries,
            ...usersProperties
              .reduce((aggr, item) => [...aggr, ...item], [])
              .map(e => e as Entry),
          ];
        } else if (search.getAddress() || search.getCity() || search.getZip()) {
          const res = await PropertyClientService.BatchGet(search as Property);
          const propertyEntries = res
            .getResultsList()
            .filter(e => e.getId() !== excludeId);
          entries = [...entries, ...propertyEntries]; // FIXME handle duplicated entries
          const propertyUsers = await UserClientService.loadUsersByIds(
            propertyEntries.map(property => property.getUserId()),
          );
          newUsers = { ...newUsers, ...propertyUsers };
        }
      }
      setEntries(entries);
      setUsers({ ...users, ...newUsers });
      setLoading(false);
    },
    [setLoading, setEntries, excludeId, users],
  );

  const handleSearch = useCallback(
    (search: Entry) => {
      setSearch(search);
      console.log('search: ', search);
      load(search);
    },
    [setSearch, load],
  );

  const handleChangeKind = useCallback(
    (newKind: number) => {
      if (kind !== newKind) {
        handleSearch({ ...search, kind: newKind } as Entry);
      }
    },
    [handleSearch, kind, search],
  );

  const handleSelect = useCallback(
    (entry: Entry) => () => {
      onSelect({
        ...entry,
        ...(Object.prototype.hasOwnProperty.call(entry, 'userId')
          ? {
              __user: users[entry.getId()],
            }
          : {}),
      } as Entry);
      onClose();
    },
    [onSelect, onClose, users],
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
      columns: [
        { name: 'Address' },
        { name: 'Subdivision' },
        { name: 'Owner' },
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
          { label: 'Address', name: 'address', type: 'search' },
          { label: 'Subdivision', name: 'subdivision', type: 'search' },
          { label: 'City', name: 'city', type: 'search' },
          { label: 'Zip Code', name: 'zip', type: 'search' },
        ],
        [
          { label: 'Owner First Name', name: 'firstname', type: 'search' },
          { label: 'Owner Last Name', name: 'lastname', type: 'search' },
          { label: 'Owner Business Name', name: 'business', type: 'search' },
          { label: 'Owner Primary Phone', name: 'phone', type: 'search' },
          { label: 'Owner Email', name: 'email', type: 'search' },
        ],
        [{ label: 'Results', headline: true }],
      ] as Schema<Entry>,
    },
  };
  const data: Data = loading
    ? makeFakeRows()
    : entries.map(entry => {
        if (kind === 1) {
          return [
            {
              value: `${entry.getFirstname()} ${entry.getLastname()}`,
              onClick: handleSelect(entry),
            },
            {
              value: entry.getBusinessname(),
              onClick: handleSelect(entry),
            },
            {
              value: entry.getPhone(),
              onClick: handleSelect(entry),
            },
            {
              value: entry.getEmail(),
              onClick: handleSelect(entry),
            },
          ];
        }
        if (kind === 2) {
          return [
            {
              value: `${entry.getAddress()}, ${entry.getCity()}, ${entry.getState()} ${entry.getZip()}`,
              onClick: handleSelect(entry),
            },
            {
              value: '',
              onClick: handleSelect(entry),
            },
            {
              value: (
                <>
                  {entry.getFirstname()} {entry.getLastname()}
                  {entry.getBusinessname()
                    ? `, ${entry.getBusinessname()}`
                    : ''}
                  {(entry.getPhone() || entry.getEmail()) && <br />}
                  {entry.getPhone()}
                  {entry.getPhone() && entry.getEmail() && ', '}
                  {entry.getEmail()}
                </>
              ),
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
