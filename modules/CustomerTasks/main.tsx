import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
  customerId: number;
}

export const CustomerTasks: FC<Props> = ({ customerId, loggedUserId }) => (
  <PageWrapper userID={loggedUserId}>
    <Tasks
      externalCode="customers"
      externalId={customerId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
