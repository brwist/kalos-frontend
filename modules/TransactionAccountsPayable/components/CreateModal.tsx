import React, { useState, useCallback, FC } from 'react';
import {
  Transaction,
  TransactionClient,
} from '@kalos-core/kalos-rpc/Transaction';
import { Modal } from '../../ComponentsLibrary/Modal';
import { AccountPicker } from '../../ComponentsLibrary/Pickers';
import { Form, Schema } from '../../ComponentsLibrary/Form';
import { ENDPOINT } from '../../../constants';
import { getRPCFields } from '../../../helpers';

const transactionClient = new TransactionClient(ENDPOINT);

type Entry = Transaction.AsObject;

interface EntryWithDate extends Entry {
  date?: string;
}

type Props = {
  show: boolean;
  entry: EntryWithDate;
  onClose: () => void;
  onSave: (entry: Transaction.AsObject) => void;
};

const CreateModal: FC<Props> = ({ show, entry, onClose, onSave }) => {
  const [saving, setSaving] = useState<boolean>(false);
  const [costCenterId, setCostCenterId] = useState<number>(0);
  const data = { ...entry };

  const SCHEMA: Schema<EntryWithDate> = [
    [{ label: 'Vendor', name: 'vendor' }],
    [
      { label: 'date', name: 'timestamp', type: 'date', required: true },
      { label: 'Amount', name: 'amount', type: 'number', required: true },
    ],
    [
      {
        label: 'Description',
        name: 'description',
        multiline: true,
        required: true,
      },
    ],
    [{ label: 'Notes', name: 'notes', multiline: true }],
    [
      {
        label: 'Department',
        name: 'departmentId',
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
              }
            }}
            sort={(a, b) => a.description.localeCompare(b.description)}
            renderItem={i => (
              <option value={i.id} key={`${i.id}-account-select`}>
                {i.description} ({i.id})
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
      data.costCenterId = costCenterId;
      const req = new Transaction();
      for (const fieldName in data) {
        const { methodName } = getRPCFields(fieldName);
        //@ts-ignore
        req[methodName](data[fieldName]);
      }
      const result = await transactionClient.Create(req);
      onSave(result);
    },
    [setSaving],
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
