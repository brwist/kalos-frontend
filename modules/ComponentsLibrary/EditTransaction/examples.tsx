import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React from 'react';
import { EditTransaction } from '.';

let transactionTest = new Transaction();
transactionTest.setId(100100);
transactionTest.setNotes('Testing notes');

export default () => {
  return (
    <EditTransaction loggedUserId={98217} transactionInput={transactionTest} />
  );
};
