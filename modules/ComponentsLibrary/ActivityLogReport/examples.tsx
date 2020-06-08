import React from 'react';
import { ActivityLogReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <ActivityLogReport
      activityDateStart="2020-01-14"
      activityDateEnd="2020-01-18"
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Deleted</ExampleTitle>
    <ActivityLogReport
      status="Deleted"
      activityDateStart="2020-01-14"
      activityDateEnd="2020-01-18"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
