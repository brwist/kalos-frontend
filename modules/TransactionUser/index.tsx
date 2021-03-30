import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';

ReactDOM.render(
  <Transaction userID={336} withHeader />,
  document.getElementById('txn-root'),
);
