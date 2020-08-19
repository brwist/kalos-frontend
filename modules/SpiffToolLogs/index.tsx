import React from 'react';
import ReactDOM from 'react-dom';
import { SpiffToolLogs } from './main';

ReactDOM.render(
  <SpiffToolLogs type="Spiff" loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
