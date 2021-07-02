import React, { FC, useState, useCallback } from 'react';
import { UserClient, User } from '@kalos-core/kalos-rpc/User';
import { PropertyClient, Property } from '@kalos-core/kalos-rpc/Property';
import { ENDPOINT } from '../../../constants';
import { Modal } from '../Modal';
import { Form, Schema, Options } from '../Form';
import { InfoTable, Data, Columns } from '../InfoTable';
import { makeFakeRows, makeSafeFormObject } from '../../../helpers';
import { PlainForm } from '../PlainForm';

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
  const [userSearch, setUserSearch] = useState<User>(new User());
  const { kind } = search;

  const load = useCallback(
    async (search: Entry) => {
      setLoading(true);
      setEntries([]);
      let entries: Entry[] = [];
      const { kind } = search;
      let newUsers = {};
      if (kind === 1) {
        console.log('Search: ', userSearch);
        console.log(typeof search);
        if (
          userSearch?.getFirstname() ||
          userSearch?.getLastname() ||
          userSearch?.getBusinessname() ||
          userSearch?.getPhone() ||
          userSearch?.getEmail()
        ) {
          let req = new User();
          if (userSearch.getFirstname())
            req.setFirstname(userSearch.getFirstname());
          if (userSearch.getLastname())
            req.setLastname(userSearch.getLastname());
          if (userSearch.getBusinessname())
            req.setBusinessname(userSearch.getBusinessname());
          if (userSearch.getPhone()) req.setPhone(userSearch.getPhone());
          if (userSearch.getEmail()) req.setEmail(userSearch.getEmail());
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
          userSearch?.getFirstname() ||
          userSearch?.getLastname() ||
          userSearch?.getBusinessname() ||
          userSearch?.getPhone() ||
          userSearch?.getEmail()
        ) {
          let req = new User();
          if (userSearch.getFirstname())
            req.setFirstname(userSearch.getFirstname());
          if (userSearch.getLastname())
            req.setLastname(userSearch.getLastname());
          if (userSearch.getBusinessname())
            req.setBusinessname(userSearch.getBusinessname());
          if (userSearch.getPhone()) req.setPhone(userSearch.getPhone());
          if (userSearch.getEmail()) req.setEmail(userSearch.getEmail());
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
    [users, userSearch, excludeId],
  );

  const handleSearch = useCallback(
    (search: Entry) => {
      setSearch(search);
      console.log('search: ', search);
      load(search);
    },
    [setSearch, load],
  );

  const handleSetUserSearch = useCallback(
    (newUserSearch: User) => {
      let safe = new User();
      makeSafeFormObject(newUserSearch, safe);
      setUserSearch(safe);
    },
    [setUserSearch],
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

  const user_schema: Schema<User> = [
    [
      { label: 'First Name', name: 'getFirstname', type: 'search' },
      { label: 'Last Name', name: 'getLastname', type: 'search' },
      { label: 'Business Name', name: 'getBusinessname', type: 'search' },
      { label: 'Primary Phone', name: 'getPhone', type: 'search' },
      { label: 'Email', name: 'getEmail', type: 'search' },
    ],
  ];

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
        let newEntry = new User();
        newEntry = makeSafeFormObject(entry as User, newEntry);
        if (kind === 1) {
          return [
            {
              value: `${newEntry.getFirstname()} ${newEntry.getLastname()}`,
              onClick: handleSelect(entry),
            },
            {
              value: newEntry.getBusinessname(),
              onClick: handleSelect(entry),
            },
            {
              value: newEntry.getPhone(),
              onClick: handleSelect(entry),
            },
            {
              value: newEntry.getEmail(),
              onClick: handleSelect(entry),
            },
          ];
        }
        if (kind === 2) {
          return [
            {
              value: `${newEntry.getAddress()}, ${newEntry.getCity()}, ${newEntry.getState()} ${newEntry.getZip()}`,
              onClick: handleSelect(entry),
            },
            {
              value: '',
              onClick: handleSelect(entry),
            },
            {
              value: (
                <>
                  {newEntry.getFirstname()} {newEntry.getLastname()}
                  {newEntry.getBusinessname()
                    ? `, ${newEntry.getBusinessname()}`
                    : ''}
                  {(newEntry.getPhone() || newEntry.getEmail()) && <br />}
                  {newEntry.getPhone()}
                  {newEntry.getPhone() && newEntry.getEmail() && ', '}
                  {newEntry.getEmail()}
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
      <PlainForm<User>
        schema={user_schema}
        data={userSearch}
        onChange={handleSetUserSearch}
      />
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
