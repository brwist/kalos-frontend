import React from 'react';
import { EmployeePermissions } from './index';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Ready</ExampleTitle>
    <EmployeePermissions userId={101275} loggedUserId={101275} />
  </>
);
