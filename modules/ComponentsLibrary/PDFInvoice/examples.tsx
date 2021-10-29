import React from 'react';
import { ExampleTitle } from '../helpers';
import { PDFInvoice } from './';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <PDFInvoice serviceCallId={1051} contractId={1051} userId={8428} />
    <ExampleTitle>OnFileCreated provided in props</ExampleTitle>
    <PDFInvoice
      serviceCallId={1051}
      contractId={1051}
      userId={8428}
      onFileCreated={created => console.log('file made: ', created)}
    />
    <ExampleTitle>OnFileCreated provided in props and invisible</ExampleTitle>
    <PDFInvoice
      serviceCallId={1051}
      contractId={1051}
      userId={8428}
      onFileCreated={created => console.log('file made: ', created)}
      invisible
    />
  </>
);
