import React from 'react';
import { CostReportForEmployee } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <CostReportForEmployee userId={101275} week="2021-06-27" />

    <ExampleTitle>Not Ready</ExampleTitle>
    <CostReportForEmployee userId={101275} week="2021-06-27" />
  </>
);
