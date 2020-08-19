import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
  customerId: number;
}

export const CustomerTasks: FC<Props> = ({
  customerId,
  loggedUserId,
  ...props
}) => (
  <PageWrapper {...props} userID={loggedUserId}>
    <Tasks
      externalCode="customers"
      externalId={customerId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
