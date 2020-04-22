import React from 'react';
import ReactDOM from 'react-dom';
import { Metrics } from './main';
import { CHART_COLORS } from '../../constants';

const { blue, red, orange } = CHART_COLORS;

ReactDOM.render(
  <Metrics
    title="Metrics"
    metrics={[
      {
        dataKey: 'Billable',
        name: 'Billable',
        fill: blue,
      },
      {
        dataKey: 'Callbacks',
        name: 'Callbacks',
        fill: red,
      },
      {
        dataKey: 'Revenue',
        name: 'Revenue',
        fill: orange,
      },
    ]}
    loggedUserId={101253}
  />,
  document.getElementById('root'),
);
