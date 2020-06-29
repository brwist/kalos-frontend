import React from 'react';
import { BillingAuditReport } from './';

export default () => (
  <BillingAuditReport month="2020-05-%" onClose={() => console.log('CLOSE')} />
);
