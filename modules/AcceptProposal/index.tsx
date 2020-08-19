import React from 'react';
import ReactDOM from 'react-dom';
import { AcceptProposal } from './main';

ReactDOM.render(
  <AcceptProposal
    userID={3737}
    jobNumber={64153}
    propertyID={9437}
    loggedUserId={101253}
    withHeader
    padding={1}
  />,
  document.getElementById('root'),
);
