import React, { FC } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import { Documents } from '../../ComponentsLibrary/Documents';
import { loadUsersByIds } from '../../../helpers';

interface Props {
  className?: string;
  userID: number;
  propertyId: number;
  viewedAsCustomer?: boolean;
}

export const PropertyDocuments: FC<Props> = ({
  className,
  userID,
  propertyId,
  viewedAsCustomer = false,
}) => (
  <Documents
    className={className}
    title="Property Documents"
    propertyId={propertyId}
    deletable={true}
    userId={userID}
    ignoreUserId
    addUrl={
      viewedAsCustomer
        ? undefined
        : [
            '/index.cfm?action=admin:properties.docaddS3',
            `user_id=${userID}`,
            `property_id=${propertyId}`,
          ].join('&')
    }
  />
);
