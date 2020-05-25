import React from 'react';
import { JobStatusReport } from './';

export default () => (
  <JobStatusReport
    filter={{
      startDate: '2019-10-01',
      endDate: '2019-10-01',
    }}
    onClose={() => console.log('CLOSE')}
  />
);
