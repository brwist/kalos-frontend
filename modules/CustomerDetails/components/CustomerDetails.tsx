import React from 'react';
import { CustomerInformation } from '../../ComponentsLibrary/CustomerInformation';
import { Properties } from './Properties';
import { ContractInfo } from './ContractInfo';

export interface Props {
  userID: number;
  loggedUserId: number;
}

export const CustomerDetails = (props: Props) => (
  <CustomerInformation
    {...props}
    renderChildren={customer => (
      <ContractInfo customer={customer} {...props}>
        <Properties {...props} />
      </ContractInfo>
    )}
  />
);
