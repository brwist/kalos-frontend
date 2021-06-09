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

type Entry = (User.AsObject | Property.AsObject) & {
  kind: number;
  __user?: User.AsObject;
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

const makeSearchUser = ({
  firstname,
  lastname,
  businessname,
  phone,
  email,
}: User.AsObject) => {
  const entry = new User();
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
  return entry;
};

const makeSearchProperty = ({
  address,
  subdivision,
  city,
  zip,
}: Property.AsObject) => {
  const entry = new Property();
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
  return entry;
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
  const [users, setUsers] = useState<{ [key: number]: User.AsObject }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<Entry>({
    kind: kindsByName[kinds[0]],
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
        const {
          firstname,
          lastname,
          businessname,
          phone,
          email,
        } = search as Property.AsObject;
        if (firstname || lastname || businessname || phone || email) {
          const entry = makeSearchUser(search as User.AsObject);
          const { resultsList } = (
            await UserClientService.BatchGet(entry)
          ).toObject();
          entries = [
            ...entries,
            ...resultsList
              .filter(({ id }) => id !== excludeId)
              .map(item => ({ ...item, kind: 1 })),
          ];
        }
      } else if (kind === 2) {
        const {
          address,
          subdivision,
          city,
          zip,
          firstname,
          lastname,
          businessname,
          phone,
          email,
        } = search as Property.AsObject;
        if (firstname || lastname || businessname || phone || email) {
          const user = makeSearchUser(search as User.AsObject);
          const { resultsList: resultsListUsers } = (
            await UserClientService.BatchGet(user)
          ).toObject();
          newUsers = {
            ...newUsers,
            ...resultsListUsers.reduce(
              (aggr, item) => ({ ...aggr, [item.id]: item }),
              {},
            ),
          };
          const userIds = resultsListUsers
            .map(({ id }) => id)
            .filter(id => id !== excludeId);
          const usersProperties = await Promise.all(
            userIds.map(async userId => {
              const entry = makeSearchProperty(search as Property.AsObject);
              entry.setUserId(userId);
              try {
                const { resultsList } = (
                  await PropertyClientService.BatchGet(entry)
                ).toObject();
                return resultsList.map(item => ({ ...item, kind: 2 }));
              } catch (e) {
                return [];
              }
            }),
          );
          entries = [
            ...entries,
            ...usersProperties.reduce((aggr, item) => [...aggr, ...item], []),
          ];
        } else if (address || subdivision || city || zip) {
          const entry = makeSearchProperty(search as Property.AsObject);
          const { resultsList } = (
            await PropertyClientService.BatchGet(entry)
          ).toObject();
          const propertyEntries = resultsList
            .filter(({ id }) => id !== excludeId)
            .map(item => ({ ...item, kind: 2 }));
          entries = [...entries, ...propertyEntries]; // FIXME handle duplicated entries
          const propertyUsers = await UserClientService.loadUsersByIds(
            propertyEntries.map(({ userId }) => userId),
          );
          newUsers = { ...newUsers, ...propertyUsers };
        }
      }
      setEntries(entries);
      setUsers({ ...users, ...newUsers });
      setLoading(false);
    },
    [setLoading, setEntries, search, excludeId, users],
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
      onSelect({
        ...entry,
        ...(entry.hasOwnProperty('userId')
          ? {
              __user: users[(entry as Property.AsObject).userId],
            }
          : {}),
      });
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
            userId,
            address,
            subdivision,
            city,
            state,
            zip,
          } = entry as Property.AsObject;
          return [
            {
              value: `${address}, ${city}, ${state} ${zip}`,
              onClick: handleSelect(entry),
            },
            {
              value: subdivision,
              onClick: handleSelect(entry),
            },
            {
              value: (
                <>
                  {users[userId].firstname} {users[userId].lastname}
                  {users[userId].businessname
                    ? `, ${users[userId].businessname}`
                    : ''}
                  {(users[userId].phone || users[userId].email) && <br />}
                  {users[userId].phone}
                  {users[userId].phone && users[userId].email && ', '}
                  {users[userId].email}
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
