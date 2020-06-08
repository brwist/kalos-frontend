import React from 'react';
import { ActivityLogReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <ActivityLogReport
      activityDateStart="2020-01-27"
      activityDateEnd="2020-01-29"
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Deleted</ExampleTitle>
    <ActivityLogReport
      status="Deleted"
      activityDateStart="2020-01-27"
      activityDateEnd="2020-01-29"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
