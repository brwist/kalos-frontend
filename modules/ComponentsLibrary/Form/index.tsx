import React, { ReactElement, useCallback, useState } from 'react';
import { SectionBar, Pagination } from '../SectionBar';
import { Props as ButtonProps } from '../Button';
import {
  PlainForm,
  PlainFormProps,
  Validation,
  Schema as PlainFormSchema,
} from '../PlainForm';
import { Options as FieldOptions, Type } from '../Field';

export type Schema<T> = PlainFormSchema<T>;

export type Options = FieldOptions;

interface Props<T> extends PlainFormProps<T> {
  title: string;
  subtitle?: string;
  onSave: (data: T) => void;
  onClose?: () => void;
  actions?: ButtonProps[];
  pagination?: Pagination;
  submitLabel?: string;
  cancelLabel?: string;
}

const getDefaultValueByType = (type: Type) => {
  if (type === 'number') return 0;
  return '';
};

export const Form: <T>(props: Props<T>) => ReactElement<Props<T>> = ({
  title,
  subtitle,
  schema,
  data,
  onSave,
  onClose,
  disabled = false,
  readOnly = false,
  actions = [],
  pagination,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  error,
  className = '',
  children,
}) => {
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
  const [validations, setValidations] = useState<Validation>({});
  const handleChange = useCallback(
    (formData: typeof data) => setFormData(formData),
    [setFormData],
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
    <div className={className}>
      <SectionBar
        title={title}
        subtitle={subtitle}
        actions={[
          ...actions,
          ...(readOnly
            ? []
            : [
                {
                  label: submitLabel,
                  onClick: handleSave,
                  disabled,
                },
              ]),
          ...(onClose
            ? [
                {
                  label: readOnly ? 'Close' : cancelLabel,
                  onClick: onClose,
                  disabled,
                  variant: readOnly
                    ? ('contained' as const)
                    : ('outlined' as const),
                },
              ]
            : []),
        ]}
        fixedActions
        pagination={pagination}
      />
      <PlainForm<typeof data>
        schema={schema}
        data={data}
        onChange={handleChange}
        children={children}
        disabled={disabled}
        error={error}
        readOnly={readOnly}
        validations={validations}
      />
    </div>
  );
};
