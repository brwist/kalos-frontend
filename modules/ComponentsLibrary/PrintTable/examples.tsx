import React from 'react';
import { PrintTable } from './';

export default () => (
  <>
    <PrintTable
      columns={['First Name', 'Last Name', 'Age', 'Title']}
      data={[
        ['John', 'Smith', 45, 'Technician'],
        ['Justine', 'Fireman', 32, 'Admin'],
        ['Mark', 'Snow', 51, 'Developer'],
        ['George', 'White', 22, 'Technician'],
      ]}
    />
  </>
);
