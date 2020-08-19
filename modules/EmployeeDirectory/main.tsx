import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export const EmployeeDirectory: FC<Props> = ({ loggedUserId, ...props }) => (
  <PageWrapper {...props} userID={loggedUserId}>
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
