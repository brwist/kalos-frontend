import React from 'react';
import ReactDOM from 'react-dom';
import { AccountInfo } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../@kalos-core/kalos-rpc/constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <AccountInfo userId={8418} withHeader />,
    document.getElementById('root'),
  );
});
