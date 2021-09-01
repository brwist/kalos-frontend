import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import { InfoTable, Data, Columns } from './';
import { ExampleTitle } from '../helpers';
import { makeFakeRows } from '../../../helpers';
import { Transaction } from '@kalos-core/kalos-rpc/Transaction';

const onClick = () => console.log('Row clicked');
const actions = [
  <IconButton key={0} size="small">
    <SearchIcon />
  </IconButton>,
  <IconButton key={1} size="small">
    <EditIcon />
  </IconButton>,
];

const EXAMPLE_1: Data = [
  [
    { value: 'Row 1.0', onClick },
    { value: 'Row 1.1', onClick },
    { value: 'Row 1.2', onClick, actions },
  ],
  [
    { value: 'Row 2.0', onClick },
    { value: 'Row 2.1', onClick },
    { value: 'Row 2.2', onClick, actions },
  ],
  [
    { value: 'Row 3.0', onClick },
    { value: 'Row 3.1', onClick },
    { value: 'Row 3.2', onClick, actions },
  ],
];

const EXAMPLE_2: Data = [
  [{ value: 'Row 0' }],
  [{ value: 'Row 1.0' }, { value: 'Row 1.1' }],
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
    <ExampleTitle>Default</ExampleTitle>
    <InfoTable data={EXAMPLE_2} />
    <ExampleTitle>with columns fixed widths</ExampleTitle>
    <InfoTable
      data={EXAMPLE_1}
      columns={[
        { name: 'Column 1', width: 100 },
        { name: 'Column 2', width: 200 },
        { name: 'Column 3', width: -1 },
      ]}
    />
    <ExampleTitle>with columns and align</ExampleTitle>
    <InfoTable
      data={EXAMPLE_1}
      columns={[
        { name: 'Column 1', align: 'left' },
        { name: 'Column 2', align: 'center' },
        { name: 'Column 3', align: 'right' },
      ]}
    />
    <ExampleTitle>loading with columns and align</ExampleTitle>
    <InfoTable
      data={makeFakeRows(3, 5)}
      columns={[
        { name: 'Column 1', align: 'left' },
        { name: 'Column 2', align: 'center' },
        { name: 'Column 3', align: 'right' },
      ]}
      loading
    />
    <ExampleTitle>with columns</ExampleTitle>
    <InfoTable
      data={EXAMPLE_1}
      columns={[
        { name: 'Column 1' },
        { name: 'Column 2' },
        {
          name: 'Column 3',
          actions: [{ label: 'Action', compact: true, variant: 'outlined' }],
        },
      ]}
    />
    <ExampleTitle>compact</ExampleTitle>
    <InfoTable data={EXAMPLE_2} compact />
    <ExampleTitle>hoverable</ExampleTitle>
    <InfoTable data={EXAMPLE_2} hoverable />
    <ExampleTitle>loading</ExampleTitle>
    <InfoTable data={EXAMPLE_2} loading />
    <ExampleTitle>loading compact</ExampleTitle>
    <InfoTable data={EXAMPLE_2} loading compact />
    <ExampleTitle>no entries</ExampleTitle>
    <InfoTable
      columns={[{ name: 'Column 1' }, { name: 'Column 2' }]}
      data={[]}
    />
    <ExampleTitle>no entries compact</ExampleTitle>
    <InfoTable
      columns={[{ name: 'Column 1' }, { name: 'Column 2' }]}
      data={[]}
      compact
    />
    <ExampleTitle>no entries hoverable</ExampleTitle>
    <InfoTable
      columns={[{ name: 'Column 1' }, { name: 'Column 2' }]}
      data={[]}
      hoverable
    />
    <ExampleTitle>error</ExampleTitle>
    <InfoTable data={EXAMPLE_2} error />
    <ExampleTitle>add row button</ExampleTitle>
    <InfoTable
      data={EXAMPLE_2}
      columns={[{ name: 'Column 1' }, { name: 'Column 2' }]}
      onSaveRowButton={result => console.log('RESULT OF ROW SAVE: ', result)}
      rowButton={{
        type: new Transaction(),
        columnDefinition: {
          columnsToIgnore: [],
          columnTypeOverrides: [
            { columnName: 'Column 1', columnType: 'number' },
          ],
        },
      }}
    />
  </>
);
