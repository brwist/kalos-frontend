import React from 'react';
import ReactDOM from 'react-dom';
import { PerDiem } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const c = new UserClient(ENDPOINT);
c.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    // can also be 7051
    // 101275 is Pavel Chernov
    <PerDiem loggedUserId={213} ownerId={7051} withHeader />,
    document.getElementById('root'),
  );
});
