import React, { FC, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { Button } from '../../ComponentsLibrary/Button';
import { PlainForm, Schema } from '../../ComponentsLibrary/PlainForm';
import { getCFAppUrl } from '../../../helpers';

type SearchBy =
  | 'First Name'
  | 'Last Name'
  | 'Business Name'
  | 'Email'
  | 'Primary Phone';

const SEARCH_BY: SearchBy[] = [
  'First Name',
  'Last Name',
  'Business Name',
  'Email',
  'Primary Phone',
];

export type FormType = {
  searchBy: SearchBy;
  searchPhrase: string;
};

interface Props {
  onSearch: (search: FormType) => void;
  onReset: () => void;
  onAddCustomer: () => void;
}

export const getFormInit: FormType = {
  searchBy: SEARCH_BY[0],
  searchPhrase: '',
};

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(),
  },
}));

export const SearchForm: FC<Props> = ({ onSearch, onReset, onAddCustomer }) => {
  const classes = useStyles();
  const [formKey, setFormKey] = useState<number>(0);
  const [search, setSearch] = useState<FormType>(getFormInit);
  const handleSearch = useCallback(() => onSearch(search), [onSearch, search]);
  const handleReset = useCallback(() => {
    setSearch(getFormInit);
    setFormKey(formKey + 1);
    onReset();
  }, [setSearch, setFormKey, formKey, onReset]);
  const SCHEMA: Schema<FormType> = [
    [
      {
        headline: true,
        label: 'Search Customer',
      },
    ],
    [
      {
        name: 'searchBy',
        label: 'Search By',
        options: SEARCH_BY,
      },
      {
        name: 'searchPhrase',
        label: 'Search Phrase',
        type: 'search',
        actions: [
          {
            label: 'Search',
            onClick: handleSearch,
          },
          { label: 'Reset', variant: 'outlined', onClick: handleReset },
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
    <PlainForm<FormType>
      key={formKey}
      schema={SCHEMA}
      data={search}
      onChange={setSearch}
      compact
      className={classes.form}
    />
  );
};
