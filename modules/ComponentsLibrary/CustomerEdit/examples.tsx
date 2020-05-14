import React from 'react';
import { CustomerEdit } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Add</ExampleTitle>
    <CustomerEdit onSave={console.log} onClose={() => console.log('CLOSE')} />

    <ExampleTitle>Edit</ExampleTitle>
    <CustomerEdit userId={2573} onClose={() => console.log('CLOSE')} />
  </>
);
