import React from 'react';
import { MergeTable } from './index';

export default () => {
  return (
    <MergeTable
      columnHeaders={[{ name: 'TEST' }, { name: 'ME' }, { name: 'OUT' }]}
      rows={[
        { choices: ['Write', 'Multiple', 'Choices'] },
        {
          choices: [
            'You can put',
            'these just',
            'like any other table',
            'as well!',
          ],
        },
      ]}
      onSubmit={submitted => console.log('SUBMITTED: ', submitted)}
    />
  );
};
