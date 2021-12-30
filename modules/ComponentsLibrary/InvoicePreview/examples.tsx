import React from 'react';
import { InvoicePreview } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <InvoicePreview loggedUserId={8418} />
  </>
);
