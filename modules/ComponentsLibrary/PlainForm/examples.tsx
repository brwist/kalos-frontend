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
    },
    { name: 'mailing', label: 'Mailing', type: 'checkbox' },
  ],
  [{ label: 'Various', headline: true }],
  [{ name: 'note', label: 'Note', multiline: true }],
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
