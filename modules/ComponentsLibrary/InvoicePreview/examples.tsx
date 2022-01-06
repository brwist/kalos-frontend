import React from 'react';
import { InvoicePreview } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <InvoicePreview loggedUserId={8418} propertyId={4404} invoiceId={585} />
    <ExampleTitle>Error</ExampleTitle>
    {/* @ts-expect-error */}
    <InvoicePreview loggedUserId={8418} />
  </>
);
