import React from 'react';
import ReactDOM from 'react-dom';
import { ServiceCalendar } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { endOfDay } from 'date-fns';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <ServiceCalendar userId={8418} withHeader />,
    document.getElementById('root'),
  );
});
