import React from 'react';
import { PrintTable } from './';
import {
  getRandomFirstName,
  getRandomLastName,
  getRandomAge,
  getRandomJobTitle,
  getRandomPhone,
} from '../helpers';

export default ({ rows = 30 }: { rows?: number }) => (
  <>
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
    <PrintTable
      columns={['First Name', 'Last Name', 'Age']}
      data={[...Array(3)].map(() => [
        getRandomFirstName(),
        getRandomLastName(),
        getRandomAge(),
      ])}
      noBorders
    />
  </>
);
