import React from 'react';
import ReactDOM from 'react-dom';
import { ServiceCallSearch } from './main';

ReactDOM.render(
  <ServiceCallSearch loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
