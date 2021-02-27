import React from 'react';
import { EditProjectEvents } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Viewed as employee</ExampleTitle>
    <EditProjectEvents serviceCallId={86246} loggedUserId={101253} />
    <ExampleTitle>Viewed as manager</ExampleTitle>
    <EditProjectEvents serviceCallId={86246} loggedUserId={336} />
  </>
);
