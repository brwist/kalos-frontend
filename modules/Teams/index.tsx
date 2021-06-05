import React from 'react';
import ReactDOM from 'react-dom';
import { TeamsComponent } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <TeamsComponent loggedUserId={101253} />,
    document.getElementById('root'),
  );
});
