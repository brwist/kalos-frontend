import React from 'react';
import {
  CustomerDetails as CustomerDetailsComponent,
  Props,
} from './components/CustomerDetails';
import { PageWrapper } from '../PageWrapper/main';

export const CustomerDetails = (props: Props) => (
  <PageWrapper userID={props.loggedUserId}>
    <CustomerDetailsComponent {...props} />
  </PageWrapper>
);
