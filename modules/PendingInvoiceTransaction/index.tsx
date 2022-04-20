import React from 'react';
import ReactDOM from 'react-dom';
import { PendingInvoiceTransaction } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <PendingInvoiceTransaction userID={1550} />,
    document.getElementById('root'),
  );
});
