import React from 'react';
import ReactDOM from 'react-dom';
import { AcceptProposal } from './main';

ReactDOM.render(
  <AcceptProposal
    userID={103285}
    jobNumber={64153}
    propertyID={9437}
    loggedUserId={103285}
    withHeader
  />,
  document.getElementById('root'),
);
