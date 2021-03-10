import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';

ReactDOM.render(
  <Transaction userID={8414} withHeader />,
  document.getElementById('txn-root'),
);
