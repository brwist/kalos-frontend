import React, { useState } from 'react';
import { Field, Props, Value, Options, Option } from './';

type Model = {
  firstName: string;
  amount: string;
};

const SELECT_OPTIONS_TXT: Options = ['red', 'green', 'blue'];
const SELECT_OPTIONS_PAIRS: Option[] = [
  { label: 'Gold', value: 'gold', color: '#EC4' },
  { label: 'Brown', value: 'brown', color: '#A72' },
  { label: 'Orange', value: 'orange', color: '#E96' },
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
  | 'placeholder'
  | 'actionsInLabel'
> & {
  defaultValue?: Value;
}) => {
  const [value, setValue] = useState(defaultValue);
  if (props.headline) return <Field {...props} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Field name="firstName" value={value} onChange={setValue} {...props} />
      {props.options && typeof props.options[0] === 'string' && (
        <div
          style={{
            width: 30,
            height: 30,
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
    <EnhancedField
      label="With placeholder"
      defaultValue=""
      placeholder="Placeholder..."
    />
    <EnhancedField label="Disabled" disabled />
    <EnhancedField label="Read Only" readOnly />
    <EnhancedField
      label="Required with actions"
      required
      actions={[
        { label: 'Action 1' },
        { label: 'Action 2', variant: 'outlined' },
      ]}
    />
    <EnhancedField
      label="With actions on label"
      required
      actions={[
        { label: 'Action 1' },
        { label: 'Action 2', variant: 'outlined' },
      ]}
      actionsInLabel
      multiline
    />
    <EnhancedField label="Search" type="search" />
    <EnhancedField label="Password" type="password" />
    <EnhancedField label="Number" type="number" />
    <EnhancedField
      label="Date"
      defaultValue="2020-03-02 00:00:00"
      type="date"
    />
    <EnhancedField
      label="Material Date"
      defaultValue="2020-03-02 00:00:00"
      type="mui-date"
    />
    <EnhancedField label="Time" defaultValue="21:35" type="time" />
    <EnhancedField label="Material Time" defaultValue="2020-03-02 21:35:00" type="mui-time" />
    <EnhancedField label="Signature" type="signature" />
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
    <EnhancedField label="Technician" type="technician" defaultValue={'0'} />
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
      actions={[{ label: 'Action' }]}
    />
    <EnhancedField
      label="Headline with description"
      headline
      description="Description..."
    />
    <EnhancedField
      label="Select Field With Color"
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
    <EnhancedField label="ClassCode Picker" type="classCode" />
    <EnhancedField label="Department Picker" type="department" />
  </div>
);
