import React from 'react';
import ReactDOM from 'react-dom';
import Timesheet from './main';

ReactDOM.render(
  <Timesheet userId={3} timesheetOwnerId={8418} withHeader />,
  document.getElementById('root'),
);
