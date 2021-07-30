import { Transaction } from '@kalos-core/kalos-rpc/Transaction';
import React, { FC, useCallback, useState } from 'react';
import { makeSafeFormObject } from '../../../helpers';
import { Form, Schema } from '../Form';
import { DepartmentPicker } from '../Pickers';

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
  console.log('Transaction input: ', transactionInput);
  const [transaction, setTransaction] = useState<Transaction>(transactionInput);
  const [departmentId, setDepartmentId] = useState<number>(0);

  const handleSetDepartmentId = useCallback(
    (departmentId: number) => {
      let txn = transaction;
      txn.setDepartmentId(departmentId);
      setTransaction(txn);
      setDepartmentId(departmentId);
    },
    [transaction, setTransaction, setDepartmentId],
  );

  const handleSetTransaction = useCallback(
    (newTxn: Transaction) => setTransaction(newTxn),
    [setTransaction],
  );

  const SCHEMA: Schema<Transaction> = [
    [
      {
        label: 'Job ID',
        name: 'getJobId',
        type: 'number',
      },
      {
        // At the moment, there's no dropdowns for Schemas so this is directly intermingled with state.
        // The original transaction fed into the form below gets updated in handleSetDepartmentId because
        // onChange is not fired when the department is chosen - this is to make sure department ID is
        // actually synced.
        // This dropdown was a request while making this module (in place of a prior "number" field)
        content: (
          <DepartmentPicker
            selected={departmentId}
            onSelect={selected => handleSetDepartmentId(selected as number)}
            renderItem={i => (
              <option value={i.getId()} key={`${i.getId()}-department-select`}>
                {i.getDescription()} - {i.getValue()}
              </option>
            )}
          />
        ),
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
        key={transaction.toString()}
        schema={SCHEMA}
        data={transaction}
        onChange={newTxn => {
          let safe = makeSafeFormObject(newTxn, new Transaction());
          safe.setDepartmentId(departmentId);
          handleSetTransaction(safe); // Sets this on-change because the field isn't actually tracked in the schema above,
          // it's kept in sync here. See the comment above for more info
          if (onChange) onChange(safe);
        }}
        onSave={() => onSave(transaction)}
        onClose={onClose}
        submitLabel="Save"
        cancelLabel="Cancel"
        title="Edit Transaction Created From Merge"
      />
    </>
  );
};
