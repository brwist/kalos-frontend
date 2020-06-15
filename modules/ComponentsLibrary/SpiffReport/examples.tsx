import React from 'react';
import { SpiffReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Monthly</ExampleTitle>
    <SpiffReport
      date="2020-05-%"
      type="Monthly"
      users={[1, 2, 3]}
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Weekly</ExampleTitle>
    <SpiffReport
      date="2020-06-14"
      type="Weekly"
      users={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
