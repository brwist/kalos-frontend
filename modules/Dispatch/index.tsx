import React from 'react'
import ReactDOM from 'react-dom'
import { Dispatch } from './main'
import { UserClient } from '@kalos-core/kalos-rpc/User'
import { ENDPOINT } from '../../constants'

const u = new UserClient(ENDPOINT)

u.GetToken('test','test').then(() => {
  ReactDOM.render(
    <Dispatch loggedUserId={213} testUserId={103939} disableSlack={true} withHeader />,
    document.getElementById('root'),
  );
});
