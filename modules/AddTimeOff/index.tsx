import React from 'react';
import ReactDOM from 'react-dom';
import { AddTimeOff } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <AddTimeOff
      loggedUserId={213}
      onCancel={() => console.log('Cancel')}
      onSaveOrDelete={data => console.log('Save', data)}
    />,
    document.getElementById('root'),
  );
});
