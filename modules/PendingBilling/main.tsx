import React, { FC } from 'react';
import { ServiceCallsPending, Props } from './components/ServiceCallsPending';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const PendingBilling: FC<Props & PageWrapperProps> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <ServiceCallsPending {...props} />
  </PageWrapper>
);
