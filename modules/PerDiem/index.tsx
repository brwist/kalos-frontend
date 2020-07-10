import React from 'react';
import ReactDOM from 'react-dom';
import { PerDiem } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const c = new UserClient(ENDPOINT);
c.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <PerDiem loggedUserId={7051} />,
    document.getElementById('root'),
  );
});
