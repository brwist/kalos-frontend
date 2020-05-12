import React, { FC } from 'react';
import { Link } from '../../ComponentsLibrary/Link';
import { InfoTable } from '../../ComponentsLibrary/InfoTable';
import {
  getCFAppUrl,
  UserType,
  getCustomerNameAndBusinessName,
  getPropertyAddress,
} from '../../../helpers';

export const CustomerItem: FC<UserType> = props => {
  const { id, propertiesList } = props;
  return (
    <div>
      <InfoTable
        columns={[
          {
            name: (
              <Link
                href={[getCFAppUrl('admin:customers.details'), `id=${id}`].join(
                  '&',
                )}
              >
                <strong>{getCustomerNameAndBusinessName(props)}</strong>
              </Link>
            ),
          },
        ]}
        data={propertiesList.map(property => [
          {
            value: (
              <Link
                href={[
                  getCFAppUrl('admin:service.addserviceCall'),
                  `user_id=${id}`,
                  `property_id=${property.id}`,
                ].join('&')}
              >
                {getPropertyAddress(property)}
              </Link>
            ),
          },
        ])}
      />
    </div>
  );
};
