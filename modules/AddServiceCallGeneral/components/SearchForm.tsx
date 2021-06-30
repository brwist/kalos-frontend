import React, { FC, useState, useCallback } from 'react';
import { Button } from '../../ComponentsLibrary/Button';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { getCFAppUrl } from '../../../helpers';
import './searchForm.less';
import { UsersFilter } from '@kalos-core/kalos-rpc/User';

interface Props {
  onSearch: (search: UsersFilter) => void;
  onReset: () => void;
  onAddCustomer: () => void;
}

export const SearchForm: FC<Props> = ({ onSearch, onReset, onAddCustomer }) => {
  const [formKey, setFormKey] = useState<number>(0);
  const [search, setSearch] = useState<UsersFilter>({});
  const handleSearch = useCallback(() => onSearch(search), [onSearch, search]);
  const handleReset = useCallback(() => {
    setSearch({});
    setFormKey(formKey + 1);
    onReset();
  }, [setSearch, setFormKey, formKey, onReset]);
  const SCHEMA: Schema<UsersFilter> = [
    [
      {
        headline: true,
        label: 'Search Customer',
      },
    ],
    [
      {
        name: 'firstname',
        label: 'First Name',
        type: 'search',
      },
      {
        name: 'lastname',
        label: 'Last Name',
        type: 'search',
      },
      {
        name: 'businessname',
        label: 'Business Name',
        type: 'search',
      },
    ],
    [
      {
        name: 'email',
        label: 'Email',
        type: 'search',
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'search',
        actions: [
          {
            label: 'Reset',
            variant: 'outlined',
            onClick: handleReset,
          },
          {
            label: 'Search',
            onClick: handleSearch,
          },
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
              onClick={onAddCustomer}
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
    <PlainForm<UsersFilter>
      key={formKey}
      schema={SCHEMA}
      data={search}
      onChange={setSearch}
      compact
      className="AddServiceCallSearchForm"
    />
  );
};
