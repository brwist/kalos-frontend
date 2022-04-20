import React from 'react';
import ReactDOM from 'react-dom';
import { MyTestComponent } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

ReactDOM.render(
  <MyTestComponent userID={8418} />,
  document.getElementById('root'),
);
