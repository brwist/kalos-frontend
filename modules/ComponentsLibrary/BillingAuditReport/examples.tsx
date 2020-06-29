import React from 'react';
import { BillingAuditReport } from './';

export default () => (
  <BillingAuditReport
    month="2020-05-%"
    loggedUserId={101253}
    onClose={() => console.log('CLOSE')}
  />
);
