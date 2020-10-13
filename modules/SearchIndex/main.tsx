import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export const SearchIndex: FC<Props> = ({ loggedUserId, ...props }) => (
  <PageWrapper {...props} userID={loggedUserId}>
    <AdvancedSearch
      loggedUserId={loggedUserId}
      title="Search"
      kinds={['customers', 'properties', 'serviceCalls']}
      editableCustomers
      editableProperties
    />
  </PageWrapper>
);
