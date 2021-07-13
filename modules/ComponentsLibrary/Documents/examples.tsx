import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { Documents } from './';
import { LoremIpsumList } from '../helpers';

export default () => (
  <>
    <Documents
      title="Property Documents"
      userId={2573}
      propertyId={6552}
      addUrl={[
        '/index.cfm?action=admin:properties.docaddS3',
        `user_id=2573`,
        `property_id=6552`,
      ].join('&')}
      withDownloadIcon
    />
    <hr />
    <Documents
      title="Property Documents"
      userId={2573}
      propertyId={6552}
      withDateCreated
      renderEditing={(onClose, onReload, document) => (
        <div style={{ padding: 20 }}>
          <button onClick={onClose}>CLOSE</button>{' '}
          <button onClick={onReload}>RELOAD LISTING</button>
          <hr />
          <pre>
            <strong>Edited Document JSON</strong>
            <br />
            {JSON.stringify(document, null, 4)}
          </pre>
        </div>
      )}
    />
    <hr />
    <Documents
      title="Task Documents"
      taskId={104464}
      renderAdding={onClose => (
        <div style={{ margin: 16 }}>
          <IconButton style={{ float: 'right' }} size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <LoremIpsumList />
        </div>
      )}
    />
  </>
);
