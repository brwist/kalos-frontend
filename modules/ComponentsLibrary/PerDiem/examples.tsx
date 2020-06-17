import React from 'react';
import { PerDiemComponent } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Viewed as Technician</ExampleTitle>
    <PerDiemComponent loggedUserId={101253} />
    <ExampleTitle>Viewed as Sam</ExampleTitle>
    <PerDiemComponent loggedUserId={2573} />
    <ExampleTitle>Viewed as Manager</ExampleTitle>
    <PerDiemComponent loggedUserId={336} />
  </>
);
