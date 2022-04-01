import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ENDPOINT } from '../../constants';
import { TransactionAccountsPayable } from './main';
//id for processor 98217
const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <TransactionAccountsPayable loggedUserId={98217} hasActions />,
    document.getElementById('txn-root'),
  );
});
