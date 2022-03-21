import React from 'react';
import ReactDOM from 'react-dom';
import { PendingInvoiceTransaction } from './main';
import { PageWrapper } from '../PageWrapper/main';

ReactDOM.render(
  <PageWrapper userID={101253} withHeader>
    <PendingInvoiceTransaction />
  </PageWrapper>,
  document.getElementById('root'),
);
