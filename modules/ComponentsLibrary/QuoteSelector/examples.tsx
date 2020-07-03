import React from 'react';
import { QuoteSelector } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <QuoteSelector serviceCallId={86246} />
    <ExampleTitle>onAdd</ExampleTitle>
    <QuoteSelector serviceCallId={86246} onAdd={console.log} />
  </>
);
