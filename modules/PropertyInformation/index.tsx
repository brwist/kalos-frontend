import React from 'react';
import ReactDOM from 'react-dom';
import { PropertyInformation } from './main';

ReactDOM.render(
  <PropertyInformation
    userID={2573}
    propertyId={6552}
    loggedUserId={101253}
    withHeader
  />,
  document.getElementById('root'),
);
