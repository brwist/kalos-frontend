import React from 'react';
import ReactDOM from 'react-dom';
import { ServiceCallTable } from './ServiceCall';

ReactDOM.render(
  <ServiceCallTable loggedUserId={101253} withPageHeader />,
  document.getElementById('root')
);
