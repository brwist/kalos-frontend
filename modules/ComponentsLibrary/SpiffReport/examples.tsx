import React from 'react';
import { SpiffReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Monthly</ExampleTitle>
    <SpiffReport
      date="2019-07-%"
      type="Monthly"
      users={[1, 2, 3]}
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Weekly</ExampleTitle>
    <SpiffReport
      date="2019-08-18"
      type="Weekly"
      users={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
