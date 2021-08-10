import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Dashboard userId={103285} withHeader />,
    document.getElementById('root'),
  );
});
