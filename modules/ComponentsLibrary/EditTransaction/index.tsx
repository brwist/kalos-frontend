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
  const [transaction] = useState<Transaction>(transactionInput);

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
    txn.setFieldMaskList([
      'JobId',
      'DepartmentId',
      'OwnerId',
      'Vendor',
      'CostCenterId',
      'Description',
      'Amount',
      'Timestamp',
      'Notes',
      'IsActive',
      'StatusId',
      'Status',
      'OwnerName',
      'CardUsed',
      'IsAudited',
      'IsRecorded',
      'VendorCategory',
      'AssignedEmployeeId',
      'AssignedEmployeeName',
    ]);
    return txn;
  };

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
