import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';

ReactDOM.render(
  <Transaction userID={1734} isAdmin withHeader />,
  document.getElementById('txn-root'),
);
