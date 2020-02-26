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
    <InfoTable
      data={[
        [{ value: 'Row 1.0' }, { value: 'Row 1.1' }, { value: 'Row 1.2' }],
        [{ value: 'Row 2.0' }, { value: 'Row 2.1' }, { value: 'Row 2.2' }],
        [{ value: 'Row 3.0' }, { value: 'Row 3.1' }, { value: 'Row 3.2' }],
      ]}
      columns={[
        { name: 'Column 1' },
        { name: 'Column 2' },
        { name: 'Column 3' },
      ]}
    />
    <hr />
    <InfoTable data={EXAMPLE_1} />
    <hr />
    <InfoTable data={EXAMPLE_1} compact />
    <hr />
    <InfoTable data={EXAMPLE_1} hoverable />
    <hr />
    <InfoTable data={EXAMPLE_1} loading />
    <hr />
    <InfoTable data={EXAMPLE_1} error />
  </>
);
