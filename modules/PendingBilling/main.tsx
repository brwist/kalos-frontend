import React, { FC } from 'react';
import { ServiceCallsPending, Props } from './components/ServiceCallsPending';
import { PageWrapper } from '../PageWrapper/main';

export const PendingBilling: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <ServiceCallsPending {...props} />
  </PageWrapper>
);
