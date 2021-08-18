import React, { FC, useState, useCallback } from 'react';
import { Field } from '../../ComponentsLibrary/Field';

interface Props {
  initialValue: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}

export const NoteField: FC<Props> = ({ initialValue, onChange, onBlur }) => {
  const [value, setValue] = useState<string>(initialValue);
  const handleChange = useCallback(
    value => {
      setValue(value);
      onChange(value);
    },
    [setValue, onChange],
  );
  const handleBlur = useCallback(
    value => {
      if (onBlur) {
        setValue(value);
        onBlur(value);
      }
    },
    [onBlur],
  );
  return (
    <Field
      name="notes"
      label="Notes"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      multiline
    />
  );
};
