import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerTasks } from './main';

ReactDOM.render(
  <CustomerTasks customerId={2573} loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
