import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
}

export const SearchIndex: FC<Props> = ({ loggedUserId }) => (
  <PageWrapper userID={loggedUserId}>
    <AdvancedSearch
      loggedUserId={loggedUserId}
      title="Search"
      kinds={['serviceCalls', 'customers', 'properties']}
      editableCustomers
      editableProperties
    />
  </PageWrapper>
);
