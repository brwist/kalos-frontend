import React from 'react';
import { PermissionsManager } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <PermissionsManager
      loggedUserId={101275}
      onClose={() => console.log('close pls')}
    />
  </>
);
