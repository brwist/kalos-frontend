import React from 'react';
import ReactDOM from 'react-dom';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { Timesheet } from './main';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Timesheet userId={100201} timesheetOwnerId={100201} />,
    document.getElementById('root'),
  );
});
