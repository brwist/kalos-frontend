import React, { ReactElement, useCallback, useState, ReactNode } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from '../SectionBar';
import { Props as ButtonProps } from '../Button';
import { Field, Value } from '../Field';

export type Option = {
  label: string;
  value: string | number;
};

export type Options = (string | Option)[];

export type Type = 'text' | 'password' | 'number';

export type SchemaProps<T> = {
  label: string;
  name?: keyof T;
  headline?: boolean;
  description?: string;
  options?: Options;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  type?: Type;
};

export type Schema<T> = SchemaProps<T>[][];

type Validation = { [key: string]: string };

interface Props<T> {
  title: string;
  schema: Schema<T>;
  data: T;
  onSave: (data: T) => void;
  onClose: () => void;
  disabled?: boolean;
  readOnly?: boolean;
  actions?: ButtonProps[];
  children?: ReactNode;
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
  },
  sectionBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  form: {
    padding: theme.spacing(2),
    paddingTop: 50 + theme.spacing(),
    maxHeight: 'calc(100vh - 110px)',
    overflowY: 'auto',
  },
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
  },
  group: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  field: {
    marginLeft: theme.spacing(2),
  },
  description: {
    fontWeight: 400,
    marginLeft: theme.spacing(),
    fontSize: 12,
    color: theme.palette.grey[600],
  },
}));

const getDefaultValueByType = (type: Type) => {
  if (type === 'number') return 0;
  return '';
};

export const Form: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  title,
  schema,
  data,
  onSave,
  onClose,
  disabled = false,
  readOnly = false,
  actions = [],
  children,
}) => {
  const classes = useStyles();
  const [formData, setFormData] = useState(
    schema.reduce(
      (aggr, fields) => ({
        ...aggr,
        ...fields.reduce(
          (aggr, { name, type = 'text' }) =>
            name === undefined
              ? aggr
              : { ...aggr, [name]: data[name] || getDefaultValueByType(type) },
          {},
        ),
      }),
      {} as typeof data,
    ),
  );
  const [validations, setValidations] = useState<Validation>({});
  const handleChange = useCallback(
    name => (value: Value) => setFormData({ ...formData, [name]: value }),
    [formData, setFormData],
  );
  const handleSave = useCallback(() => {
    setValidations({});
    const validations: Validation = {};
    schema.forEach(fields => {
      fields
        .filter(({ required }) => required)
        .forEach(({ name }) => {
          if (name) {
            const value: string = '' + formData[name];
            if (formData[name] === undefined || value === '') {
              validations[name as string] = 'This field is required.';
            }
          }
        });
    });
    if (Object.keys(validations).length > 0) {
      setValidations(validations);
      return;
    }
    onSave(formData);
  }, [onSave, formData, schema, setValidations]);
  return (
    <div className={classes.wrapper}>
      <SectionBar
        title={title}
        actions={[
          ...actions,
          {
            label: readOnly ? 'Close' : 'Cancel',
            onClick: onClose,
            disabled,
            variant: readOnly ? 'contained' : 'outlined',
          },
          ...(readOnly
            ? []
            : [
                {
                  label: 'Save',
                  onClick: handleSave,
                  disabled,
                },
              ]),
        ]}
        className={classes.sectionBar}
      />
      <div className={classes.form}>
        {children && (
          <Typography className={classes.error}>{children}</Typography>
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
              const { name, label, description } = props;
              if (name !== undefined)
                return (
                  <Field
                    key={idx2}
                    {...props}
                    value={formData[name]}
                    onChange={handleChange(name)}
                    disabled={disabled}
                    validation={validations[name as string]}
                    readOnly={readOnly}
                    className={idx2 === 0 ? '' : classes.field}
                  />
                );
              return (
                <Typography key={idx2} className={classes.headline}>
                  {label}
                  {description && (
                    <span className={classes.description}>{description}</span>
                  )}
                </Typography>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
