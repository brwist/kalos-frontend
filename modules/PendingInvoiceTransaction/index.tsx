import React from 'react';
import ReactDOM from 'react-dom';
import { PendingInvoiceTransactionComponent } from './main';
import { PageWrapper } from '../PageWrapper/main';

ReactDOM.render(
  <PageWrapper userID={103285} withHeader>
    <PendingInvoiceTransactionComponent loggedUserId={103285} />
  </PageWrapper>,
  document.getElementById('root'),
);
