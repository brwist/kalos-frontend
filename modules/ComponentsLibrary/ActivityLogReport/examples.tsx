import React from 'react';
import { ActivityLog } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <ActivityLog
      activityDateStart="2020-01-27"
      activityDateEnd="2020-01-29"
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Deleted</ExampleTitle>
    <ActivityLog
      status="Deleted"
      activityDateStart="2020-01-27"
      activityDateEnd="2020-01-29"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
