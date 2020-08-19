import React from 'react';
import ReactDOM from 'react-dom';
import { PendingBilling } from './main';

ReactDOM.render(
  <PendingBilling loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
