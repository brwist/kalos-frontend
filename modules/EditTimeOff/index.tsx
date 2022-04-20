import React from 'react';
import ReactDOM from 'react-dom';
import { EditTimeOff } from './main';
import { UserClient } from '../../@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';

const u = new UserClient(ENDPOINT);

u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <EditTimeOff
      loggedUserId={8418}
      userId={8418}
      requestOffId={2072}
      onCancel={() => console.log('Cancel')}
      onSaveOrDelete={data => console.log('Delete', data)}
      onAdminSubmit={data => console.log('Admin Submit', data)}
    />,
    document.getElementById('root'),
  );
});
