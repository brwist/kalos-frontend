import React, { FC, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { PlainForm, Schema } from '../PlainForm';
import { SearchForm } from './';

interface Props {
  schema: Schema<SearchForm>;
  data: SearchForm;
  onChange: (data: SearchForm) => void;
  onSubmit?: () => void;
  className: string;
  disabled: boolean;
}

export const SearchFormComponent: FC<Props> = ({
  schema,
  data,
  onChange,
  onSubmit,
  className,
  disabled,
}) => {
  const [formData, setFormData] = useState<SearchForm>(data);
  const handleChange = useCallback(
    (data: SearchForm) => {
      console.log({ data });
      setFormData(data);
      onChange(data);
    },
    [onChange, setFormData],
  );
  return (
    <PlainForm
      schema={schema}
      data={formData}
      onChange={debounce(handleChange, 300)}
      onSubmit={onSubmit}
      compact
      className={className}
      disabled={disabled}
    />
  );
};
