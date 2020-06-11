import React from 'react';
import { ServiceCallMetrics } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <ServiceCallMetrics
      week="2020-06-07"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
