import React, { FC } from 'react';
import { Tasks } from '../ComponentsLibrary/Tasks';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
  employeeId: number;
}

export const EmployeeTasks: FC<Props> = ({ employeeId, loggedUserId }) => (
  <PageWrapper userID={loggedUserId}>
    <Tasks
      externalCode="employee"
      externalId={employeeId}
      loggedUserId={loggedUserId}
    />
  </PageWrapper>
);
