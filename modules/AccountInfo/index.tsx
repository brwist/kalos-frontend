import React from 'react';
import ReactDOM from 'react-dom';
import { AccountInfo } from './main';

ReactDOM.render(
  <AccountInfo userId={100452} withHeader padding={1} />,
  document.getElementById('root'),
);
