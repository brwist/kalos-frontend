import React from 'react';
import { startOfWeek } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { CalendarHeader } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <CalendarHeader
      selectedDate={startOfWeek(new Date())}
      title="John Smith"
      onDateChange={console.log}
      onSubmit={() => console.log('SUBMIT')}
    />
    <ExampleTitle>with submitLabel children</ExampleTitle>
    <CalendarHeader
      selectedDate={startOfWeek(new Date())}
      title="John Smith"
      onDateChange={console.log}
      onSubmit={() => console.log('SUBMIT')}
      submitLabel="Approve Entries"
    >
      <Typography variant="subtitle2">
        Total: <strong>135</strong>
      </Typography>
      <Typography variant="subtitle2">
        Subtotal: <strong>82</strong>
      </Typography>
    </CalendarHeader>
    <ExampleTitle>with submitDisabled</ExampleTitle>
    <CalendarHeader
      selectedDate={startOfWeek(new Date())}
      title="John Smith"
      onDateChange={console.log}
      onSubmit={() => console.log('SUBMIT')}
      submitDisabled
    />
  </>
);
