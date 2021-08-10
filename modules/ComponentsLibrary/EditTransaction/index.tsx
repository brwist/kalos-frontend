import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
import { NULL_TIME } from '../../../constants';
import { makeSafeFormObject } from '../../../helpers';
import { Form, Schema } from '../Form';

interface Props {
  transactionInput: Transaction;
  onSave: (saved: Transaction) => void;
  onClose: () => void;
  onChange?: (changed: Transaction) => void;
}

export const EditTransaction: FC<Props> = ({
  transactionInput,
  onSave,
  onClose,
  onChange,
}) => {
  const [transaction] = useState<Transaction>(transactionInput);
  const [changed, setChanged] = useState<boolean>(false);

  const handleSetChanged = useCallback(
    (changed: boolean) => setChanged(changed),
    [setChanged],
  );

  const SCHEMA: Schema<Transaction> = [
    [
      {
        label: 'Job ID',
        name: 'getJobId',
        type: 'number',
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
        label: 'Owner ID',
        name: 'getOwnerId',
        type: 'number',
      },
      {
        label: 'Cost Center ID',
        name: 'getCostCenterId',
        type: 'number',
      },
      {
        label: 'Amount',
        name: 'getAmount',
        type: 'number',
      },
    ],
    [
      {
        label: 'Assigned Employee Id',
        name: 'getAssignedEmployeeId',
        type: 'number',
      },
      {
        label: 'Status ID',
        name: 'getStatusId',
        type: 'number',
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
      {
        label: 'Status',
        name: 'getStatus',
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
      },
    ],
    [
      {
        label: 'Is recorded?',
        name: 'getIsRecorded',
        type: 'checkbox',
      },
      {
        label: 'Is active?',
        name: 'getIsActive',
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
        title="Edit Transaction Created From Merge"
      />
    </>
  );
};
