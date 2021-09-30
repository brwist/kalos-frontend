import React from 'react';
import { PropertyTable } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <PropertyTable
      userId={22}
      onSave={saved => console.log('Would save: ', saved)}
      onClose={() => alert('Would close')}
    />
  </>
);
