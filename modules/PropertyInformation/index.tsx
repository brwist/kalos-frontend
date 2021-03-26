import React from 'react';
import ReactDOM from 'react-dom';
import { PropertyInformation } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <PropertyInformation
      userID={1286}
      propertyId={28953}
      loggedUserId={8418}
      withHeader
    />,
    document.getElementById('root'),
  );
});
