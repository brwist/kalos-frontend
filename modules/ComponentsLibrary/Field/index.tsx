import React, { ReactElement, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Schema, Option } from '../../PropertyInformation/components/Form';

export type Value = string;

export interface Props<T> extends Schema<T> {
  value: T[keyof T];
  disabled?: boolean;
  onChange: (value: Value) => void;
  validation?: string;
}

const useStyles = makeStyles(theme => ({
  field: {
    marginTop: 0,
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
  validation = '',
  helperText = '',
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
  const error = validation !== '';
  const helper =
    validation !== '' || helperText !== ''
      ? validation + ' ' + helperText
      : undefined;
  if (options) {
    const id = `${name}-select-label`;
    return (
      <FormControl
        className={classes.field}
        fullWidth
        disabled={disabled}
        error={error}
      >
        <InputLabel id={id}>{inputLabel}</InputLabel>
        <Select
          labelId={id}
          id={`${name}-select`}
          onChange={handleChange}
          {...props}
        >
          {options.map(option => {
            const isStringOption = typeof option === 'string';
            const label = isStringOption
              ? (option as string)
              : (option as Option).label;
            const value = isStringOption
              ? (option as string)
              : (option as Option).value;
            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
        {helper && <FormHelperText>{helper}</FormHelperText>}
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
      rowsMax={4}
      error={error}
      {...props}
      helperText={helper}
    />
  );
};
