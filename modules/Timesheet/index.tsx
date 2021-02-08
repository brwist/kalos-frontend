import React from 'react';
import ReactDOM from 'react-dom';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { Timesheet } from './main';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Timesheet userId={1550} timesheetOwnerId={103285} />,
    document.getElementById('root'),
  );
});
