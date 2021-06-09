import React from 'react';
import ReactDOM from 'react-dom';
import { MacroGanttChart } from './main';
ReactDOM.render(
  <MacroGanttChart
    events={[]}
    loggedUserId={101253}
    startDate={'2020-11-01'}
    endDate={'2021-06-09'}
    withHeader
    macro
  />,
  document.getElementById('root'),
);
