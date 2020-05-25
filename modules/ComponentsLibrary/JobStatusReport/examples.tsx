import React from 'react';
import { JobStatusReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <JobStatusReport loggedUserId={101253} />
    <ExampleTitle>With filter and onClose</ExampleTitle>
    <JobStatusReport
      loggedUserId={101253}
      filter={{
        status: 'Completed',
        startDate: '2019-10-01',
        endDate: '2019-10-01',
      }}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
