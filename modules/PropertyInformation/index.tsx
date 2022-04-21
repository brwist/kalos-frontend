import React from 'react';
import ReactDOM from 'react-dom';
import { PropertyInformation } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <PropertyInformation
      userID={103285}
      propertyId={6552}
      loggedUserId={213}
      withHeader
    />,
    document.getElementById('root'),
  );
});
