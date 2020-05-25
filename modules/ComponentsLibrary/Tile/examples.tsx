import React, { FC } from 'react';
import { Tile } from './';
import { Schema, Props } from '../Form';

type FormType = {
  status: number;
  startDate: string;
  endDate: string;
};

const SCHEMA: Schema<FormType> = [
  [
    {
      name: 'status',
      label: 'Job Status',
      required: true,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: true,
    },
  ],
];

const EnhancedTile: FC<Pick<Props<FormType>, 'title'>> = ({ title }) => (
  <Tile title={title} schema={SCHEMA} data={{} as FormType} onSave={() => {}} />
);

export default () => (
  <div
    style={{
      display: 'grid',
      gridGap: 8,
      gridAutoFlow: 'dense',
      gridTemplateColumns: '1fr 1fr 1fr',
    }}
  >
    {[1, 2, 3, 4, 5].map(idx => (
      <>
        <EnhancedTile title={`Lorem ipsum ${idx}`} />
        <EnhancedTile title={`Dolor sit ${idx}`} />
        <EnhancedTile title={`Amet ipsum ${idx}`} />
      </>
    ))}
  </div>
);
