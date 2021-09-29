import React from 'react';
import { NewContract } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <NewContract
      userID={8428}
      onSave={contractData => console.log('Saved: ', contractData)}
      onClose={() => alert('Would close')}
    />
  </>
);
