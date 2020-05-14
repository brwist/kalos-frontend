import React, { FC, useCallback } from 'react';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import {
  UserType,
  PropertyType,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
} from '../../../helpers';

export interface Props {
  loggedUserId: number;
  customer: UserType;
  onAddServiceCall: (property: PropertyType) => void;
  onCustomerClick: (customer: UserType) => void;
}

export const CustomerItem: FC<Props> = ({
  customer,
  onAddServiceCall,
  onCustomerClick,
}) => {
  const { propertiesList } = customer;
  const handleCustomerClick = useCallback(
    (customer: UserType) => (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      event.preventDefault();
      onCustomerClick(customer);
    },
    [onCustomerClick],
  );
  const handlePropertyClick = useCallback(
    (property: PropertyType) => (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
      event.preventDefault();
      onAddServiceCall(property);
    },
    [onAddServiceCall],
  );
  return (
    <div>
      <InfoTable
        columns={[
          {
            name: (
              <Link onClick={handleCustomerClick(customer)}>
                <strong>{getCustomerNameAndBusinessName(customer)}</strong>
              </Link>
            ),
          },
        ]}
        data={propertiesList.map(property => [
          {
            value: (
              <Link onClick={handlePropertyClick(property)}>
                {getPropertyAddress(property)}
              </Link>
            ),
          },
        ])}
      />
    </div>
  );
};
