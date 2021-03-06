import React from 'react';
import { EmailInvoice } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <EmailInvoice
      loggedUserId={8418}
      propertyId={4404}
      invoiceId={585}
      recipientEmail="justin.farrell@kalosflorida.com"
    />
    <ExampleTitle>Named Download</ExampleTitle>
    <EmailInvoice
      loggedUserId={8418}
      propertyId={4404}
      invoiceId={585}
      recipientEmail="justin.farrell@kalosflorida.com"
      downloadName="files_can_be_named"
    />
  </>
);
