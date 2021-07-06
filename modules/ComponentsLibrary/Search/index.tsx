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
  const [loading, setLoading] = useState<boolean>(false);
  const [propertySearch, setPropertySearch] = useState<Property>(
    new Property(),
  );
  const [userSearch, setUserSearch] = useState<User>(new User());
  const [kind, setKind] = useState<Kind>('Customers');
  const [entries, setEntries] = useState<User[] | Property[]>([]);
  const load = useCallback(
    async (searchInput: User | Property) => {
      setLoading(true);
      if (kind === 'Customers') {
        searchInput = makeSafeFormObject(searchInput, new User());
        let req = new User();
        if (searchInput.getFirstname())
          req.setFirstname(searchInput.getFirstname());
        if (searchInput.getLastname())
          req.setLastname(searchInput.getLastname());
        if (searchInput.getBusinessname())
          req.setBusinessname(searchInput.getBusinessname());
        if (searchInput.getPhone()) req.setPhone(searchInput.getPhone());
        if (searchInput.getEmail()) req.setEmail(searchInput.getEmail());
        const res = await UserClientService.BatchGet(req);
        setEntries(res.getResultsList());
      } else if (kind === 'Properties') {
        searchInput = makeSafeFormObject(searchInput, new Property());
        if (
          searchInput?.getFirstname() ||
          searchInput?.getLastname() ||
          searchInput?.getBusinessname() ||
          searchInput?.getPhone() ||
          searchInput?.getEmail()
        ) {
          let req = new User();
          if (searchInput.getFirstname())
            req.setFirstname(searchInput.getFirstname());
          if (searchInput.getLastname())
            req.setLastname(searchInput.getLastname());
          if (searchInput.getBusinessname())
            req.setBusinessname(searchInput.getBusinessname());
          if (searchInput.getPhone()) req.setPhone(searchInput.getPhone());
          if (searchInput.getEmail()) req.setEmail(searchInput.getEmail());
          const res = await UserClientService.BatchGet(req);
          const userIds = res
            .getResultsList()
            .map(e => e.getId())
            .filter(id => id !== excludeId);
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
          setEntries(propertyEntries);
        }
      }
      setLoading(false);
    },
    [kind, propertySearch, excludeId],
  );

  const handleSetKind = useCallback(
    (newKind: Kind) => {
      setKind(newKind);
    },
    [setKind],
  );
  const handlePropertySearch = useCallback(
    (search: Property) => {
      setPropertySearch(search);
      load(search as Property);
    },
    [setPropertySearch, load],
  );
  const handleUserSearch = useCallback(
    (search: User) => {
      setUserSearch(search);
      load(search as User);
    },
    [load],
  );

  const handleSetUserSearch = useCallback(
    (newUserSearch: User) => {
      setUserSearch(newUserSearch);
    },
    [setUserSearch],
  );

  const handleSetPropertySearch = useCallback(
    (newPropertySearch: Property) => {
      setPropertySearch(newPropertySearch);
    },
    [setPropertySearch],
  );

  const handleChangeKind = useCallback(
    (newKind: Kind) => {
      if (newKind === 'Customers') handleUserSearch(userSearch);
      if (newKind === 'Properties') handlePropertySearch(propertySearch);
    },
    [handlePropertySearch, handleUserSearch, propertySearch, userSearch],
  );

  const handleSelect = useCallback((entry: User | Property) => {
    console.log('Selected: ', entry);
  }, []);

  const data: Data = loading
    ? makeFakeRows()
    : entries!.map(entry => {
        if (kind === 'Customers') {
          return [
            {
              value: `${entry.getFirstname()} ${entry.getLastname()}`,
              onClick: () => handleSelect(entry),
            },
            {
              value: entry.getBusinessname(),
              onClick: () => handleSelect(entry),
            },
            {
              value: entry.getPhone(),
              onClick: () => handleSelect(entry),
            },
            {
              value: entry.getEmail(),
              onClick: () => handleSelect(entry),
            },
          ];
        }
        if (kind === 'Properties') {
          return [
            {
              value: `${entry.getAddress()}, ${entry.getCity()}, ${entry.getState()} ${entry.getZip()}`,
              onClick: () => handleSelect(entry),
            },
            {
              value: '',
              onClick: () => handleSelect(entry),
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
              onClick: () => handleSelect(entry),
            },
          ];
        }
        return [];
      });

  const FILTER_SCHEMA: Schema<{ kind: Kind }> = [
    [
      {
        label: 'Search',
        name: 'kind',
        options: searchOptions,
        onChange: newKind =>
          handleChangeKind(newKind === 1 ? 'Customers' : 'Properties'), // TODO extend this to work with more options in the future
      },
    ],
  ];

  return (
    <Modal open={open} onClose={onClose} fullScreen>
      <PlainForm
        schema={FILTER_SCHEMA}
        data={{ kind: kind }}
        onChange={changed =>
          handleSetKind(Number(changed.kind) == 1 ? 'Customers' : 'Properties')
        }
      />
      <Form<User | Property>
        title="Search"
        submitLabel="Search"
        cancelLabel="Close"
        schema={schemasByName[kind]}
        data={kind === 'Customers' ? userSearch : propertySearch}
        onClose={onClose}
        onSave={
          kind === 'Customers'
            ? (search: User | Property) => {
                handleSetUserSearch(search as User);
                handleUserSearch(search as User);
              }
            : (search: User | Property) => {
                handleSetPropertySearch(search as Property);
                handlePropertySearch(search as Property);
              }
        }
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
