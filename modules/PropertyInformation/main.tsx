import React, { FC } from 'react';
import { CustomerInformation } from '../ComponentsLibrary/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

export const PropertyInformation: FC<Props> = props => (
  <PageWrapper {...props} userID={props.loggedUserId}>
    <CustomerInformation {...props} />
    <PropertyInfo {...props} />
  </PageWrapper>
);
