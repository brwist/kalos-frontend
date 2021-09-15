import React from 'react';
import { AddPermission } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <AddPermission
      userId={101275}
      permissionType={'department'}
      userPermissions={[]}
    />
  </>
);
