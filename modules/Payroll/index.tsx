import React from 'react';
import ReactDOM from 'react-dom';
import { Payroll } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Payroll
      userID={101253}
      loggedUserId={8418} // 4558
    />,
    document.getElementById('root'),
  );
});
