import React from 'react';
import { PlainForm, Schema } from './';
import { LoremIpsumList } from '../helpers';

const GENDERS = ['Male', 'Female', 'Other'];

export type Model = {
  firstName: string;
  lastName: string;
  gender: string;
  login: string;
  password: string;
  note: string;
  mailing: number;
  dob: string;
  hour: string;
  technician: string;
  signature: string;
};

export const model: Model = {
  firstName: 'John',
  lastName: 'Doe',
  gender: GENDERS[0],
  login: 'test',
  password: '123456',
  note: `Lorem ipsum
dolor sit
amet`,
  mailing: 1,
  dob: '1980-11-23 00:00:00',
  hour: '21:45',
  technician: '0',
  signature: '',
};

export const SCHEMA_1: Schema<Model> = [
  [{ name: 'firstName', label: 'First Name' }],
  [{ name: 'lastName', label: 'Last Name' }],
];

export const SCHEMA_2: Schema<Model> = [
  [
    {
      label: 'Personal detail',
      headline: true,
      description: 'optional description',
    },
  ],
  [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'gender', label: 'Gender', options: GENDERS },
    { name: 'dob', label: 'Date of birth', type: 'date' },
  ],
  [{ label: 'Login detail', headline: true }],
  [
    { name: 'login', label: 'Login', required: true },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      helperText: 'Min 3 characters long',
      required: true,
      actions: [{ label: 'Random', size: 'xsmall', variant: 'outlined' }],
    },
    { name: 'mailing', label: 'Mailing', type: 'checkbox' },
    { name: 'hour', label: 'Hour', type: 'time' },
  ],
  [{ label: 'Various', headline: true }],
  [
    { name: 'note', label: 'Note', multiline: true },
    {
      name: 'technician',
      label: 'Technician',
      type: 'technician',
      required: true,
    },
    {
      name: 'signature',
      label: 'Signature',
      type: 'signature',
    },
  ],
];

export const SCHEMA_3: Schema<Model> = [
  [{ label: 'Personal Details', headline: true }],
  [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'mailing', label: 'Mailing', type: 'checkbox' },
  ],
];

export default () => (
  <>
    <PlainForm<Model>
      schema={SCHEMA_1}
      data={model}
      onChange={data => console.log(data)}
    >
      <LoremIpsumList />
    </PlainForm>
    <hr />
    <PlainForm<Model>
      schema={SCHEMA_1}
      data={model}
      onChange={data => console.log(data)}
      validations={{
        firstName: 'This field is too short',
        lastName: 'This field is too weird',
      }}
      compact
    />
    <hr />
    <PlainForm<Model>
      schema={SCHEMA_2}
      data={model}
      onChange={data => console.log(data)}
    />
    <hr />
    <PlainForm<Model>
      schema={SCHEMA_3}
      data={model}
      onChange={data => console.log(data)}
      disabled
    />
  </>
);
