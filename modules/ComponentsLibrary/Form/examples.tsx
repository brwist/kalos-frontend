import React from 'react';
import { Form, Schema } from './';

const GENDERS = ['Male', 'Female', 'Other'];

type Model = {
  firstName: string;
  lastName: string;
  gender: string;
  login: string;
  password: string;
  note: string;
};

const model: Model = {
  firstName: 'John',
  lastName: 'Doe',
  gender: GENDERS[0],
  login: 'test',
  password: '123456',
  note: `Lorem ipsum
dolor sit
amet`,
};

const SCHEMA_1: Schema<Model> = [
  [{ name: 'firstName', label: 'First Name' }],
  [{ name: 'lastName', label: 'Last Name' }],
];

const SCHEMA_2: Schema<Model> = [
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
    { name: 'password', label: 'Password', type: 'password', required: true },
  ],
  [{ label: 'Various', headline: true }],
  [{ name: 'note', label: 'Note', multiline: true }],
];

const SCHEMA_3: Schema<Model> = [
  [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
  ],
];

export default () => (
  <>
    <Form<Model>
      title="Form"
      schema={SCHEMA_1}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
    />
    <hr />
    <Form<Model>
      title="Form"
      schema={SCHEMA_2}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
    />
    <hr />
    <Form<Model>
      title="Form"
      schema={SCHEMA_3}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
      disabled
    />
  </>
);
