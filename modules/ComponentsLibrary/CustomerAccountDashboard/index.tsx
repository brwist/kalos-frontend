import React, { FC } from 'react';
import { CustomerInformation } from '../CustomerInformation';
import { AdvancedSearch } from '../AdvancedSearch';
import { ServiceCalls } from '../../PropertyInformation/components/ServiceCalls';

export interface Props {
  loggedUserId: number;
}

export const CustomerAccountDashboard: FC<Props> = ({ loggedUserId }) => {
  return (
    <div>
      <CustomerInformation userID={loggedUserId} viewedAsCustomer />
      <AdvancedSearch
        kinds={['properties']}
        loggedUserId={loggedUserId}
        title="Properties"
        propertyCustomerId={loggedUserId}
        editableProperties
      />
      <ServiceCalls
        userID={loggedUserId}
        loggedUserId={loggedUserId}
        viewedAsCustomer
      />
    </div>
  );
};
