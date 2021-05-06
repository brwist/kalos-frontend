import React from 'react';
import { MergeTable } from './index';

export default () => {
  return (
    <MergeTable
      columnHeaders={[{ name: 'Test' }, { name: 'ME' }, { name: 'OUT' }]}
      rows={[{ choices: ['Out', 'Testing', 'More'] }]}
    />
  );
};
