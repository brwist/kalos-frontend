import React, { useState } from 'react';
import { Field, Props, Value, Options } from './';

type Model = {
  firstName: string;
  amount: string;
};

const SELECT_OPTIONS_TXT: Options = ['red', 'green', 'blue'];
const SELECT_OPTIONS_PAIRS = [
  { label: 'Dark Red', value: '#500' },
  { label: 'Dark Green', value: '#050' },
  { label: 'Dark Blue', value: '#005' },
];

const EnhancedField = ({
  defaultValue = 'John',
  ...props
}: Pick<
  Props<Model>,
  | 'label'
  | 'disabled'
  | 'readOnly'
  | 'type'
  | 'multiline'
  | 'validation'
  | 'description'
  | 'helperText'
  | 'required'
  | 'options'
  | 'headline'
  | 'actions'
  | 'startAdornment'
  | 'endAdornment'
> & {
  defaultValue?: Value;
}) => {
  const [value, setValue] = useState(defaultValue);
  if (props.headline) return <Field {...props} />;
  return (
    <div style={{ display: 'flex' }}>
      <Field
        name="firstName"
        label="Text Field"
        value={value}
        onChange={setValue}
        {...props}
      />
      {props.options && (
        <div
          style={{
            width: 45,
            height: 45,
            background: value,
            marginLeft: 20,
          }}
        />
      )}
    </div>
  );
};

export default () => (
  <div style={{ margin: 8 }}>
    <EnhancedField label="Text Field" />
    <EnhancedField label="Disabled" disabled />
    <EnhancedField label="Disabled" readOnly />
    <EnhancedField label="Required" required />
    <EnhancedField label="Search" type="search" />
    <EnhancedField label="Password" type="password" />
    <EnhancedField label="Number" type="number" />
    <EnhancedField
      label="Date"
      defaultValue="2020-03-02 00:00:00"
      type="date"
    />
    <EnhancedField
      label="With start adornment"
      startAdornment="$"
      defaultValue={1432}
    />
    <EnhancedField
      label="With end adornment"
      endAdornment="USD"
      defaultValue={1432}
    />
    <EnhancedField
      label="Multiline"
      multiline
      defaultValue={`Lorem
Ipsum
Dolor
Sit
Amet`}
    />
    <EnhancedField label="Checkbox" type="checkbox" />
    <EnhancedField label="Headline" headline />
    <EnhancedField
      label="Select Field"
      options={SELECT_OPTIONS_TXT}
      defaultValue={SELECT_OPTIONS_TXT[0] as string}
    />
    <EnhancedField
      label="Headline with description"
      headline
      description="Description..."
    />
    <EnhancedField
      label="Select Field"
      options={SELECT_OPTIONS_PAIRS}
      defaultValue={SELECT_OPTIONS_PAIRS[0].value}
    />
    <EnhancedField
      label="With actions"
      headline
      actions={[
        {
          label: 'Action',
          size: 'xsmall',
          compact: true,
          variant: 'outlined',
        },
      ]}
    />
    <EnhancedField
      label="With validation error"
      validation="Error message..."
    />
    <EnhancedField label="With helper text" helperText="Helper text..." />
  </div>
);
