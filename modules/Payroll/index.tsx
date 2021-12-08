import React from 'react';
import ReactDOM from 'react-dom';
import { Payroll } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

// example userID - role
// 102412,213 - Manager
// 101253 - Auditor
// 1550 - Payroll
// 2573 - none

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(<Payroll userID={1550} />, document.getElementById('root'));
});
