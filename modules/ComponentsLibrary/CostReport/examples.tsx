import React from 'react';
import { CostReport } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default (Service Call ID: 86246)</ExampleTitle>
    <CostReport loggedUserId={101275} serviceCallId={86246} />
  </>
);
