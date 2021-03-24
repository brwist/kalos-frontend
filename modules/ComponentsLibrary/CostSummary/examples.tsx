import React from 'react';
import { CostSummary } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <CostSummary
      userId={101275}
      loggedUserId={101275}
      notReady={true}
      onClose={() => alert('Closed')}
      username="TestName"
    />

<ExampleTitle>Not Ready</ExampleTitle>
    <CostSummary
      userId={101275}
      loggedUserId={101275}
      notReady={false}
      onClose={() => alert('Closed')}
      username="TestName"
    />
  </>
);
