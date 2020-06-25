import React from 'react';
import { LodgingByZipCode } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <LodgingByZipCode />
    <ExampleTitle>with onClose</ExampleTitle>
    <LodgingByZipCode onClose={() => console.log('CLOSE')} />
  </>
);
