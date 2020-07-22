import React from 'react';
import { GanttChart, CalendarEvent } from './';
import { ExampleTitle } from '../helpers';

const EVENTS: CalendarEvent[] = [
  {
    id: 1,
    startDate: '2019-12-30',
    endDate: '2020-01-10',
    startHour: '14:15:00',
    endHour: '19:00:00',
    notes: 'Task 1',
    statusColor: '#F88',
  },
  {
    id: 2,
    startDate: '2020-01-13',
    endDate: '2020-01-15',
    startHour: '04:00:00',
    endHour: '09:00:00',
    notes: 'Task 2',
    statusColor: '#8F8',
  },
  {
    id: 3,
    startDate: '2020-01-08',
    endDate: '2020-01-09',
    startHour: '08:00:00',
    endHour: '21:00:00',
    notes: 'Task 3',
    statusColor: '#88F',
  },
  {
    id: 4,
    startDate: '2020-01-24',
    endDate: '2020-01-24',
    startHour: '08:00:00',
    endHour: '21:00:00',
    notes: 'Task 4',
    statusColor: '#F8F',
  },
];

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <GanttChart
      events={EVENTS}
      startDate="2019-12-30"
      endDate="2020-02-02"
      onAdd={() => console.log('ADD')}
    />
    <ExampleTitle>loading</ExampleTitle>
    <GanttChart
      events={EVENTS}
      startDate="2019-12-30"
      endDate="2020-02-02"
      loading
    />
  </>
);
