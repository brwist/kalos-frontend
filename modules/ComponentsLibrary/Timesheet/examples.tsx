import React from 'react';
import { ExampleTitle } from '../helpers';
import { Timesheet } from './';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <Timesheet userId={102412} timesheetOwnerId={103285} />
    <ExampleTitle>DEBUG</ExampleTitle>
    <Timesheet userId={103233} timesheetOwnerId={8418} />
  </>
);
