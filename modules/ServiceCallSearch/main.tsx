import React, { FC } from 'react';
import { AdvancedSearch } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  loggedUserId: number;
}

export const ServiceCallSearch: FC<Props> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
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
