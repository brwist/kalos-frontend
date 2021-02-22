import React, { FC, useState } from 'react';
import { PlainForm, Schema } from '../PlainForm';

interface Props {
  onSearch: (description: string) => void;
}

type Filter = {
  description: string;
};

export const Filter: FC<Props> = ({ onSearch }) => {
  const [filter, setFilter] = useState<Filter>({ description: '' });
  const SCHEMA_FILTER: Schema<Filter> = [
    [
      {
        name: 'description',
        type: 'search',
        label: 'Part/Labor',
        actions: [
          {
            label: 'Search',
            variant: 'outlined',
            onClick: () => onSearch(filter.description),
          },
        ],
      },
    ],
  ];
  return (
    <PlainForm<Filter>
      schema={SCHEMA_FILTER}
      data={filter}
      onChange={setFilter}
    />
  );
};
