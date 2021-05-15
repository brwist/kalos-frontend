import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TransactionAccountsPayable from './main';

ReactDOM.render(
  <TransactionAccountsPayable loggedUserId={98217} hasActions />,
  document.getElementById('txn-root'),
);
