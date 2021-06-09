import React from 'react';
import { CostReportForEmployee } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <CostReportForEmployee
      userId={101275}
      loggedUserId={101275}
      notReady={true}
      onClose={() => alert('Closed')}
      username="TestName"
    />

    <ExampleTitle>Not Ready</ExampleTitle>
    <CostReportForEmployee
      userId={101275}
      loggedUserId={101275}
      notReady={false}
      onClose={() => alert('Closed')}
      username="TestName"
    />
  </>
);
