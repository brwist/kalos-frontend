import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
import { SectionBar } from '../SectionBar';
import { TransactionAccountsPayable } from '../TransactionAccountsPayable';
import { getRPCFields } from '../../../helpers';

interface Props {
  loggedUserId: number;
}

// Conflicts are checked before they are created, and if there is one with the same index on it then
// the new one will not be made and instead the old conflict will have the new transaction pushed
// into it.
interface Conflict {
  index: number; // index of the fields that are conflicting
  transactionsAffected: Transaction[]; // The transactions that are conflicting with each other
}

export const CompareTransactions: FC<Props> = ({ loggedUserId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const handleSetTransactions = useCallback(
    (txns: Transaction[]) => {
      setTransactions(txns);
    },
    [setTransactions],
  );

  const handleMerge = useCallback(() => {
    if (!transactions) {
      console.error(
        'Cannot handle merge - no transactions available to merge.',
      );
      return;
    }
    alert('Would have merged');
    let mergedTxns: Transaction.AsObject[] = [];

    let newConflicts: Conflict[] = [];
    transactions.forEach((transaction, index) => {
      // If a field is empty on the transaction being merged or if it is equivalent on both transactions, we want to keep it to the existent one.
      // If there are different (but set) fields then the transactions should be put into a conflict. If there were never any conflicts, the
      // merge will skip the conflict resolution step. However, if there is a conflict, then it should have a conflict resolution step and
      // the Accounts Payable employee will be able to choose each field to accept or change via a diff view. This will set the fields of a
      // transaction in the background upon change that will be upserted in the transactions. The upsert will either keep the current ones,
      // delete all or delete a few of the transactions.

      // If not null, we can compare them. If it is null, nothing to compare - just use that transaction that exists
      if (transactions[index - 1] == null) {
        //mergedTxns.push(transaction);
      } else {
        // Loop over fields in the current transaction and compare that with the fields in the previous transaction at the same index
        let fieldIndex = 0;
        const previousTransaction = Object.values(
          transactions[index - 1].toObject(),
        );
        const keys = Object.keys(transactions[index - 1].toObject());

        let newTransaction = {} as Transaction.AsObject;

        for (const fieldCurrent of Object.values(transaction.toObject())) {
          let fieldCurrentEmpty = false;
          let fieldPreviousEmpty = false;
          const fieldPrevious = previousTransaction[fieldIndex]; // For namings' sake
          // If either of them is a '' or a null, we need to determine the one that is not null and choose that value for the merge
          // This regex determines if whitespace exists in the string
          if (!fieldCurrent || fieldCurrent?.toString().match(/^\s+$/)) {
            fieldCurrentEmpty = true;
          }
          if (!fieldPrevious || fieldPrevious?.toString().match(/^\s+$/)) {
            fieldPreviousEmpty = true;
          }

          if (fieldCurrentEmpty && !fieldPreviousEmpty) {
            // Set the field to be the previous field
            //@ts-ignore
            newTransaction[keys[fieldIndex]] = fieldPrevious;
            fieldIndex++;
            continue;
          }
          if (fieldPreviousEmpty && !fieldCurrentEmpty) {
            // Set the field to be the current field
            //@ts-ignore
            newTransaction[keys[fieldIndex]] = fieldCurrent;
            fieldIndex++;

            continue;
          }
          if (fieldPreviousEmpty && fieldCurrentEmpty) {
            // Set the field empty
            //@ts-ignore
            newTransaction[keys[fieldIndex]] = '';
            fieldIndex++;

            continue;
          }

          if (fieldPrevious != fieldCurrent) {
            // At this point, we need to resolve the conflict at a later point so we'll shove it into a conflict.
            newConflicts.push({
              index: fieldIndex,
              transactionsAffected: [transaction, transactions[index - 1]],
            } as Conflict);
          }

          fieldIndex++;
        }

        console.log('NEW CONFLICTS:', newConflicts);
        console.log('New transaction: ', newTransaction);

        // let newTransaction: Transaction = new Transaction();
        // let idx = 0;
        // for (const val of Object.values(transaction.toObject())) {
        //   // Check the index of any conflicts and if it matches this instance, check all the conflicts and see if it clashes with any of the
        //   // other transactions in that conflict. If it does, then push this txn in as well. If not, ignore.
        //   for (const conflict of conflicts) {
        //     if (conflict.index == idx) {
        //       let indexOfTransactionVal = 0;
        //       for (const conflictTransaction of conflict.transactionsAffected) {
        //         for (const conflictTransactionVal of Object.values(
        //           conflictTransaction.toObject(),
        //         )) {
        //           if (indexOfTransactionVal === idx) {
        //             // This is the same field
        //             if (conflictTransactionVal != val) {
        //               console.log('Pushing to a transaction');
        //               // push to conflict
        //               conflicts
        //                 .find(element => element === conflict)
        //                 ?.transactionsAffected.push(transaction);
        //             }
        //           }
        //           indexOfTransactionVal++;
        //         }
        //       }
        //     }
        //   }

        //   console.log('Conflicts before check:', conflicts);
        //   if (
        //     conflicts.filter(conflict => conflict.index == index).length == 0
        //   ) {
        //     for (const valComparison of Object.values(
        //       transactions[index - 1],
        //     )) {
        //       if (fieldIndex == index) {
        //         console.log('Comparing value: ' + valComparison + ' | ' + val);
        //         if (valComparison != val) {
        //           let conflictsNew = conflicts;
        //           conflictsNew.push({
        //             index: fieldIndex,
        //             transactionsAffected: [
        //               transaction,
        //               transactions[index - 1],
        //             ],
        //           } as Conflict);
        //           setConflicts(conflictsNew);
        //           console.log('Added conflict: ', conflicts);
        //         }
        //       }
        //       fieldIndex++;
        //     }
        //   }
        //   idx++;
        // }
      }
    });
  }, [transactions, conflicts, setConflicts]);

  console.log('Transactions are now: ', transactions);

  return (
    <>
      <SectionBar
        title="Select Transactions To Merge"
        actions={[
          {
            label: 'Merge',
            onClick: handleMerge,
          },
        ]}
      />
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
    </>
  );
};
