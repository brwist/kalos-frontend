import { UserClient } from '@kalos-core/kalos-rpc/User';
import React from 'react';
import ReactDOM from 'react-dom';
import { ENDPOINT } from '../../constants';
import { ProjectDetail } from './main';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <ProjectDetail
      userID={2573}
      loggedUserId={101253}
      propertyId={9437}
      serviceCallId={86246}
      withHeader
    />,
    document.getElementById('root'),
  );
});
