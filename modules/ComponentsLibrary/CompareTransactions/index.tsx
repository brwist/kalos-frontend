import React, { FC, useCallback, useState } from 'react';
import { SectionBar } from '../SectionBar';
import {
  ActivityLogClientService,
  getRPCFields,
  TransactionClientService,
  TransactionDocumentClientService,
  FileClientService,
  S3ClientService,
  uploadPhotoToExistingTransaction,
  SimpleFile,
  TransactionActivityClientService,
} from '../../../helpers';
import { Modal } from '../Modal';
import { MergeTable, SelectedChoice } from '../MergeTable';
import { Alert } from '../Alert';
import Typography from '@material-ui/core/Typography';
import { Loader } from '../../Loader/main';
import { ActivityLog } from '../../../@kalos-core/kalos-rpc/ActivityLog';
import { format } from 'date-fns';
import { TransactionTable } from '../TransactionTable';
import { Transaction } from '../../../@kalos-core/kalos-rpc/compiled-protos/transaction_pb';
import { TransactionDocument } from '../../../@kalos-core/kalos-rpc/TransactionDocument';
import { File } from '../../../@kalos-core/kalos-rpc/File';
import { MergeTransactionIds } from '../../../@kalos-core/kalos-rpc/compiled-protos/transaction_activity_pb';

/*
  Compares transactions with each other and has the ability to create a "diff view" sort of table which shows conflicts in the 
  transactions. The user can click on the buttons to resolve the conflicts by choosing the correct option for them, and they can
  modify their choices in the transaction viewer if they so choose before they upload. 
*/

interface Props {
  loggedUserId: number;
  onClose?: () => void;
  onMerge?: () => void;
}

// Conflicts are checked before they are created, and if there is one with the same index on it then
// the new one will not be made and instead the old conflict will have the new transaction pushed
// into it.
interface Conflict {
  index: number; // index of the fields that are conflicting
  transactionsAffected: Transaction[]; // The transactions that are conflicting with each other
}

// The names displayed in the rows of the table (database name as key, display name as value)
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

// The fields to ignore when generating conflicts. This will prevent the user from setting any value for these when upserting the
// merged transaction to the database.
const IgnoredFieldNames: string[] = [
  'activityLogString',
  'departmentString',
  'ownerName',
  'assignedEmployeeName',
  'id',
  'costCenterString',
  'activityLogList',
  'cardUsed',
  'artificalId',
];

export const CompareTransactions: FC<Props> = ({
  loggedUserId,
  onClose,
  onMerge,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const [transactionToSave, setTransactionToSave] = useState<Transaction>(
    new Transaction(),
  );

  const [upsertError, setUpsertError] = useState<string>();
  const [sameTransactionError, setSameTransactionError] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);

  // Deletes all selected transactions
  const deleteTransactions = useCallback(async () => {
    if (!transactions) {
      return;
    }
    for await (const txn of transactions) {
      try {
        setLoading(true);
        // Delete is not working atm, leaving a todo here for future reference but using update as a replacement
        // TODO
        console.log(txn);
        txn.setIsActive(0);
        txn.setFieldMaskList(['IsActive']);

        // ? Beginning of ignoring private fields to stop errors "fieldname" in "field_list"

        // @ts-expect-error
        txn.setOwnerName(undefined);
        // @ts-expect-error
        txn.setDepartmentString(undefined);
        // @ts-expect-error
        txn.setActivityLogString(undefined);
        // @ts-expect-error
        txn.setCardUsed(undefined);
        // @ts-expect-error
        txn.setCostCenterString(undefined);
        // @ts-expect-error
        txn.setAssignedEmployeeName(undefined);
        // End of ignoring private fields

        await TransactionClientService.Update(txn);
        setLoading(false);
        // const transactionResult = await TransactionClientService.Delete(txn);
        // if (transactionResult)
        //   console.log('Deleted transaction: ', transactionResult);
      } catch (err) {
        console.error('Failed to delete transaction: ', err);
        if (
          String(err).includes(`Unknown column`) &&
          String(err).includes(`in 'field list'`)
        )
          console.error(
            `This error commonly occurs when there are fields set on the transaction that do not exist in the database. Please ensure they are undefined.`,
          );
        setLoading(false);
      }
    }
  }, [transactions]);

  const handleSaveActivityLog = useCallback(
    async (activityLog: ActivityLog) => {
      try {
        await ActivityLogClientService.Create(activityLog);
      } catch (err) {
        console.error(
          `An error occurred while creating the activity log for the transaction: ${err}`,
        );
        setUpsertError(err);
      }
    },
    [setUpsertError],
  );

  const handleSetConflicts = useCallback(
    (conflicts: Conflict[]) => setConflicts(conflicts),
    [setConflicts],
  );

  const handleSaveTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        setLoading(true);
        let txnMade = await TransactionClientService.Create(transaction);
        const docList = [];
        for (let i = 0; i < transactions!.length; i++) {
          const result = await TransactionDocumentClientService.byTransactionID(
            transactions![i].getId(),
          );
          docList.push(result);
        }
        await handleMergeDocuments(docList, txnMade);
        let activityLog = new ActivityLog();
        activityLog.setActivityName(
          `Merged Transactions - IDs: ${transactions!
            .map(txn => txn.getId())
            .join(' AND ')} - Created transaction with ID: ${txnMade.getId()}`,
        );
        activityLog.setUserId(loggedUserId);
        activityLog.setActivityDate(format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
        const mergeReq = new MergeTransactionIds();
        mergeReq.setMergedtransaction(txnMade.getId());
        mergeReq.setTransactionidlistList(
          transactions!.map(transaction => transaction.getId()),
        );
        TransactionActivityClientService.MergeTransactionLogs(mergeReq);
        await deleteTransactions();

        await handleSaveActivityLog(activityLog);
        setLoading(false);
        if (onMerge) onMerge();
        return txnMade.getId();
      } catch (err) {
        console.error(`An error occurred while saving the transaction: ${err}`);
        setUpsertError(err);
        return 0;
      }
    },
    [
      setUpsertError,
      transactions,
      deleteTransactions,
      setLoading,
      handleSaveActivityLog,
      loggedUserId,
      onMerge,
    ],
  );
  const handleMergeDocuments = async (
    mergedTransactionDocumentList: TransactionDocument[][],
    newTransaction: Transaction,
  ) => {
    for (let i = 0; i < mergedTransactionDocumentList.length; i++) {
      let documents = mergedTransactionDocumentList[i];
      for (let j = 0; j < documents.length; j++) {
        //Step 1- Change Transaction Id
        try {
          let req = documents[j];
          const oldTransaction = req.getTransactionId();
          req.setTransactionId(newTransaction.getId());
          req.setFieldMaskList(['TransactionId']);
          await TransactionDocumentClientService.Update(req);
          //Step 2- Change Name in File Table (change old Job Number to New Job Number)
          const fileReq = new File();
          fileReq.setId(req.getFileId());
          const fileResults = await FileClientService.Get(fileReq);
          const updateFileReq = new File();
          updateFileReq.setId(fileResults.getId());
          const oldName = fileResults.getName();
          const newName = oldName.replace(
            oldTransaction.toString(),
            newTransaction.getId().toString(),
          );
          updateFileReq.setName(newName);
          updateFileReq.setFieldMaskList(['Name']);
          await FileClientService.Update(updateFileReq);
          // Move Document in S3, changing Name to New Name
          await S3ClientService.Move(
            { bucket: 'kalos-transactions', key: oldName },
            { bucket: 'kalos-transactions', key: newName },
          );
        } catch (err) {
          console.error(`An error occurred merging documents: ${err}`);
          setUpsertError(err);
        }
      }
    }
  };
  const handleSetSubmissionResults = useCallback(
    async (submissionResults: SelectedChoice[]) => {
      submissionResults.forEach(async result => {
        if (
          // @ts-ignore
          transactionToSave[
            `get${getRPCFields(result.fieldName).methodName.substring(3)}`
          ]() == null
        ) {
          // @ts-ignore
          transactionToSave[getRPCFields(result.fieldName).methodName](
            result.value,
          );
        }
      });
      setLoading(true);
      await handleSaveTransaction(transactionToSave);
      setLoading(false);
      setConflicts([]);
    },
    [transactionToSave, setLoading, setConflicts, handleSaveTransaction],
  );

  const handleSetUpsertError = useCallback(
    (error: string) => setUpsertError(error),
    [setUpsertError],
  );

  const handleSetSameTransactionError = useCallback(
    (error: string) => setSameTransactionError(error),
    [setSameTransactionError],
  );

  const handleSetTransactionToSave = useCallback(
    (transactionToSaveNew: Transaction) => {
      setTransactionToSave(transactionToSaveNew);
    },
    [setTransactionToSave],
  );

  const generateConflicts = useCallback(() => {
    if (!transactions) {
      console.error('There are no transactions to generate conflicts from.');
      return [];
    }

    let newConflicts: Conflict[] = [];
    let newTransaction = new Transaction();

    transactions.forEach((transaction, index) => {
      if (transactions[index - 1] != null) {
        // Loop over fields in the current transaction and compare that with the fields in the previous transaction at the same index
        let fieldIndex = 0;
        const previousTransaction = Object.values(
          transactions[index - 1].toObject(),
        );

        const keys = Object.keys(transaction.toObject());
        for (const fieldCurrent of Object.values(transaction.toObject())) {
          if (IgnoredFieldNames.includes(keys[fieldIndex])) {
            fieldIndex++;
            continue;
          }

          let fieldCurrentEmpty = false;
          let fieldPreviousEmpty = false;
          const fieldPrevious = previousTransaction[fieldIndex]; // For namings' sake
          // If either of them is a '' or a null, we need to determine the one that is not null and choose that value for the merge
          // This regex determines if whitespace exists in the string
          if (
            fieldCurrent === undefined ||
            fieldCurrent?.toString().match(/^\s+$/) ||
            fieldCurrent == '' ||
            fieldPrevious === undefined
          ) {
            fieldCurrentEmpty = true;
          }
          if (
            !fieldPrevious === undefined ||
            fieldPrevious?.toString().match(/^\s+$/) ||
            fieldPrevious == ''
          ) {
            fieldPreviousEmpty = true;
          }

          if (fieldCurrentEmpty && !fieldPreviousEmpty) {
            // Set the field to be the previous field
            //@ts-ignore
            newTransaction['array'][fieldIndex] = fieldPrevious;
            fieldIndex++;
            continue;
          }
          if (fieldPreviousEmpty && !fieldCurrentEmpty) {
            // Set the field to be the current field
            //@ts-ignore
            newTransaction['array'][fieldIndex] = fieldCurrent;
            fieldIndex++;
            continue;
          }
          if (fieldPreviousEmpty && fieldCurrentEmpty) {
            // Set the field empty
            //@ts-ignore
            newTransaction['array'][fieldIndex] = '';
            fieldIndex++;
            continue;
          }

          if (fieldCurrent == fieldPrevious) {
            // Set the field to the value of the current field
            //@ts-ignore
            newTransaction['array'][fieldIndex] = fieldCurrent;
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

            if (
              newConflicts.filter(conflict => conflict.index == fieldIndex)
                .length == 0
            ) {
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
          }

          fieldIndex++;
        }
      }
    });

    return [newConflicts, newTransaction];
  }, [transactions]);

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
    const [conflicts, transaction] = generateConflicts();
    if ((conflicts as Conflict[]).length === 0)
      setSameTransactionError(
        'The transactions are the same. There is nothing to merge.',
      );
    setConflicts(conflicts as Conflict[]);
    setTransactionToSave(transaction as Transaction);
  }, [
    transactions,
    setConflicts,
    generateConflicts,
    setTransactionToSave,
    setSameTransactionError,
  ]);
  return (
    <>
      {loading && <Loader />}
      {sameTransactionError && (
        <Alert
          open={true}
          onClose={() => handleSetSameTransactionError('')}
          title="Error"
        >
          <Typography>{sameTransactionError}</Typography>
        </Alert>
      )}
      {upsertError && (
        <Alert
          open={true}
          onClose={() => handleSetUpsertError('')}
          title="Error"
        >
          <Typography>
            {'An error occurred during the saving of the transaction. Please notify one of our web-team members. ' +
              upsertError}
          </Typography>
        </Alert>
      )}
      {conflicts && (
        <Modal
          open={conflicts.length > 0}
          onClose={() => handleSetConflicts([])}
        >
          <MergeTable
            loggedUserId={loggedUserId}
            transaction={transactionToSave}
            viewMergedTransaction
            onSaveMergedTransaction={saved => {
              let txn = new Transaction();

              for (const fieldName of Object.keys(saved)) {
                // @ts-ignore
                if (saved[fieldName] != null) {
                  // Can't seem to do this a better way
                  txn.setJobId(saved.getJobId());
                  txn.setDepartmentId(saved.getDepartmentId());
                  txn.setOwnerId(saved.getOwnerId());
                  txn.setVendor(saved.getVendor());
                  txn.setCostCenterId(saved.getCostCenterId());
                  txn.setDescription(saved.getDescription());
                  txn.setAmount(saved.getAmount());
                  txn.setTimestamp(saved.getTimestamp());
                  txn.setNotes(saved.getNotes());
                  txn.setIsActive(saved.getIsActive());
                  txn.setStatusId(saved.getStatusId());
                  txn.setStatus(saved.getStatus());
                  txn.setOwnerName(saved.getOwnerName());
                  txn.setCardUsed(saved.getCardUsed());
                  txn.setIsAudited(saved.getIsAudited());
                  txn.setIsRecorded(saved.getIsRecorded());
                  txn.setVendorCategory(saved.getVendorCategory());
                  txn.setAssignedEmployeeId(saved.getAssignedEmployeeId());
                  txn.setAssignedEmployeeName(saved.getAssignedEmployeeName());
                  txn.setInvoiceNumber(saved.getInvoiceNumber());
                }
              }

              handleSetTransactionToSave(txn);
            }}
            onChangeTransaction={newTxn => handleSetTransactionToSave(newTxn)}
            columnHeaders={[{ name: 'Name of Field' }]}
            rows={conflicts.map(conflict => {
              const keys = Object.keys(
                conflict.transactionsAffected[0].toObject(),
              );
              return {
                rowName: keys[conflict.index],
                rowIndex: conflict.index,
                choices: conflict.transactionsAffected.map(txn => {
                  // @ts-ignore
                  let cast = txn.toObject()[keys[conflict.index]];
                  return `${cast}`;
                }),
              };
            })}
            onSubmit={handleSetSubmissionResults}
            onCancel={() => handleSetConflicts([])}
            properNames={ProperTransactionNames}
            loading={loading}
          />
        </Modal>
      )}
      <SectionBar
        title="Select Transactions To Merge"
        fixedActions
        actions={
          !onClose
            ? [
                {
                  label: 'Merge',
                  onClick: handleMerge,
                },
              ]
            : [
                {
                  label: `Merge ${
                    transactions ? `(${transactions?.length} selected)` : ''
                  }`,
                  onClick: handleMerge,
                  disabled: !transactions,
                },
                {
                  label: 'Close',
                  onClick: () => onClose(),
                },
              ]
        }
      />
      {/* @ts-ignore */}
      <TransactionTable
        key={loading}
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
