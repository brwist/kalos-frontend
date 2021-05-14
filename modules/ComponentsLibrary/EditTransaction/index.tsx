import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import { Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Form, Schema } from '../Form';
import { PlainForm } from '../PlainForm';

interface Props {
  loggedUserId: number;
  transactionInput: Transaction.AsObject;
}

export const EditTransaction: FC<Props> = ({
  loggedUserId,
  transactionInput,
}) => {
  const [transaction, setTransaction] =
    useState<Transaction.AsObject>(transactionInput);
  const SCHEMA: Schema<Transaction.AsObject> = [
    [
      {
        label: 'ID',
        name: 'id',
        type: 'number',
      },
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
      },
    ],
    [
      {
        label: 'Is active?',
        name: 'isActive',
        type: 'checkbox',
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

      {
        label: 'Description',
        name: 'description',
      },
      {
        label: 'Owner Name',
        name: 'ownerName',
      },
      {
        label: 'Card Used',
        name: 'cardUsed',
      },
      {
        label: 'Documents',
        name: 'documentsList',
      },
    ],
    [
      {
        label: 'Transaction Department',
        name: 'department',
      },
      {
        label: 'Cost Center',
        name: 'costCenter',
      },
      {
        label: 'Is audited?',
        name: 'isAudited',
        type: 'checkbox',
      },
    ],
    [
      {
        label: 'Is recorded?',
        name: 'isRecorded',
        type: 'checkbox',
      },
      {
        label: 'Vendor Category',
        name: 'vendorCategory',
      },

      {
        label: 'Assigned Employee Name',
        name: 'assignedEmployeeName',
      },
    ],
  ];
  return (
    <>
      <PlainForm<Transaction.AsObject>
        schema={SCHEMA}
        data={transaction}
        onChange={changed => console.log(changed)}
      />
    </>
  );
};
