import React from 'react';
import ReactDOM from 'react-dom';
import { SpiffToolLogs } from './main';

ReactDOM.render(
  <SpiffToolLogs type="Tool" loggedUserId={2512} withHeader />,
  document.getElementById('root'),
);
