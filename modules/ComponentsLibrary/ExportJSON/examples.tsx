import React from 'react';
import { ExportJSON } from './';
import {
  ExampleTitle,
  getRandomFirstName,
  getRandomLastName,
  getRandomAge,
  getRandomJobTitle,
  getRandomPhone,
} from '../helpers';

const DATA = [...Array(40)].map(() => ({
  firstname: getRandomFirstName(),
  lastname: getRandomLastName(),
  age: getRandomAge(),
  job: getRandomJobTitle(),
  phone: getRandomPhone(),
}));

const FIELDS = [
  { label: 'First Name', value: 'firstname' },
  { label: 'Last Name', value: 'lastname' },
  { label: 'Job Title', value: 'job' },
  { label: 'Age', value: 'age' },
  { label: 'Cell Phone', value: 'phone' },
];

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <ExportJSON filename="example" json={DATA} fields={FIELDS} />
    <ExampleTitle>status loading</ExampleTitle>
    <ExportJSON
      filename="example"
      json={DATA}
      fields={FIELDS}
      status="loading"
    />
    <ExampleTitle>custom button propd</ExampleTitle>
    <ExportJSON
      filename="example"
      json={DATA}
      fields={FIELDS}
      buttonProps={{
        label: 'Export to CSV',
        variant: 'outlined',
        size: 'xsmall',
      }}
    />
  </>
);
