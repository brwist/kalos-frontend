import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
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
          handleSetChanged(true);
          let safe = makeSafeFormObject(newTxn, new Transaction());
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
