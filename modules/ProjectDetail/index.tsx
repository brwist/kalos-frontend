import React from 'react';
import ReactDOM from 'react-dom';
import { ProjectDetail } from './main';

ReactDOM.render(
  <ProjectDetail userID={0} loggedUserId={101253} propertyId={0} withHeader />,
  document.getElementById('root'),
);
