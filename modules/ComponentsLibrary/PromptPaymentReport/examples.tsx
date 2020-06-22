import React from 'react';
import { PromptPaymentReport } from './';

export default () => (
  <PromptPaymentReport month="2020-05-%" onClose={() => console.log('CLOSE')} />
);
