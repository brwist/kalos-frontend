import React, { FC, useCallback } from 'react';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
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
  onAddProperty: (customer: UserType) => void;
}

export const CustomerItem: FC<Props> = ({
  customer,
  onAddServiceCall,
  onCustomerClick,
  onAddProperty,
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
  const handleAddProperty = useCallback(
    (customer: UserType) => () => onAddProperty(customer),
    [onAddProperty],
  );
  const customerNameAndBusinessName = getCustomerNameAndBusinessName(customer);
  console.log({ customerNameAndBusinessName });
  const columns: Columns = [
    {
      name: (
        <Link onClick={handleCustomerClick(customer)}>
          <big>
            <strong>{customerNameAndBusinessName}</strong>
            {customerNameAndBusinessName === '' && <i>no name</i>}
          </big>
        </Link>
      ),
      actions: [
        {
          label: 'Add Property',
          size: 'xsmall',
          variant: 'text',
          compact: true,
          onClick: handleAddProperty(customer),
        },
      ],
    },
  ];
  const data: Data = propertiesList.map(property => [
    {
      value: (
        <Link onClick={handlePropertyClick(property)}>
          {getPropertyAddress(property)}
        </Link>
      ),
    },
  ]) as Data;
  return (
    <div>
      <InfoTable columns={columns} data={data} />
    </div>
  );
};
