import React, { FC } from 'react';

interface Props {
  loggedUserId: number;
  numberOfTransactions?: number; // Will spawn the transactions to compare
}

export const CompareTransactions: FC<Props> = (
  loggedUserId,
  numberOfTransactions = 2,
) => {
  return <>Testing</>;
};
