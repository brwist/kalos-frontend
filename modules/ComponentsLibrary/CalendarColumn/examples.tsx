import React from 'react';
import { CalendarColumn } from './';
import CalendarCardExample from '../CalendarCard/examples';
import { LoremIpsum, ExampleTitle } from '../helpers';

export const CalendarColumnsExample = () => (
  <>
    {[...Array(7)].map((_, idx) => (
      <CalendarColumn key={idx} date={`2020-03-1${idx}`}>
        <CalendarCardExample />
      </CalendarColumn>
    ))}
  </>
);

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <CalendarColumn date="2020-03-19">
      <CalendarCardExample />
    </CalendarColumn>
    <ExampleTitle>with header</ExampleTitle>
    <CalendarColumn date="2020-03-19" header={<LoremIpsum />}>
      <CalendarCardExample />
    </CalendarColumn>
    <ExampleTitle>loading</ExampleTitle>
    <CalendarColumn date="2020-03-19" loading>
      <CalendarCardExample />
    </CalendarColumn>
  </>
);
