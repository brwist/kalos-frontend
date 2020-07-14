import React from 'react';
import { PrintTable } from './';
import {
  getRandomFirstName,
  getRandomLastName,
  getRandomAge,
  getRandomJobTitle,
  getRandomPhone,
  ExampleTitle,
} from '../helpers';

export default ({ rows = 30 }: { rows?: number }) => (
  <>
    <ExampleTitle>with align</ExampleTitle>
    <PrintTable
      columns={[
        'First Name',
        'Last Name',
        { title: 'Age', align: 'right' },
        { title: 'Title', align: 'center' },
        { title: 'PTO', align: 'right' },
        { title: 'Phone', align: 'right' },
      ]}
      data={[...Array(rows)].map(() => [
        getRandomFirstName(),
        getRandomLastName(),
        getRandomAge(),
        getRandomJobTitle(),
        `${Math.ceil(Math.random() * 160)} hours`,
        getRandomPhone(),
      ])}
    />
    <ExampleTitle>with column widths</ExampleTitle>
    <PrintTable
      columns={[
        { title: 'First Name', align: 'left', widthPercentage: 50 },
        { title: 'Last Name', align: 'left', widthPercentage: 25 },
        { title: 'Age', align: 'left' },
      ]}
      data={[...Array(3)].map(() => [
        getRandomFirstName(),
        getRandomLastName(),
        getRandomAge(),
      ])}
    />
    <ExampleTitle>noBorders</ExampleTitle>
    <PrintTable
      columns={['First Name', 'Last Name', 'Age']}
      data={[...Array(3)].map(() => [
        getRandomFirstName(),
        getRandomLastName(),
        getRandomAge(),
      ])}
      noBorders
    />
    <ExampleTitle>empty data</ExampleTitle>
    <PrintTable columns={['First Name', 'Last Name', 'Age']} data={[]} />
    <ExampleTitle>empty data with noEntriesText</ExampleTitle>
    <PrintTable
      columns={['First Name', 'Last Name', 'Age']}
      data={[]}
      noEntriesText="Lorem ipsum..."
    />
    <ExampleTitle>empty data with skipNoEntriesTest</ExampleTitle>
    <PrintTable
      columns={['First Name', 'Last Name', 'Age']}
      data={[]}
      skipNoEntriesTest
    />
  </>
);
