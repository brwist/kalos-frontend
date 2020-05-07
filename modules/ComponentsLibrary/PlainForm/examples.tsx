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
  coverImage: string;
};

export const model: Model = {
  firstName: 'John',
  lastName: 'Doe',
  gender: GENDERS[0],
  login: 'test',
  password: '123456',
  note: `Lorem ipsum dolor sit amet. Abon fergo irgo fingo.
dolor sit
amet`,
  mailing: 1,
  dob: '1980-11-23 00:00:00',
  hour: '21:45',
  technician: '0',
  signature: '',
  coverImage: '',
};

export const SCHEMA_1: Schema<Model> = [
  [
    {
      name: 'firstName',
      label: 'First Name',
    },
  ],
  [
    {
      name: 'lastName',
      label: 'Last Name',
    },
  ],
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
    {
      name: 'firstName',
      label: 'First Name',
    },
    {
      name: 'lastName',
      label: 'Last Name',
    },
    {
      name: 'gender',
      label: 'Gender',
      options: GENDERS,
      actions: [
        {
          label: 'Add new',
          variant: 'text',
        },
      ],
      actionsInLabel: true,
    },
    {
      name: 'dob',
      label: 'Date of birth',
      type: 'date',
    },
    {
      name: 'hour',
      label: 'Hour',
      type: 'time',
    },
  ],
  [
    {
      label: 'Login detail',
      headline: true,
    },
  ],
  [
    {
      name: 'login',
      label: 'Login',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      helperText: 'Min 3 characters long',
      required: true,
      actions: [
        {
          label: 'Random',
          variant: 'outlined',
        },
        {
          label: 'Show',
          variant: 'outlined',
        },
      ],
    },
    {
      name: 'mailing',
      label: 'Mailing',
      type: 'checkbox',
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'file',
      onFileLoad: file => console.log(file),
    },
  ],
  [
    {
      label: 'Various',
      headline: true,
    },
  ],
  [
    {
      name: 'note',
      label: 'Note',
      multiline: true,
      actions: [
        {
          label: 'Copy from clipboard',
          variant: 'text',
        },
      ],
      actionsInLabel: true,
    },
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
      fullWidth
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
