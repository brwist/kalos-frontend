import React from 'react';
import { ServiceCallLogs } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <ServiceCallLogs loggedUserId={8418} eventId={98701} />
  </>
);
