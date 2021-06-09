import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { useCallback, useEffect, useState } from 'react';
import { EditTransaction } from '.';
import { TransactionClientService } from '../../../helpers';
import { ExampleTitle } from '../helpers';

export default () => {
  const [transactionTest, setTransactionTest] = useState<Transaction.AsObject>(
    {} as Transaction.AsObject,
  );

  const handleLoadTransaction = useCallback(async () => {
    let txn: Transaction = new Transaction();
    txn.setId(3);
    setTransactionTest(await TransactionClientService.Get(txn));
  }, [setTransactionTest, TransactionClientService]);

  useEffect(() => {
    // Grabs a transaction:
    handleLoadTransaction();
  }, [transactionTest, handleLoadTransaction, TransactionClientService]);
  return (
    <>
      <ExampleTitle>Transaction with ID 3 in the database: </ExampleTitle>
      <EditTransaction
        key={transactionTest.id}
        transactionInput={transactionTest}
        onSave={saved => {
          alert('Check the console for results of save');
          console.log(saved);
        }}
        onClose={() => alert('Would close')}
      />
    </>
  );
};
