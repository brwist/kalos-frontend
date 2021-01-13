import React from 'react';
import ReactDOM from 'react-dom';
import { Timesheet } from './main';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

const userId = 10240; //8418

const u = new UserClient(ENDPOINT);
u.GetToken('test', 'test').then(() => {
  ReactDOM.render(
    <PageWrapper userID={userId} withHeader>
      <Timesheet userId={userId} timesheetOwnerId={10240} />
    </PageWrapper>,
    document.getElementById('root'),
  );
});
