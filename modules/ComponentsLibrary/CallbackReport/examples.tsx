import React from 'react';
import { CallbackReport } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default with onClose</ExampleTitle>
    <CallbackReport
      dateStart="2020-01-14"
      dateEnd="2020-01-20"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
