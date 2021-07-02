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

const USER_SCHEMA: Schema<User> = [
  [
    { label: 'First Name', name: 'getFirstname', type: 'search' },
    { label: 'Last Name', name: 'getLastname', type: 'search' },
    { label: 'Business Name', name: 'getBusinessname', type: 'search' },
    { label: 'Primary Phone', name: 'getPhone', type: 'search' },
    { label: 'Email', name: 'getEmail', type: 'search' },
  ],
];

const PROPERTY_SCHEMA: Schema<Property> = [
  [{ label: 'Filter', headline: true }],
  [
    { label: 'Address', name: 'getAddress', type: 'search' },
    { label: 'Subdivision', name: 'getSubdivision', type: 'search' },
    { label: 'City', name: 'getCity', type: 'search' },
    { label: 'Zip Code', name: 'getZip', type: 'search' },
  ],
  [
    { label: 'Owner First Name', name: 'getFirstname', type: 'search' },
    { label: 'Owner Last Name', name: 'getLastname', type: 'search' },
    { label: 'Owner Business Name', name: 'getBusinessname', type: 'search' },
    { label: 'Owner Primary Phone', name: 'getPhone', type: 'search' },
    { label: 'Owner Email', name: 'getEmail', type: 'search' },
  ],
  [{ label: 'Results', headline: true }],
];

// ? Was entry, was changed to SearchOutput to not break Property Info
type SearchOutput = (User | Property) & {
  kind: number;
  __user?: User;
};

export type Kind = 'Customers' | 'Properties';

interface Props {
  kinds: Kind[];
  open: boolean;
  onClose: () => void;
  onSelect: (entry: SearchOutput) => void;
  excludeId?: number;
}

const kindsByName: { [key in Kind]: number } = {
  Customers: 1,
  Properties: 2,
};

const schemasByName: { [key in Kind]: Schema<any> } = {
  Customers: USER_SCHEMA,
  Properties: PROPERTY_SCHEMA,
};

const columnsByName: { [key in Kind]: Columns } = {
  Customers: [
    { name: 'Name' },
    { name: 'Business Name' },
    { name: 'Primary Phone' },
    { name: 'Email' },
  ],
  Properties: [{ name: 'Address' }, { name: 'Subdivision' }, { name: 'Owner' }],
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
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [propertySearch, setPropertySearch] = useState<Property>(
    new Property(),
  );
  const [userSearch, setUserSearch] = useState<User>(new User());
  const [kind, setKind] = useState<Kind>('Customers');
  const [entries, setEntries] = useState<User[] | Property[] | null>();
  const load = useCallback(async () => {
    setLoading(true);
    let newUsers = {};
    if (kind === 'Customers') {
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
        if (userSearch.getLastname()) req.setLastname(userSearch.getLastname());
        if (userSearch.getBusinessname())
          req.setBusinessname(userSearch.getBusinessname());
        if (userSearch.getPhone()) req.setPhone(userSearch.getPhone());
        if (userSearch.getEmail()) req.setEmail(userSearch.getEmail());
        const res = await UserClientService.BatchGet(req);
        setEntries(res.getResultsList());
      }
    } else if (kind === 'Properties') {
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
        if (userSearch.getLastname()) req.setLastname(userSearch.getLastname());
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
            propertySearch.setUserId(userId);
            try {
              const res = await PropertyClientService.BatchGet(
                propertySearch as Property,
              );
              return res.getResultsList().map(item => ({ ...item, kind: 2 }));
            } catch (e) {
              return [];
            }
          }),
        );
        setEntries(res.getResultsList());
      } else if (
        propertySearch.getAddress() ||
        propertySearch.getCity() ||
        propertySearch.getZip()
      ) {
        const res = await PropertyClientService.BatchGet(
          propertySearch as Property,
        );
        const propertyEntries = res
          .getResultsList()
          .filter(e => e.getId() !== excludeId);
        const propertyUsers = await UserClientService.loadUsersByIds(
          propertyEntries.map(property => property.getUserId()),
        );
        newUsers = { ...newUsers, ...propertyUsers };
        setEntries(propertyEntries);
      }
    }
    setUsers({ ...users, ...newUsers });
    setLoading(false);
  }, [kind, users, userSearch, propertySearch, excludeId]);

  const handlePropertySearch = useCallback(
    (search: Property) => {
      setPropertySearch(search);
      load();
    },
    [setPropertySearch, load],
  );
  const handleUserSearch = useCallback(
    (search: User) => {
      setUserSearch(search);
      load();
    },
    [load],
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
    (newKind: Kind) => {
      if (kind !== newKind) {
        if (kind === 'Customers') handleUserSearch(userSearch);
        if (kind === 'Properties') handlePropertySearch(propertySearch);
      }
    },
    [handlePropertySearch, handleUserSearch, kind, propertySearch, userSearch],
  );

  const handleSelect = useCallback((entry: User | Property) => {
    console.log('Selected: ', entry);
  }, []);

  // const handleSelect = useCallback(
  //   (entry: Entry) => () => {
  //     onSelect({
  //       ...entry,
  //       ...(Object.prototype.hasOwnProperty.call(entry, 'userId')
  //         ? {
  //             __user: users[entry.getId()],
  //           }
  //         : {}),
  //     } as Entry);
  //     onClose();
  //   },
  //   [onSelect, onClose, users],
  // );

  // const schema: {
  //   [key: number]: {
  //     columns: Columns;
  //     schema: Schema<Entry>;
  //   };
  // } = {
  //   1: {
  //     columns: [
  //       { name: 'Name' },
  //       { name: 'Business Name' },
  //       { name: 'Primary Phone' },
  //       { name: 'Email' },
  //     ],
  //     schema: [
  //       [{ label: 'Filter', headline: true }],
  //       [
  //         {
  //           label: 'Search',
  //           name: 'kind',
  //           options: searchOptions,
  //           onChange: handleChangeKind,
  //         },
  //       ],
  //       [{ label: 'Results', headline: true }],
  //     ] as Schema<Entry>,
  //   },
  //   2: {
  //     columns: [
  //       { name: 'Address' },
  //       { name: 'Subdivision' },
  //       { name: 'Owner' },
  //     ],
  //     schema: [
  //       [{ label: 'Filter', headline: true }],
  //       [
  //         {
  //           label: 'Search',
  //           name: 'kind',
  //           options: searchOptions,
  //           onChange: handleChangeKind,
  //         },
  //         { label: 'Address', name: 'address', type: 'search' },
  //         { label: 'Subdivision', name: 'subdivision', type: 'search' },
  //         { label: 'City', name: 'city', type: 'search' },
  //         { label: 'Zip Code', name: 'zip', type: 'search' },
  //       ],
  //       [
  //         { label: 'Owner First Name', name: 'firstname', type: 'search' },
  //         { label: 'Owner Last Name', name: 'lastname', type: 'search' },
  //         { label: 'Owner Business Name', name: 'business', type: 'search' },
  //         { label: 'Owner Primary Phone', name: 'phone', type: 'search' },
  //         { label: 'Owner Email', name: 'email', type: 'search' },
  //       ],
  //       [{ label: 'Results', headline: true }],
  //     ] as Schema<Entry>,
  //   },
  // };
  const data: Data = loading
    ? makeFakeRows()
    : entries!.map(entry => {
        let newEntry = new User();
        newEntry.setFirstname(entry.getFirstname());
        console.log('New entry: ', newEntry);
        console.log('Entry: ', entry);
        if (kind === 'Customers') {
          return [
            {
              value: `${newEntry.getFirstname()} ${newEntry.getLastname()}`,
              onClick: () => handleSelect(entry),
            },
            {
              value: newEntry.getBusinessname(),
              onClick: () => handleSelect(entry),
            },
            {
              value: newEntry.getPhone(),
              onClick: () => handleSelect(entry),
            },
            {
              value: newEntry.getEmail(),
              onClick: () => handleSelect(entry),
            },
          ];
        }
        if (kind === 'Properties') {
          return [
            {
              value: `${newEntry.getAddress()}, ${newEntry.getCity()}, ${newEntry.getState()} ${newEntry.getZip()}`,
              onClick: () => handleSelect(entry),
            },
            {
              value: '',
              onClick: () => handleSelect(entry),
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
              onClick: () => handleSelect(entry),
            },
          ];
        }
        return [];
      });

  const FILTER_SCHEMA: Schema<{ kind: string }> = [
    [
      {
        label: 'Search',
        name: 'kind',
        options: searchOptions,
        onChange: newKind => handleChangeKind(newKind as Kind),
      },
    ],
  ];

  let schemaToUse = kind;
  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <PlainForm<User>
        schema={USER_SCHEMA}
        data={userSearch}
        onChange={handleSetUserSearch}
      />
      <Form
        title="Search"
        submitLabel="Search"
        cancelLabel="Close"
        schema={schemasByName[kind]}
        data={propertySearch}
        onClose={onClose}
        onSave={handlePropertySearch}
      >
        <InfoTable
          columns={columnsByName[kind]}
          data={data}
          loading={loading}
          hoverable
        />
      </Form>
    </Modal>
  );
};
