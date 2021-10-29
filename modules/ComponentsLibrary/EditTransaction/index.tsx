import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { NULL_TIME, ENDPOINT } from '../../../constants';
import { makeSafeFormObject, TransactionClientService } from '../../../helpers';
import { Form, Schema } from '../Form';
import { SUBJECT_TAGS_ACCOUNTS_PAYABLE } from '@kalos-core/kalos-rpc/S3File';
import {
  TransactionStatusClient,
  TransactionStatus,
} from '@kalos-core/kalos-rpc/TransactionStatus';
import {
  TransactionAccountClient,
  TransactionAccount,
} from '@kalos-core/kalos-rpc/TransactionAccount';
interface Props {
  transactionInput: Transaction;
  onSave: (saved: Transaction) => void;
  onClose: () => void;
  onChange?: (changed: Transaction) => void;
  title?: string;
}

export const EditTransaction: FC<Props> = ({
  transactionInput,
  onSave,
  onClose,
  onChange,
  title,
}) => {
  const [transaction] = useState<Transaction>(transactionInput);
  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [transactionStatuses, setTransactionStatuses] = useState<
    { label: string; value: number }[]
  >();
  const [transactionAccounts, setTransactionAccounts] = useState<
    { label: string; value: number }[]
  >();
  const tagsTranslated = [];
  for (let i = 0; i < SUBJECT_TAGS_ACCOUNTS_PAYABLE.length; i++) {
    const tempStruct = {
      label: SUBJECT_TAGS_ACCOUNTS_PAYABLE[i].label,
      value: SUBJECT_TAGS_ACCOUNTS_PAYABLE[i].label.replace(' ', ''),
    };
    tagsTranslated.push(tempStruct);
  }
  useEffect(() => {
    const txnStatusClient = new TransactionStatusClient(ENDPOINT);
    const accountClient = new TransactionAccountClient(ENDPOINT);
    async function getStatuses() {
      const req = new TransactionStatus();
      const res = await txnStatusClient.BatchGet(req);
      const accountRes = await accountClient.BatchGet(new TransactionAccount());

      setTransactionStatuses(
        res.getResultsList().map(status => ({
          label: status.getDescription(),
          value: status.getId(),
        })),
      );
      setTransactionAccounts(
        accountRes.getResultsList().map(account => ({
          label: `${account.getId()}-${account.getDescription()}`,
          value: account.getId(),
        })),
      );
    }
    if (loading) {
      setLoading(false);
      getStatuses();
    }
  }, [loading]);
  const handleSetChanged = useCallback(
    (changed: boolean) => setChanged(changed),
    [setChanged],
  );

  const SCHEMA: Schema<Transaction> = [
    [
      {
        label: 'Job ID',
        name: 'getJobId',
        type: 'eventId',
      },
      {
        label: 'Department',
        name: 'getDepartmentId',
        type: 'department',
        required: true,
      },
    ],
    [
      {
        label: 'Purchaser',
        name: 'getOwnerId',
        type: 'technician',
      },
      {
        label: 'Cost Center ID',
        name: 'getCostCenterId',
        type: 'number',
        options: transactionAccounts,
      },
      {
        label: 'Amount',
        name: 'getAmount',
        type: 'number',
      },
    ],
    [
      {
        label: 'Creator',
        name: 'getAssignedEmployeeId',
        type: 'technician',
        disabled: true,
      },
      {
        label: 'Status ID',
        name: 'getStatusId',
        type: 'number',
        options: transactionStatuses,
        disabled: true,
      },
    ],
    [
      {
        label: 'Timestamp',
        name: 'getTimestamp',
        type: 'mui-datetime',
        required: true,
      },
      {
        label: 'Notes',
        name: 'getNotes',
        multiline: true,
      },
    ],
    [
      {
        label: 'Description',
        name: 'getDescription',
        multiline: true,
      },
    ],
    [
      {
        label: 'Vendor',
        name: 'getVendor',
      },
      {
        label: 'Order #',
        name: 'getOrderNumber',
        multiline: true,
      },
      {
        label: 'Invoice #',
        name: 'getInvoiceNumber',
        multiline: true,
      },
    ],
    [
      {
        label: 'Vendor Category',
        name: 'getVendorCategory',
        options: tagsTranslated,
      },
    ],
    [
      {
        label: 'Is recorded?',
        name: 'getIsRecorded',
        type: 'checkbox',
      },
      {
        label: 'Is audited?',
        name: 'getIsAudited',
        type: 'checkbox',
      },
    ],
  ];
  return (
    <>
      <Form<Transaction>
        submitDisabled={!changed}
        schema={SCHEMA}
        data={transaction}
        onChange={newTxn => {
          let safe = makeSafeFormObject(newTxn, new Transaction());
          try {
            if (
              safe.getTimestamp() != '0000-00-00 00:00:00' &&
              safe.getTimestamp() != NULL_TIME
            ) {
              handleSetChanged(true);
            }
          } catch (err) {
            console.error(
              `An error occurred while using an if statement to call handleSetChanged() in EditTransaction: ${err}`,
            );
          }
          if (onChange) onChange(safe);
        }}
        onSave={txn => {
          let safe = makeSafeFormObject(txn, new Transaction());
          onSave(safe);
        }}
        onClose={onClose}
        submitLabel="Save"
        cancelLabel="Cancel"
        title={title ? title : 'Edit Transaction Created From Merge'}
      />
    </>
  );
};
