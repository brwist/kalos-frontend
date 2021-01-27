import React from 'react';
import ReactDOM from 'react-dom';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { TimesheetProxy } from './proxy';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <TimesheetProxy userId={103285} loggedUserId={102412} />,
    document.getElementById('root'),
  );
});
