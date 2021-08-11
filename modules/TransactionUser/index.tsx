import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Transaction from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    // 8418 is also valid
    <Transaction userID={100153} withHeader />,
    document.getElementById('txn-root'),
  );
});
