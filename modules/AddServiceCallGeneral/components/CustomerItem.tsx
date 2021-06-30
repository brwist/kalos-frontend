import React, { FC, useCallback } from 'react';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable, Data, Columns } from '../../ComponentsLibrary/InfoTable';
import { UserClientService } from '../../../helpers';
import { getPropertyAddress, Property } from '@kalos-core/kalos-rpc/Property';
import { User } from '@kalos-core/kalos-rpc/User';

export interface Props {
  loggedUserId: number;
  customer: User;
  onAddServiceCall: (property: Property) => void;
  onCustomerClick: (customer: User) => void;
  onAddProperty: (customer: User) => void;
}

export const CustomerItem: FC<Props> = ({
  customer,
  onAddServiceCall,
  onCustomerClick,
  onAddProperty,
}) => {
  const propertiesList = customer.getPropertiesList();
  const handleCustomerClick = useCallback(
    (customer: User) =>
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        onCustomerClick(customer);
      },
    [onCustomerClick],
  );
  const handlePropertyClick = useCallback(
    (property: Property) =>
      (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        onAddServiceCall(property);
      },
    [onAddServiceCall],
  );
  const handleAddProperty = useCallback(
    (customer: User) => () => onAddProperty(customer),
    [onAddProperty],
  );
  const customerNameAndBusinessName =
    UserClientService.getCustomerNameAndBusinessName(customer);
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
