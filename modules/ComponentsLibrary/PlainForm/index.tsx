import React, { ReactElement, useCallback, useState, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Props as ButtonProps } from '../Button';
import {
  Field,
  Value as ValueType,
  Option as OptionType,
  Options as OptionsType,
  Type,
  getDefaultValueByType,
} from '../Field';

export type Value = ValueType;
export type Option = OptionType;
export type Options = OptionsType;

export type SchemaProps<T> = {
  label?: ReactNode;
  name?: keyof T;
  headline?: boolean;
  description?: string;
  options?: Options;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  type?: Type;
  onChange?: (value: Value) => void;
  onFileLoad?: (file: string | ArrayBuffer | null, filename: string) => void;
  actions?: ButtonProps[];
  actionsInLabel?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
};

export type Schema<T> = SchemaProps<T>[][];

export type Validation = { [key: string]: string };

type Style = {
  compact?: boolean;
  fullWidth?: boolean;
};

export interface PlainFormProps<T> extends Style {
  schema: Schema<T>;
  data: T;
  disabled?: boolean;
  readOnly?: boolean;
  error?: ReactNode;
  children?: ReactNode;
  className?: string;
}

interface Props<T> extends PlainFormProps<T> {
  onChange: (data: T) => void;
  validations?: Validation;
}

const useStyles = makeStyles(theme => ({
  form: ({ compact, fullWidth }: Style) => ({
    padding: theme.spacing(2),
    ...(compact
      ? {
          paddingTop: 0,
          paddingBottom: 0,
        }
      : {}),
    ...(fullWidth
      ? {
          paddingLeft: 0,
          paddingRight: 0,
        }
      : {}),
  }),
  error: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.dark,
    padding: theme.spacing(2),
    marginTop: theme.spacing(-1.5),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    marginBottom: theme.spacing(2),
  },
  errorFields: {
    display: 'block',
    margin: theme.spacing(),
    marginBottom: 0,
    paddingLeft: theme.spacing(2),
  },
  errorField: {
    display: 'list-item',
  },
  headline: {
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
  },
  group: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  field: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
  description: {
    fontWeight: 400,
    marginLeft: theme.spacing(),
    fontSize: 12,
    color: theme.palette.grey[600],
  },
}));

export const PlainForm: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  schema,
  data,
  onChange,
  disabled = false,
  readOnly = false,
  compact = false,
  fullWidth = false,
  error,
  validations = {},
  className = '',
  children,
}) => {
  const classes = useStyles({ compact, fullWidth });
  const [formData, setFormData] = useState(
    schema.reduce(
      (aggr, fields) => ({
        ...aggr,
        ...fields.reduce(
          (aggr, { name, type = 'text' }) =>
            name === undefined
              ? aggr
              : {
                  ...aggr,
                  [name]:
                    data[name] !== undefined
                      ? data[name]
                      : getDefaultValueByType(type),
                },
          {},
        ),
      }),
      {} as typeof data,
    ),
  );
  const handleChange = useCallback(
    name => (value: Value) => {
      const data = { ...formData, [name]: value };
      setFormData(data);
      const field = schema
        .reduce((aggr, fields) => [...aggr, ...fields], [])
        .find(field => field.name === name);
      if (field && field.onChange) {
        field.onChange(value);
      }
      onChange(data);
    },
    [formData, setFormData, onChange],
  );
  return (
    <div className={className + ' ' + classes.form}>
      {error && (
        <Typography className={classes.error} component="div">
          {error}
        </Typography>
      )}
      {Object.keys(validations).length > 0 && (
        <Typography className={classes.error}>
          Please correct the following validation errors and try again.
          <span className={classes.errorFields}>
            {Object.keys(validations).map(fieldName => (
              <span key={fieldName} className={classes.errorField}>
                <strong>
                  {
                    schema
                      .reduce((aggr, fields) => [...aggr, ...fields], [])
                      .find(({ name }) => name === fieldName)?.label
                  }
                  :{' '}
                </strong>
                {validations[fieldName]}
              </span>
            ))}
          </span>
        </Typography>
      )}
      {schema.map((fields, idx) => (
        <div key={idx} className={classes.group}>
          {fields.map((props, idx2) => {
            const { name } = props;
            return (
              <Field
                key={`${idx2}-${name}`}
                {...props}
                value={name ? formData[name] : undefined}
                onChange={handleChange(name)}
                disabled={disabled || props.disabled}
                validation={validations[name as string]}
                readOnly={readOnly || props.readOnly}
                className={idx2 === 0 ? '' : classes.field}
              />
            );
          })}
        </div>
      ))}
      {children}
    </div>
  );
};
