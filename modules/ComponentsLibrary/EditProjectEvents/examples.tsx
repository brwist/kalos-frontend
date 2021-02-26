import React from 'react';
import { EditProject } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Viewed as employee</ExampleTitle>
    <EditProject serviceCallId={86246} loggedUserId={101253} />
    <ExampleTitle>Viewed as manager</ExampleTitle>
    <EditProject serviceCallId={86246} loggedUserId={336} />
  </>
);
