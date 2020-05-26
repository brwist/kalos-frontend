import React from 'react';
import { Calendar } from './';
import { CalendarColumnsExample } from '../CalendarColumn/examples';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <Calendar>
      <CalendarColumnsExample />
    </Calendar>
    <ExampleTitle>with error</ExampleTitle>
    <Calendar error="You don't have permission to view this calendar">
      <CalendarColumnsExample />
    </Calendar>
  </>
);
