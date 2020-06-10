import React from 'react';
import { PerformanceMetrics } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <PerformanceMetrics
      dateStart="2020-01-14"
      dateEnd="2020-01-20"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
