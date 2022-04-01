import React from 'react';
import ReactDOM from 'react-dom';
import { Testing } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient('https://core-dev.kalosflorida.com');

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(<Testing userID={8418} />, document.getElementById('root'));
});
