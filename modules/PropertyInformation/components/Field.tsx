import React, { ReactElement, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Schema } from './Form';

export type Value = string;

export interface Props<T> extends Schema<T> {
  value: T[keyof T];
  disabled?: boolean;
  onChange: (value: Value) => void;
}

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
  required: {
    color: theme.palette.error.main,
  },
}));

export const Field: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  name,
  label,
  options,
  onChange,
  disabled = false,
  required = false,
  ...props
}) => {
  const classes = useStyles();
  const handleChange = useCallback(
    ({ target: { value } }) => onChange(value as string),
    [onChange]
  );
  const inputLabel = (
    <>
      {label}
      {required ? <span className={classes.required}> *</span> : ''}
    </>
  );
  if (options) {
    const id = `${name}-select-label`;
    return (
      <FormControl className={classes.field} fullWidth disabled={disabled}>
        <InputLabel id={id}>{inputLabel}</InputLabel>
        <Select
          labelId={id}
          id={`${name}-select`}
          onChange={handleChange}
          {...props}
        >
          {options.map(value => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
  return (
    <TextField
      className={classes.field}
      disabled={disabled}
      onChange={handleChange}
      label={inputLabel}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
      {...props}
    />
  );
};
