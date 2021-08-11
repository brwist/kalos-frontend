import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <Transaction userID={8418} withHeader />,
    document.getElementById('txn-root'),
  );
});
