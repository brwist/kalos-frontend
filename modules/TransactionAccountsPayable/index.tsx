import { UserClient } from '@kalos-core/kalos-rpc/User';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ENDPOINT } from '../../constants';
import { TransactionAccountsPayable } from './main';

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <TransactionAccountsPayable loggedUserId={1550} hasActions />,
    document.getElementById('txn-root'),
  );
});
