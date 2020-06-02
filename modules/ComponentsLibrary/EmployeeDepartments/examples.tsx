import React from 'react';
import { EmployeeDepartments } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>as seen by regular user</ExampleTitle>
    <EmployeeDepartments
      loggedUserId={2573}
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>as seen by admin</ExampleTitle>
    <EmployeeDepartments loggedUserId={101253} />
  </>
);
