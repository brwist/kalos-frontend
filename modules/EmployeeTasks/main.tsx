import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
  employeeId: number;
}

export const EmployeeTasks: FC<Props> = ({
  employeeId,
  loggedUserId,
  ...props
}) => (
  <PageWrapper {...props} userID={loggedUserId}>
    <Tasks
      externalCode="employee"
      externalId={employeeId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
