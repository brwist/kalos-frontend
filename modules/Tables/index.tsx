import React from 'react';
import ReactDOM from 'react-dom';
import { ServiceCallTable } from './ServiceCall';

ReactDOM.render(
  <ServiceCallTable loggedUserId={101253} withHeader padding={1} />,
  document.getElementById('root'),
);
