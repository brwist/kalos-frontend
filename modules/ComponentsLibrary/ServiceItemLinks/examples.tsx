import React from 'react';
import { ServiceItemLinks } from './';

export default () => (
  <ServiceItemLinks
    kind="Link"
    title="Service ID: 3869"
    serviceItemId={3869}
    onClose={() => console.log('CLOSE')}
  />
);
