import React, { FC } from 'react';
import { AdvancedSearch, Props } from '../ComponentsLibrary/AdvancedSearch';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const CustomerDashboard: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <AdvancedSearch {...props} />
  </PageWrapper>
);
