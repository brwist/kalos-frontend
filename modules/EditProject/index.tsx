import React from 'react';
import ReactDOM from 'react-dom';
import { EditProject } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import './nothing.less';

const c = new UserClient(ENDPOINT);
c.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <EditProject serviceCallId={86246} loggedUserId={101253} />,
    document.getElementById('root'),
  );
});
