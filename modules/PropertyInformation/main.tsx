import React, { FC } from 'react';
import { CustomerInformation } from '../ComponentsLibrary/CustomerInformation';
import { PropertyInfo } from './components/PropertyInfo';
import { PageWrapper } from '../PageWrapper/main';

interface Props {
  userID: number;
  propertyId: number;
  loggedUserId: number;
}

export const PropertyInformation: FC<Props> = (props) => (
  <PageWrapper userID={props.loggedUserId}>
    <CustomerInformation {...props} />
    <PropertyInfo {...props} />
  </PageWrapper>
);
