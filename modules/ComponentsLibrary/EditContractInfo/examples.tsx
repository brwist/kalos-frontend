import React from 'react';
import { EditContractInfo } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <EditContractInfo
      userID={8428}
      contractID={1051}
      onSave={contractData => console.log('Saved: ', contractData)}
      onClose={() => alert('Would close')}
      onChange={changed => console.log('OnChange output: ', changed)}
    />
  </>
);
