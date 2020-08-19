import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerDetails } from './main';

ReactDOM.render(
  <CustomerDetails userID={2573} loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
