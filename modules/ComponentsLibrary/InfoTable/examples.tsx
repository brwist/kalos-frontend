import React from 'react';
import { InfoTable, Data } from './';

const EXAMPLE_1: Data = [
  [{ value: 'Row 0' }],
  [
    { value: 'Row 1.0' },
    { value: 'Row 1.1', actions: [<span>Actions...</span>] },
  ],
  [{ value: 'Row 2.0' }, { value: 'Row 2.1' }, { value: 'Row 2.2' }],
  [{ label: 'Label 3', value: 'Row 3' }],
  [
    { label: 'Label 4.0', value: 'Row 4.0', href: 'tel' },
    { label: 'Label 4.1', value: 'Row 4.1', href: 'mailto' },
  ],
  [
    { label: 'Label 5.0', value: 'Row 5.0' },
    { label: 'Label 5.1', value: 'Row 5.1' },
    { label: 'Label 5.2', value: 'Row 5.2' },
  ],
];

export default () => (
  <>
    <InfoTable data={EXAMPLE_1} />
    <InfoTable data={EXAMPLE_1} compact />
    <InfoTable data={EXAMPLE_1} hoverable />
    <InfoTable data={EXAMPLE_1} loading />
    <InfoTable data={EXAMPLE_1} error />
  </>
);
