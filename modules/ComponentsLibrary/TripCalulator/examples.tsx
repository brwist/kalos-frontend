import React from 'react';
import { TripCalulator } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <TripCalulator loggedUserId={8418} />
  </>
);
