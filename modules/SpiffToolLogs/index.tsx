import React from 'react';
import ReactDOM from 'react-dom';
import { SpiffToolLogs } from './main';

ReactDOM.render(
  <SpiffToolLogs type="Spiff" loggedUserId={1550} withHeader />,
  document.getElementById('root'),
);
