import React from 'react';
import ReactDOM from 'react-dom';
import { Timesheet } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Timesheet userId={3} timesheetOwnerId={8418} withHeader />,
    document.getElementById('root'),
  );
});
