import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerDashboard } from './main';

ReactDOM.render(
  <CustomerDashboard
    withHeader
    loggedUserId={101253}
    kinds={['customers', 'properties', 'contracts']}
    title="Search"
    deletableCustomers
    editableCustomers
    deletableProperties
    editableProperties
  />,
  document.getElementById('root'),
);
