import React, { FC } from 'react';
import {
  CustomerAccountDashboard,
  Props,
} from '../ComponentsLibrary/CustomerAccountDashboard';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const CustomerDirectory: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <CustomerAccountDashboard {...props} />
  </PageWrapper>
);
