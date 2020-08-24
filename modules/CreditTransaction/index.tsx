import React from 'react';
import ReactDOM from 'react-dom';
import { CreditTransaction } from './main';
import { PageWrapper } from '../PageWrapper/main';

ReactDOM.render(
  <PageWrapper userID={101253} withHeader>
    <CreditTransaction />
  </PageWrapper>,
  document.getElementById('root'),
);
