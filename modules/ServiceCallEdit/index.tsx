import React from 'react';
import ReactDOM from 'react-dom';
import { ServiceCallEdit } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <ServiceCallEdit
      serviceCallId={99775}
      userID={103285}
      propertyId={6552}
      loggedUserId={1550}
      withHeader
    />,
    document.getElementById('root'),
  );
});
