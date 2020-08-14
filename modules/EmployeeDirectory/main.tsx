import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
}

export const EmployeeDirectory: FC<Props> = ({ loggedUserId }) => (
  <PageWrapper userID={loggedUserId}>
    <AdvancedSearch
      title="Employee Directory"
      kinds={['employees']}
      loggedUserId={loggedUserId}
      editableEmployees
      deletableEmployees
      printableEmployees
    />
  </PageWrapper>
);
