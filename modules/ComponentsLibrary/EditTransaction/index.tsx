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
  // TODO: Remake this into a function that auto-generates it instead.
  // Would have not made it this way with the AsObject figuring we were phasing out of it, but atm Form
  // is difficult to use without AsObject because Transaction would just use getJobId for example, but
  // that isn't called so the form is blank with that.
  const [transaction] = useState<Transaction.AsObject>({
    jobId: transactionInput.getJobId(),
    departmentId: transactionInput.getDepartmentId(),
    ownerId: transactionInput.getOwnerId(),
    vendor: transactionInput.getVendor(),
    costCenterId: transactionInput.getCostCenterId(),
    description: transactionInput.getDescription(),
    amount: transactionInput.getAmount(),
    timestamp: transactionInput.getTimestamp(),
    notes: transactionInput.getNotes(),
    isActive: transactionInput.getIsActive(),
    statusId: transactionInput.getStatusId(),
    status: transactionInput.getStatus(),
    ownerName: transactionInput.getOwnerName(),
    cardUsed: transactionInput.getCardUsed(),
    isAudited: transactionInput.getIsAudited(),
    isRecorded: transactionInput.getIsRecorded(),
    vendorCategory: transactionInput.getVendorCategory(),
    assignedEmployeeId: transactionInput.getAssignedEmployeeId(),
    assignedEmployeeName: transactionInput.getAssignedEmployeeName(),
  } as Transaction.AsObject);

  const convertTransactionAsObjectToTransaction = (
    asObject: Transaction.AsObject,
  ) => {
    let txn = new Transaction();
    txn.setJobId(asObject.jobId);
    txn.setDepartmentId(asObject.departmentId);
    txn.setOwnerId(asObject.ownerId);
    txn.setVendor(asObject.vendor);
    txn.setCostCenterId(asObject.costCenterId);
    txn.setDescription(asObject.description);
    txn.setAmount(asObject.amount);
    txn.setTimestamp(asObject.timestamp);
    txn.setNotes(asObject.notes);
    txn.setIsActive(asObject.isActive);
    txn.setStatusId(asObject.statusId);
    txn.setStatus(asObject.status);
    txn.setOwnerName(asObject.ownerName);
    txn.setCardUsed(asObject.cardUsed);
    txn.setIsAudited(asObject.isAudited);
    txn.setIsRecorded(asObject.isRecorded);
    txn.setVendorCategory(asObject.vendorCategory);
    txn.setAssignedEmployeeId(asObject.assignedEmployeeId);
    txn.setAssignedEmployeeName(asObject.assignedEmployeeName);
    return txn;
  };

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
        onChange={() => {
          onChange;
        }}
        onSave={saved => {
          onSave(convertTransactionAsObjectToTransaction(saved));
        }}
        onClose={onClose}
        submitLabel="Save"
        cancelLabel="Cancel"
        title="Edit Transaction Created From Merge"
      />
    </>
  );
};
