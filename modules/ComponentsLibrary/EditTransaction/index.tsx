import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Form, Schema } from '../Form';
import { PlainForm } from '../PlainForm';

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

  const SCHEMA: Schema<Transaction> = [
    [
      {
        label: 'Job ID',
        name: 'getJobId',
        type: 'number',
      },
      {
        label: 'Department ID',
        name: 'getDepartmentId',
        type: 'number',
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
        schema={SCHEMA}
        data={transaction}
        onChange={() => {
          onChange;
        }}
        onSave={saved => {
          onSave(saved);
        }}
        onClose={onClose}
        submitLabel="Save"
        cancelLabel="Cancel"
        title="Edit Transaction Created From Merge"
      />
    </>
  );
};
