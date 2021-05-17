// This table is meant to be used by the accounts payable role
// It can create and merge transactions, and generally do transaction based work

import React from 'react';
import { TransactionTable } from '.';
import { ExampleTitle } from '../helpers';

export default () => {
  return (
    <>
      <ExampleTitle>Default</ExampleTitle>
      <TransactionTable loggedUserId={98217} />
      <ExampleTitle>Has Actions</ExampleTitle>
      <TransactionTable loggedUserId={98217} hasActions />
      <ExampleTitle>Set to be a selector</ExampleTitle>
      <TransactionTable loggedUserId={98217} isSelector />
      <ExampleTitle>Set to be a selector (with an onSelect)</ExampleTitle>
      <TransactionTable
        loggedUserId={98217}
        isSelector
        onSelect={() => alert('Selected')}
      />
    </>
  );
};
