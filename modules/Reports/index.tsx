import React from 'react';
import ReactDOM from 'react-dom';
import { Reports } from './main';

ReactDOM.render(
  <Reports loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
