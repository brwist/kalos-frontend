import React from 'react';
import { Form, Schema } from './';

const GENDERS = ['Male', 'Female', 'Other'];

type Model = {
  firstName: string;
  lastName: string;
  gender: string;
  password: string;
  note: string;
};

const model: Model = {
  firstName: 'John',
  lastName: 'Doe',
  gender: GENDERS[0],
  password: '123456',
  note: `Lorem ipsum
dolor sit
amet`,
};

const schema: Schema<Model>[] = [
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
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
  },
  {
    name: 'note',
    label: 'Note',
    multiline: true,
  },
];

export default () => (
  <>
    <Form<Model>
      title="Form"
      schema={schema}
      data={model}
      onSave={data => console.log(data)}
      onClose={() => console.log('CANCEL')}
    />
  </>
);
