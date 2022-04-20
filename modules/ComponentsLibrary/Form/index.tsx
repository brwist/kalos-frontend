import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useState,
  forwardRef,
  JSXElementConstructor,
} from 'react';
import { SectionBar, PaginationType } from '../SectionBar';
import { Props as ButtonProps } from '../Button';
import {
  PlainForm,
  PlainFormProps,
  Validation,
  Schema as PlainFormSchema,
} from '../PlainForm';
import { Options as FieldOptions, getDefaultValueByType } from '../Field';
import { ActionsProps } from '../Actions';
import './Form.module.less';

export type Schema<T> = PlainFormSchema<T>;

export type Options = FieldOptions;

export interface Props<T> extends PlainFormProps<T> {
  title?: string;
  subtitle?: ReactNode;
  intro?: ReactNode;
  onSave: (data: T) => void;
  onClose: (() => void) | null;
  onChange?: (data: T) => void;
  actions?: ButtonProps[];
  pagination?: PaginationType;
  submitLabel?: string;
  submitDisabled?: boolean;
  cancelLabel?: string;
  stickySectionBar?: boolean;
  inputFieldRefs?: any[];
}

// ? The '| null' at the end of the type for the forward ref is simply there to ensure Typescript doesn't error
export const Form: <T>(
  props: Props<T>,
) => ReactElement<any, string | JSXElementConstructor<any>> | null = forwardRef(
  (
    {
      title,
      subtitle,
      intro,
      schema,
      data,
      onSave,
      onClose,
      onChange,
      disabled = false,
      readOnly = false,
      actions = [],
      pagination,
      submitLabel = 'Save',
      cancelLabel = 'Cancel',
      submitDisabled = false,
      error,
      className = '',
      stickySectionBar = false,
      children,
      inputFieldRefs,
    },
    functionRef,
  ) => {
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
      (formData: typeof data) => {
        setFormData(formData);
        if (onChange) {
          onChange(formData);
        }
      },
      [setFormData, onChange],
    );
    const handleSave = useCallback(() => {
      setValidations({});
      const validations: Validation = {};
      schema.forEach(fields => {
        fields
          .filter(({ required }) => required)
          .forEach(({ name, type = 'text', options }) => {
            if (name) {
              const value: string = '' + formData[name];
              if (
                formData[name] === undefined ||
                value === '' ||
                ((['classCode', 'department', 'eventId', 'technician'].includes(
                  type,
                ) ||
                  !!options) &&
                  value === '0')
              ) {
                validations[name as string] = 'This field is required.';
              }
              if (type === 'eventId' && typeof formData[name] === 'string') {
                validations[name as string] = 'Invalid Service Call ID.';
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
        {title && (
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
                      disabled: disabled || submitDisabled,
                    },
                  ]),
              ...(onClose !== null
                ? ([
                    {
                      label: readOnly ? 'Close' : cancelLabel,
                      onClick: onClose,
                      disabled,
                      variant: readOnly ? 'contained' : 'outlined',
                    },
                  ] as ActionsProps)
                : []),
            ]}
            fixedActions
            pagination={pagination}
            sticky={stickySectionBar}
          />
        )}
        {intro && <div className="FormIntro">{intro}</div>}
        <PlainForm<typeof data>
          schema={schema}
          data={data}
          onChange={handleChange}
          disabled={disabled}
          error={error}
          readOnly={readOnly}
          validations={validations}
          ref={functionRef}
          inputFieldRefs={inputFieldRefs}
        >
          {children}
        </PlainForm>
        {!title && (
          <button
            // @ts-ignore
            ref={functionRef}
            onClick={handleSave}
            style={{ display: 'none' }}
          >
            submit
          </button>
        )}
      </div>
    );
  },
);
