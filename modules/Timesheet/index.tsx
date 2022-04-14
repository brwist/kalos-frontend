import React from 'react';
import ReactDOM from 'react-dom';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { Timesheet } from './main';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Timesheet userId={213} timesheetOwnerId={213} />,
    document.getElementById('root'),
  );
});
