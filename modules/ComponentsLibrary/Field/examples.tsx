import React from 'react';
import { Field } from './';

type Model = {
  firstName: string;
};

export default () => (
  <Field<Model>
    name="firstName"
    label="Text Field"
    value="John"
    onChange={value => console.log(value)}
    disabled
  />
);
