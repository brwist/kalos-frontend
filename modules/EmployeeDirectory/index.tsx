import React from 'react';
import ReactDOM from 'react-dom';
import { EmployeeDirectory } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <EmployeeDirectory loggedUserId={213} withHeader />,
    document.getElementById('root'),
  );
});
