import React from 'react';
import { TransactionAccountsPayable } from '.';
import { ExampleTitle } from '../helpers';

export default () => {
  return (
    <>
      <ExampleTitle>Default</ExampleTitle>
      <TransactionAccountsPayable loggedUserId={98217} />
      <ExampleTitle>Has Actions</ExampleTitle>
      <TransactionAccountsPayable loggedUserId={98217} hasActions />
      <ExampleTitle>Set to be a selector</ExampleTitle>
      <TransactionAccountsPayable loggedUserId={98217} isSelector />
      <ExampleTitle>Set to be a selector (with an onSelect)</ExampleTitle>
      <TransactionAccountsPayable
        loggedUserId={98217}
        isSelector
        onSelect={() => alert('Selected')}
      />
    </>
  );
};
