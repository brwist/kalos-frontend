import React from 'react';
import { NewContract } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <NewContract
      userID={8428}
      onSave={() => alert('Would save')}
      onClose={() => alert('Would close')}
    />
  </>
);
