import React from 'react';
import ReactDOM from 'react-dom';
import { EmployeeTasks } from './main';

ReactDOM.render(
  <EmployeeTasks employeeId={101253} loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
