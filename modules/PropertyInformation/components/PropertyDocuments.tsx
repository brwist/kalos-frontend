import React, { FC } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import { Documents } from '../../ComponentsLibrary/Documents';

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
    userId={userID}
    propertyId={propertyId}
    deletable={false}
    addUrl={
      viewedAsCustomer
        ? undefined
        : [
            '/index.cfm?action=admin:properties.docaddS3',
            `user_id=${userID}`,
            `property_id=${propertyId}`,
          ].join('&')
    }
    actions={
      viewedAsCustomer
        ? undefined
        : ({ id }) => [
            <IconButton
              key={0}
              style={{ marginLeft: 4 }}
              size="small"
              onClick={() => {
                window.open(
                  [
                    '/index.cfm?action=admin:properties.docemail',
                    `user_id=${userID}`,
                    `document_id=${id}`,
                    `property_id=${propertyId}`,
                    `p=2`,
                  ].join('&'),
                );
              }}
            >
              <MailIcon />
            </IconButton>,
          ]
    }
  />
);
