import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
import { SectionBar } from '../SectionBar';
import { TransactionAccountsPayable } from '../TransactionAccountsPayable';
import { getRPCFields } from '../../../helpers';
import { Modal } from '../Modal';
import { MergeTable } from '../MergeTable';
import { TxnDepartment } from '@kalos-core/kalos-rpc/compiled-protos/transaction_pb';

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

const ProperTransactionNames = {
  id: 'Id',
  jobId: 'Job ID',
  departmentIdList: 'Department ID List',
  departmentId: 'Department ID',
  ownerId: 'Assigned Employee',
  vendor: 'vendor',
  costCenterId: 'Cost Center ID',
  description: 'Description',
  amount: 'Amount',
  timestamp: 'Timestamp',
  notes: 'Notes',
  isActive: 'Active?',
  statusId: 'Status ID',
  status: 'Status',
  ownerName: 'Owner Name',
  cardUsed: 'Card Used',
  documents: 'Documents',
  activityLog: 'Activity Log',
  department: 'Transaction Department',
  costCenter: 'Cost Center',
  isAudited: 'Audited?',
  isRecorded: 'Recorded?',
  artificialId: 'Artificial ID',
  vendorCategory: 'Vendor Category',
  assignedEmployeeId: 'Assigned Employee ID',
  assignedEmployeeName: 'Assigned Employee Name',
};

export const CompareTransactions: FC<Props> = ({ loggedUserId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const handleSetConflicts = useCallback(
    (conflicts: Conflict[]) => setConflicts(conflicts),
    [setConflicts],
  );

  const generateConflicts = (): any[] => {
    if (!transactions) {
      console.error('There are no transactions to generate conflicts from.');
      return [];
    }

    let newConflicts: Conflict[] = [];
    let newTransaction = {} as Transaction.AsObject;

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

        for (const fieldCurrent of Object.values(transaction.toObject())) {
          let fieldCurrentEmpty = false;
          let fieldPreviousEmpty = false;
          const fieldPrevious = previousTransaction[fieldIndex]; // For namings' sake
          // If either of them is a '' or a null, we need to determine the one that is not null and choose that value for the merge
          // This regex determines if whitespace exists in the string
          if (
            !fieldCurrent ||
            fieldCurrent?.toString().match(/^\s+$/) ||
            fieldPrevious === undefined
          ) {
            fieldCurrentEmpty = true;
          }
          if (
            !fieldPrevious ||
            fieldPrevious?.toString().match(/^\s+$/) ||
            fieldPrevious === undefined
          ) {
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

          if (
            fieldPrevious != fieldCurrent &&
            fieldPrevious?.toString() != fieldCurrent?.toString()
          ) {
            let newConflict: Conflict[];

            // need to find conflicts with the same indices and then see if the members match
            if (
              newConflicts.filter(conflict => conflict.index === fieldIndex)
                .length > 0
            ) {
              newConflict = newConflicts
                .filter(conflict => conflict.index === fieldIndex)
                .map(conflictMatching => {
                  if (
                    !conflictMatching.transactionsAffected.includes(transaction)
                  ) {
                    conflictMatching.transactionsAffected.push(transaction);
                  }
                  if (
                    !conflictMatching.transactionsAffected.includes(
                      transactions[index - 1],
                    )
                  ) {
                    conflictMatching.transactionsAffected.push(
                      transactions[index - 1],
                    );
                  }

                  return conflictMatching;
                });
            }

            // At this point, we need to resolve the conflict at a later point so we'll shove it into a conflict.
            newConflicts.push(
              newConflict!
                ? newConflict![0]
                : ({
                    index: fieldIndex,
                    transactionsAffected: [
                      transaction,
                      transactions[index - 1],
                    ],
                  } as Conflict),
            );
          }

          fieldIndex++;
        }
      }
    });
    return [newConflicts, newTransaction];
  };

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

    const [conflicts, transaction] = generateConflicts();
    setConflicts(conflicts);
  }, [transactions, conflicts, setConflicts, generateConflicts]);

  // Each row is a specific conflict
  // Each conflict holds an index and a txn
  //
  return (
    <>
      {conflicts && (
        <Modal
          open={conflicts.length > 0}
          onClose={() => handleSetConflicts([])}
        >
          <MergeTable
            columnHeaders={[{ name: 'Name of Field' }]}
            rows={conflicts.map(conflict => {
              // Need to be each conflict's relevant field
              const keys = Object.keys(
                conflict.transactionsAffected[0].toObject(),
              );
              return {
                // @ts-ignore
                rowName: ProperTransactionNames[keys[conflict.index]]
                  ? // @ts-ignore
                    ProperTransactionNames[keys[conflict.index]]
                  : keys[conflict.index],
                choices: conflict.transactionsAffected.map(txn => {
                  // @ts-ignore

                  let cast = txn.toObject()[keys[conflict.index]];

                  //@ts-ignore
                  return `${cast}`;
                }),
              };
            })}
            onSubmit={(submitted: any) => alert('Clicked')}
            onCancel={() => handleSetConflicts([])}
          />
        </Modal>
      )}
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
