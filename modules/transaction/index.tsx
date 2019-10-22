import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';

ReactDOM.render(
  <Transaction userID={8418} />,
  document.getElementById('txn-root'),
);
