import React from 'react';
import { EventsReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>jobStatus with filter and onClose</ExampleTitle>
    <EventsReport
      loggedUserId={101253}
      kind="jobStatus"
      filter={{
        status: 'Completed',
        startDate: '2019-10-01',
        endDate: '2019-10-01',
      }}
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>billingStatus with filter and onClose</ExampleTitle>
    <EventsReport
      loggedUserId={101253}
      kind="paymentStatus"
      filter={{
        status: 'Paid',
        startDate: '2019-10-01',
        endDate: '2019-10-01',
      }}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
