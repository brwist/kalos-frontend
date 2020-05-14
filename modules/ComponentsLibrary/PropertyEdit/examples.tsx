import React from 'react';
import { PropertyEdit } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Add</ExampleTitle>
    <PropertyEdit
      userId={2573}
      onSave={console.log}
      onClose={() => console.log('CLOSE')}
    />

    <ExampleTitle>Edit</ExampleTitle>
    <PropertyEdit
      userId={2573}
      propertyId={6552}
      onSave={console.log}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
