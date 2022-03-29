import React from 'react';
import { TimesheetValidationReport } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <TimesheetValidationReport
      loggedUserId={101253}
      dateStarted="2018-05-25"
      dateEnded="2018-05-25"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
