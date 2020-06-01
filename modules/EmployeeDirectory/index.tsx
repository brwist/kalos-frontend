import React from 'react';
import ReactDOM from 'react-dom';
import { EmployeeDirectory } from './main';

ReactDOM.render(
  <EmployeeDirectory loggedUserId={101253} />,
  document.getElementById('root'),
);
