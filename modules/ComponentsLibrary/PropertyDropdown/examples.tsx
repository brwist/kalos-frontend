import React from 'react';
import { PropertyDropdown } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <PropertyDropdown
      userId={22}
      onSave={saved => console.log('Would save: ', saved)}
      onClose={() => alert('Would close')}
      onChange={changed => console.log('Changed: ', changed)}
    />
  </>
);
