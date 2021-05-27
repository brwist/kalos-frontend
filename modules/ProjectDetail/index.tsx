import React from 'react';
import ReactDOM from 'react-dom';
import { ProjectDetail } from './main';

ReactDOM.render(
  <ProjectDetail loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
