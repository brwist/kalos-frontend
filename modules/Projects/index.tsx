import React from 'react';
import ReactDOM from 'react-dom';
import { Projects } from './main';

ReactDOM.render(
  <Projects loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
