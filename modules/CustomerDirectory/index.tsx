import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerDirectory } from './main';

ReactDOM.render(
  <CustomerDirectory loggedUserId={2573} withHeader />,
  document.getElementById('root'),
);
