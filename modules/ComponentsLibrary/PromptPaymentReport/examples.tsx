import React from 'react';
import { PromptPaymentReport } from './';

export default () => (
  <PromptPaymentReport month="2018-03-%" onClose={() => console.log('CLOSE')} />
);
