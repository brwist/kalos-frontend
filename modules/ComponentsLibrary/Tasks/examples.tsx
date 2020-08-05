import React from 'react';
import { Tasks } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>customers</ExampleTitle>
    <Tasks externalCode="customers" externalId={2573} />
    <ExampleTitle>properties</ExampleTitle>
    <Tasks externalCode="properties" externalId={6552} />
    <ExampleTitle>employee</ExampleTitle>
    <Tasks externalCode="employee" externalId={101253} />
    <ExampleTitle>with onClose</ExampleTitle>
    <Tasks
      externalCode="customers"
      externalId={2573}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
