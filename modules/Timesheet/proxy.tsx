import React, { FC } from 'react';
import { Timesheet } from './main';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
  userId: number;
}

export const TimesheetProxy: FC<Props> = ({ loggedUserId, userId }) => (
  <PageWrapper userID={loggedUserId} withHeader>
    <Timesheet userId={loggedUserId} timesheetOwnerId={userId} />
  </PageWrapper>
);
