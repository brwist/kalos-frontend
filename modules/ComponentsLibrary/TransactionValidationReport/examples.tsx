import React from 'react';
import { TransactionValidationReport } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <TransactionValidationReport
      loggedUserId={101253}
      year={'2021'}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
