import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Form, Schema } from '../Form';
import { PlainForm } from '../PlainForm';

interface Props {
  transactionInput: Transaction.AsObject;
  onSave: (saved: Transaction.AsObject) => void;
  onClose: () => void;
  onChange?: (changed: Transaction.AsObject) => void;
}

export const EditTransaction: FC<Props> = ({
  transactionInput,
  onSave,
  onClose,
  onChange,
}) => {
  const [transaction] = useState<Transaction.AsObject>(transactionInput);
  const SCHEMA: Schema<Transaction.AsObject> = [
    [
      {
        label: 'Job ID',
        name: 'jobId',
        type: 'number',
      },
      {
        label: 'Department ID',
        name: 'departmentId',
        type: 'number',
      },
    ],
    [
      {
        label: 'Owner ID',
        name: 'ownerId',
        type: 'number',
      },
      {
        label: 'Cost Center ID',
        name: 'costCenterId',
        type: 'number',
      },
      {
        label: 'Amount',
        name: 'amount',
        type: 'number',
      },
    ],
    [
      {
        label: 'Assigned Employee Id',
        name: 'assignedEmployeeId',
        type: 'number',
      },
      {
        label: 'Status ID',
        name: 'statusId',
        type: 'number',
      },
    ],
    [
      {
        label: 'Timestamp',
        name: 'timestamp',
        type: 'mui-datetime',
      },
      {
        label: 'Notes',
        name: 'notes',
        multiline: true,
      },
    ],
    [
      {
        label: 'Description',
        name: 'description',
        multiline: true,
      },
      {
        label: 'Status',
        name: 'status',
      },
    ],
    [
      {
        label: 'Vendor',
        name: 'vendor',
      },
    ],
    [
      {
        label: 'Vendor Category',
        name: 'vendorCategory',
      },
    ],
    [
      {
        label: 'Is recorded?',
        name: 'isRecorded',
        type: 'checkbox',
      },
      {
        label: 'Is active?',
        name: 'isActive',
        type: 'checkbox',
      },
      {
        label: 'Is audited?',
        name: 'isAudited',
        type: 'checkbox',
      },
    ],
  ];
  return (
    <>
      <Form<Transaction.AsObject>
        schema={SCHEMA}
        data={transaction}
        onChange={onChange}
        onSave={saved => onSave(saved)}
        onClose={onClose}
        submitLabel="Save"
        cancelLabel="Cancel"
        title="Edit Transaction Created From Merge"
      />
    </>
  );
};
