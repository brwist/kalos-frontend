import React from 'react';
import { TransactionAccountsPayable } from '.';
import { ExampleTitle } from '../helpers';

export default () => {
  return (
    <>
      <ExampleTitle>Default</ExampleTitle>
      <TransactionAccountsPayable loggedUserId={98217} />
      <ExampleTitle>Set to be a selector</ExampleTitle>
      <TransactionAccountsPayable loggedUserId={98217} isSelector />
    </>
  );
};
