import React from 'react';
import { CostReportCSV } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default (Service Call ID: 86246)</ExampleTitle>
    <CostReportCSV loggedUserId={101275} serviceCallId={86246} />
  </>
);
