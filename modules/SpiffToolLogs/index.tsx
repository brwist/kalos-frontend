import React from 'react';
import ReactDOM from 'react-dom';
import { SpiffToolLogs } from './main';

ReactDOM.render(
  <SpiffToolLogs type="Spiff" loggedUserId={66} withHeader />,
  document.getElementById('root'),
);
