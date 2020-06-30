import React from 'react';
import { DeletedServiceCallsReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <DeletedServiceCallsReport
      loggedUserId={101253}
      dateStart="2018-05-25"
      dateEnd="2018-05-25"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
