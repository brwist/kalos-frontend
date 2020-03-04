import React, { ReactElement, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { SchemaProps, Option, Type } from '../Form';

export type Value = string | number;

export interface Props<T> extends SchemaProps<T> {
  value: T[keyof T];
  disabled?: boolean;
  onChange: (value: Value) => void;
  validation?: string;
  readOnly?: boolean;
  className?: string;
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
  type = 'text',
  value,
  readOnly = false,
  className = '',
  ...props
}) => {
  const classes = useStyles();
  const handleChange = useCallback(
    ({ target: { value } }) => onChange(type === 'number' ? +value : value),
    [type, onChange],
  );
  const handleChangeCheckbox = useCallback((_, value) => onChange(+value), [
    onChange,
  ]);
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
  if (type === 'checkbox') {
    return (
      <FormControl
        className={classes.field + ' ' + className}
        fullWidth
        disabled={disabled}
        error={error}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={+value === 1}
              onChange={handleChangeCheckbox}
              value={value}
              color="primary"
            />
          }
          label={inputLabel}
        />
      </FormControl>
    );
  }
  if (options && !readOnly) {
    const id = `${name}-select-label`;
    return (
      <FormControl
        className={classes.field + ' ' + className}
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
          value={value}
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
      className={classes.field + ' ' + className}
      disabled={disabled}
      onChange={handleChange}
      label={inputLabel}
      fullWidth
      InputProps={{
        readOnly,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      rowsMax={4}
      error={error}
      {...props}
      type={type}
      value={value}
      helperText={helper}
    />
  );
};
