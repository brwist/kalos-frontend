import React from 'react';
import {
  CustomerDetails as CustomerDetailsComponent,
  Props,
} from './components/CustomerDetails';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

export const CustomerDetails = (props: Props & PageWrapperProps) => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <CustomerDetailsComponent {...props} />
  </PageWrapper>
);
