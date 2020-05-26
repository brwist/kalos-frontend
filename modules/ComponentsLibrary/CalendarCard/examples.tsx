import React from 'react';
import { CalendarCard } from './';
import { LoremIpsum } from '../helpers';

export default () => (
  <>
    <CalendarCard
      title="Lorem ipsum"
      statusColor="#FF8888"
      onClick={() => console.log('CLICK')}
    >
      <LoremIpsum />
    </CalendarCard>
    <CalendarCard
      title="Dolor sit"
      statusColor="#88FF88"
      onClick={() => console.log('CLICK')}
    >
      <LoremIpsum />
    </CalendarCard>
  </>
);
