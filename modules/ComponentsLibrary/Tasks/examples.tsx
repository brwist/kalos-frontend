import React from 'react';
import { Tasks } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>customers</ExampleTitle>
    <Tasks externalCode="customers" externalId={2573} loggedUserId={101253} />
    <ExampleTitle>properties</ExampleTitle>
    <Tasks externalCode="properties" externalId={6552} loggedUserId={101253} />
    <ExampleTitle>employee</ExampleTitle>
    <Tasks externalCode="employee" externalId={101253} loggedUserId={101253} />
    <ExampleTitle>with onClose</ExampleTitle>
    <Tasks
      externalCode="customers"
      externalId={2573}
      loggedUserId={101253}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
