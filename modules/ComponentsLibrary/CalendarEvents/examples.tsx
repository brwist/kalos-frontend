import React from 'react';
import { CalendarEvents, CalendarEvent } from './';

const EVENTS: CalendarEvent[] = [
  {
    startDate: '2020-01-05',
    endDate: '2020-01-10',
    startHour: '14:15:00',
    endHour: '19:00:00',
    notes: 'Task 1',
  },
  {
    startDate: '2020-01-13',
    endDate: '2020-01-15',
    startHour: '04:00:00',
    endHour: '09:00:00',
    notes: 'Task 2',
  },
  {
    startDate: '2020-01-08',
    endDate: '2020-01-09',
    startHour: '08:00:00',
    endHour: '21:00:00',
    notes: 'Task 3',
  },
  {
    startDate: '2020-01-24',
    endDate: '2020-01-24',
    startHour: '08:00:00',
    endHour: '21:00:00',
    notes: 'Task 4',
  },
];

export default () => (
  <>
    <CalendarEvents events={EVENTS} />
  </>
);
