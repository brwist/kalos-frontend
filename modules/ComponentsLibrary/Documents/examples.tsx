import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import { Documents } from './';

export default () => (
  <>
    <Documents
      title="Property Documents"
      userId={2573}
      propertyId={6552}
      actions={({ id }) => [
        <IconButton
          key={0}
          style={{ marginLeft: 4 }}
          size="small"
          onClick={() => {
            document.location.href = [
              '/index.cfm?action=admin:properties.docemail',
              `user_id=2573`,
              `document_id=${id}`,
              `property_id=6552`,
              `p=2`,
            ].join('&');
          }}
        >
          <MailIcon />
        </IconButton>,
      ]}
      addUrl={[
        '/index.cfm?action=admin:properties.docaddS3',
        `user_id=2573`,
        `property_id=6552`,
      ].join('&')}
    />
    <hr />
    <Documents title="Task Documents" taskId={104464} />
  </>
);
