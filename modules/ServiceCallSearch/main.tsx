import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  loggedUserId: number;
}

export const ServiceCallSearch: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <AdvancedSearch
      {...props}
      title="Service Calls"
      kinds={['serviceCalls']}
      deletableEvents
      eventsWithAccounting
      eventsWithAdd
    />
  </PageWrapper>
);
