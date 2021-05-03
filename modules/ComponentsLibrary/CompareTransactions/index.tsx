import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
import { TransactionAccountsPayable } from '../TransactionAccountsPayable';

interface Props {
  loggedUserId: number;
}

export const CompareTransactions: FC<Props> = ({ loggedUserId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>();

  const handleSetTransactions = useCallback(
    (txns: Transaction[]) => {
      setTransactions(txns);
    },
    [setTransactions],
  );

  console.log('Transactions are now: ', transactions);

  return (
    <TransactionAccountsPayable
      loggedUserId={loggedUserId}
      isSelector
      onSelect={(txnChanged, transactions) =>
        handleSetTransactions(transactions)
      }
      onDeselect={(txnChanged, transactions) =>
        handleSetTransactions(transactions)
      }
    />
  );
};
