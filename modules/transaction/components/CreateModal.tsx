import React, { useState, useCallback, FC } from 'react';
import {
  Transaction,
  TransactionClient,
} from '../../@kalos-core/kalos-rpc/Transaction';
import { Modal } from '../../ComponentsLibrary/Modal';
import { AccountPicker } from '../../ComponentsLibrary/Pickers';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { ENDPOINT } from '../../../constants';
import { getRPCFields, makeSafeFormObject } from '../../../helpers';

const transactionClient = new TransactionClient(ENDPOINT);
interface EntryWithDate extends Transaction {
  date?: string;
}

type Props = {
  show: boolean;
  entry: EntryWithDate;
  onClose: () => void;
  onSave: (entry: Transaction) => void;
};

const CreateModal: FC<Props> = ({ show, entry, onClose, onSave }) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [costCenterId, setCostCenterId] = useState<number>(0);
  const data = entry;

  const SCHEMA: Schema<EntryWithDate> = [
    [{ label: 'Vendor', name: 'getVendor' }],
    [
      { label: 'date', name: 'getTimestamp', type: 'date', required: true },
      { label: 'Amount', name: 'getAmount', type: 'number', required: true },
    ],
    [
      {
        label: 'Description',
        name: 'getDescription',
        multiline: true,
        required: true,
      },
    ],
    [{ label: 'Notes', name: 'getNotes', multiline: true }],
    [
      {
        label: 'Department',
        name: 'getDepartmentId',
        type: 'department',
        required: true,
      },
      {
        content: (
          <AccountPicker
            selected={costCenterId}
            onSelect={costCenterID => {
              if (typeof costCenterID === 'number') {
                setCostCenterId(costCenterID);
                console.log(costCenterId);
              }
            }}
            sort={(a, b) =>
              a.getDescription().localeCompare(b.getDescription())
            }
            renderItem={i => (
              <option value={i.getId()} key={`${i.getId()}-account-select`}>
                {i.getDescription()} ({i.getId()})
              </option>
            )}
          />
        ),
      },
    ],
  ];

  const handleCreate = useCallback(
    async (data: EntryWithDate) => {
      setSaving(true);
      const newDate = data.date;
      data = makeSafeFormObject(data, new Transaction());
      if (newDate) {
        data.setTimestamp(newDate);
      }
      if (data.getDepartmentId()) {
        const temp = data.getDepartmentId().toString();
        data.setDepartmentId(parseInt(temp));
      }
      data.setCostCenterId(costCenterId);
      data.setStatusId(2);
      const result = await transactionClient.Create(data);
      onSave(result);
    },
    [setSaving, costCenterId, onSave],
  );

  return (
    <Modal open={show} onClose={onClose}>
      <Form<EntryWithDate>
        title="Create Transaction"
        schema={SCHEMA}
        data={data}
        onSave={handleCreate}
        onClose={onClose}
        disabled={saving}
      ></Form>
    </Modal>
  );
};

export default CreateModal;
