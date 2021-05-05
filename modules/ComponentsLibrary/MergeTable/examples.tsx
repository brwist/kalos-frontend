import React from 'react';
import { MergeTable } from './index';

export default () => {
  return (
    <MergeTable
      columnHeaders={[{ name: 'Test' }]}
      rows={[{ choices: ['Testing'] }, { choices: ['Out'] }]}
    />
  );
};
