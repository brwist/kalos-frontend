// ? Picker for choosing the status of a Transaction for use with filtering ('accepted', 'rejected', etc.)

import React, { useState, FC, useEffect, useCallback } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  TransactionStatus,
  TransactionStatusClient,
} from '@kalos-core/kalos-rpc/TransactionStatus';
import { ENDPOINT } from '../../../../constants';

interface Props {
  options: string[];
  selected: number;
  disabled?: boolean;
  onSelect?(id: number): void;
  test?(item: TransactionStatus): boolean;
  label?: string;
  useDevClient?: boolean;
}

export const StatusPicker: FC<Props> = ({
  options,
  selected,
  disabled,
  onSelect,
  test,
  label,
  useDevClient,
}) => {
  const handleSelect = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const id = parseInt(e.currentTarget.value);
    if (onSelect) {
      try {
        onSelect(id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const load = useCallback(() => {}, []);

  useEffect(() => {}, []);

  return (
    <FormControl style={{ marginBottom: 10 }}>
      <InputLabel htmlFor="txn-status-picker">{label || 'Status'}</InputLabel>
      <NativeSelect
        disabled={disabled}
        value={selected}
        onChange={handleSelect}
        inputProps={{ id: 'txn-status-picker' }}
      >
        <option value={0}>Select Status</option>
        {options.map((item: string, idx: number) => (
          <option value={item} key={`${item}-${idx}`}>
            {item}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};
