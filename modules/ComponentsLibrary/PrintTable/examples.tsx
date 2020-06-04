import React from 'react';
import { PrintTable } from './';
import {
  getRandomFirstName,
  getRandomLastName,
  getRandomAge,
  getRandomJobTitle,
  getRandomPhone,
} from '../helpers';

export default ({ rows = 40 }: { rows?: number }) => (
  <>
    <PrintTable
      columns={['First Name', 'Last Name', 'Age', 'Title', 'PTO', 'Phone']}
      data={[...Array(rows)].map(() => [
        getRandomFirstName(),
        getRandomLastName(),
        getRandomAge(),
        getRandomJobTitle(),
        `${Math.ceil(Math.random() * 160)} hours`,
        getRandomPhone(),
      ])}
    />
  </>
);
