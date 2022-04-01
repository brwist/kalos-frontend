// ? Picker for choosing the status of a Transaction for use with filtering ('accepted', 'rejected', etc.)

import React, { FC, useState, useEffect, useCallback } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { TransactionStatus } from '../../../../@kalos-core/kalos-rpc/TransactionStatus';

interface Props {
  options: string[];
  selected: number;
  disabled?: boolean;
  onSelect?(id: string): void;
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
  const [selectedOption, setSelectedOption] = useState<string>(
    options[selected],
  );
  const handleSelect = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.value;
    if (onSelect) {
      try {
        setSelectedOption(e.currentTarget.value);
        onSelect(id);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <FormControl style={{ marginBottom: 10 }}>
      <InputLabel htmlFor="txn-status-picker">{label || 'Status'}</InputLabel>
      <NativeSelect
        disabled={disabled}
        value={selectedOption}
        onChange={handleSelect}
        inputProps={{ name: 'Accepted / Rejected', id: 'txn-status-picker' }}
      >
        {options.map((item: string, idx: number) => (
          <option value={item} key={`${item}-${idx}`}>
            {item}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
};
