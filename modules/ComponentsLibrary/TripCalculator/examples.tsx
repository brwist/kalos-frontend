import React from 'react';
import { TripCalculator } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <TripCalculator loggedUserId={8418} />
  </>
);
