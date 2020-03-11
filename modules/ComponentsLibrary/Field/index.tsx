import React, { ReactElement, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import { SchemaProps } from '../PlainForm';
import { Actions } from '../Actions';

export type Type =
  | 'text'
  | 'password'
  | 'number'
  | 'search'
  | 'checkbox'
  | 'date'
  | 'hidden';

export type Value = string | number;

export type Option = {
  label: string;
  value: string | number;
};

export type Options = (string | Option)[];

type Style = {
  type?: Type;
  disabled?: boolean;
};

export interface Props<T> extends SchemaProps<T> {
  value?: T[keyof T];
  disabled?: boolean;
  onChange?: (value: Value) => void;
  validation?: string;
  readOnly?: boolean;
  className?: string;
}

export const getDefaultValueByType = (type: Type) => {
  if (type === 'number') return 0;
  return '';
};

const useStyles = makeStyles(theme => ({
  field: ({ type }: Style) => ({
    marginTop: 0,
    marginBottom: theme.spacing(2),
    ...(type === 'hidden' ? { display: 'none' } : {}),
  }),
  required: {
    color: theme.palette.error.main,
  },
  headline: ({ disabled }: Style) => ({
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(-1),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    marginBottom: theme.spacing(),
    fontWeight: 600,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: disabled ? theme.palette.grey[500] : theme.palette.common.black,
  }),
  description: {
    fontWeight: 400,
    marginLeft: theme.spacing(),
    fontSize: 12,
    color: theme.palette.grey[600],
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(-2),
  },
}));

export const Field: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  name,
  label,
  headline,
  options,
  onChange,
  disabled = false,
  required = false,
  validation = '',
  helperText = '',
  type = 'text',
  readOnly = false,
  className = '',
  startAdornment,
  endAdornment,
  content,
  ...props
}) => {
  const dateTimePart = type === 'date' ? (props.value + '').substr(11, 8) : '';
  const value =
    type === 'date' ? (props.value + '').substr(0, 10) : props.value;
  const { actions, description } = props;
  const classes = useStyles({ type, disabled });
  const handleChange = useCallback(
    ({ target: { value } }) => {
      if (onChange) {
        let newValue = type === 'number' ? +value : value;
        if (type === 'date') {
          newValue += ' ' + dateTimePart;
        }
        onChange(newValue);
      }
    },
    [type, dateTimePart, onChange],
  );
  const handleChangeCheckbox = useCallback(
    (_, value) => {
      if (onChange) {
        onChange(+value);
      }
    },
    [onChange],
  );
  const inputLabel = (
    <>
      {label}
      {required && !readOnly ? (
        <span className={classes.required}> *</span>
      ) : (
        ''
      )}
    </>
  );
  const error = validation !== '';
  const helper =
    validation !== '' || helperText !== ''
      ? validation + ' ' + helperText
      : undefined;
  if (name === undefined || value === undefined) {
    if (headline) {
      return (
        <Typography component="div" className={classes.headline}>
          {label}
          {description && (
            <span className={classes.description}>{description}</span>
          )}
          {actions && <Actions actions={actions} fixed />}
        </Typography>
      );
    }
    return <div className={classes.content}>{content}</div>;
  }
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
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : (
          undefined
        ),
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : (
          undefined
        ),
      }}
      InputLabelProps={{
        shrink: true,
      }}
      error={error}
      {...props}
      type={type}
      value={value}
      helperText={helper}
    />
  );
};
