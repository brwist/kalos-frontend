import React from 'react';
import ReactDOM from 'react-dom';
import { PendingInvoiceTransactionComponent } from './main';
import { PageWrapper } from '../PageWrapper/main';

ReactDOM.render(
  <PageWrapper userID={101253} withHeader>
    <PendingInvoiceTransactionComponent />
  </PageWrapper>,
  document.getElementById('root'),
);
