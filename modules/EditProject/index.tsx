import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import React from 'react';
import ReactDOM from 'react-dom';
import { ENDPOINT } from '../../constants';
import { EditProject } from './main';
ReactDOM.render(
  <EditProject serviceCallId={86246} loggedUserId={101253} withHeader />,
  document.getElementById('root'),
);
