import React from 'react';
import { Actions, ActionsProps } from './';
import { ExampleTitle } from '../helpers';

const ACTIONS: ActionsProps = [
  { label: 'Lorem', variant: 'outlined' },
  { label: 'Ipsum' },
];

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <Actions actions={ACTIONS} />
    <ExampleTitle>Fixed</ExampleTitle>
    <Actions actions={ACTIONS} fixed />
    <ExampleTitle>Responsive Column</ExampleTitle>
    <Actions actions={ACTIONS} fixed responsiveColumn />
  </>
);
