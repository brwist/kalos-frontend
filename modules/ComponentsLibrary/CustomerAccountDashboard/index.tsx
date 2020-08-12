import React, { FC } from 'react';
import { CustomerInformation } from '../CustomerInformation';
import { AdvancedSearch } from '../AdvancedSearch';

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
    </div>
  );
};
