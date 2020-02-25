import React, { ReactElement, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SectionBar } from './SectionBar';
import { Field, Value } from './Field';

export type Option = {
  label: string;
  value: string | number;
};

export type Schema<T> = {
  name: keyof T;
  label: string;
  options?: (string | Option)[];
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  type?: 'string' | 'password';
};

type Validation = { [key: string]: string };

interface Props<T> {
  schema: Schema<T>[];
  data: T;
  onSave: (data: T) => void;
  onClose: () => void;
  disabled?: boolean;
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
}));

export const Form: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  schema,
  data,
  onSave,
  onClose,
  disabled = false,
}) => {
  const classes = useStyles();
  const [formData, setFormData] = useState(
    schema.reduce(
      (aggr, { name }) => ({ ...aggr, [name]: data[name] }),
      {} as typeof data
    )
  );
  const [validations, setValidations] = useState<Validation>({});
  const handleChange = useCallback(
    name => (value: Value) => setFormData({ ...formData, [name]: value }),
    [formData, setFormData]
  );
  const handleSave = useCallback(() => {
    setValidations({});
    const validations: Validation = {};
    schema
      .filter(({ required }) => required)
      .forEach(({ name }) => {
        const value: string = '' + formData[name];
        if (value === '') {
          validations[name as string] = 'This field is required.';
        }
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
        title="Edit Customer Information"
        buttons={[
          {
            label: 'Save',
            onClick: handleSave,
            disabled,
          },
          {
            label: 'Cancel',
            onClick: onClose,
            disabled,
          },
        ]}
        className={classes.sectionBar}
      />
      <div className={classes.form}>
        {schema.map((props, idx) => (
          <Field
            key={idx}
            {...props}
            value={formData[props.name]}
            onChange={handleChange(props.name)}
            disabled={disabled}
            validation={validations[props.name as string]}
          />
        ))}
      </div>
    </div>
  );
};
