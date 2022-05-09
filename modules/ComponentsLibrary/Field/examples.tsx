import React, { useState, useCallback } from 'react';
import HighestIcon from '@mui/icons-material/Block';
import HighIcon from '@mui/icons-material/ChangeHistory';
import NormalIcon from '@mui/icons-material/RadioButtonUnchecked';
import LowIcon from '@mui/icons-material/Details';
import { Field, Props, Value, Options, Option } from './';

type Model = {
  firstName: string;
  amount: string;
};

const SELECT_OPTIONS_TXT: Options = ['red', 'green', 'blue'];
const SELECT_OPTIONS_PAIRS: Option[] = [
  { label: 'Yellow', value: 'yellow', color: '#FF0' },
  { label: 'Gold', value: 'gold', color: '#EC4' },
  { label: 'Brown', value: 'brown', color: '#A72' },
  { label: 'Orange', value: 'orange', color: '#E96' },
  { label: 'Red', value: 'red', color: '#E44' },
  { label: 'Blue', value: 'blue', color: '#11F' },
];
const SELECT_OPTIONS_ICON: Option[] = [
  { label: 'Highest', value: 1, icon: HighestIcon },
  { label: 'High', value: 2, icon: HighIcon },
  { label: 'Normal', value: 3, icon: NormalIcon },
  { label: 'Low', value: 4, icon: LowIcon },
];

export const EnhancedField = ({
  defaultValue = 'John',
  onChange,
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
  | 'onFileLoad'
  | 'onChange'
  | 'minutesStep'
> & {
  defaultValue?: Value | Value[];
}) => {
  const [value, setValue] = useState(defaultValue);
  const handleChange = useCallback(
    value => {
      setValue(value);
      if (onChange) {
        onChange(value);
      }
    },
    [setValue, onChange],
  );
  if (props.headline) return <Field {...props} />;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Field
        name="firstName"
        value={value}
        onChange={handleChange}
        {...props}
      />
      {props.options &&
        typeof props.options[0] === 'string' &&
        typeof value === 'string' && (
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
    <EnhancedField label="Time" defaultValue="21:35" type="time" />
    <EnhancedField
      label="Date/Time"
      defaultValue="2020-03-02 21:35"
      type="datetime"
    />
    <EnhancedField label="Color Field" type="color" defaultValue="#19a629" />
    <EnhancedField
      label="File Field"
      type="file"
      onFileLoad={(file, filename) => console.log({ file, filename })}
    />
    <EnhancedField
      label="Material Date"
      defaultValue="2020-03-02 00:00:00"
      type="mui-date"
    />
    <EnhancedField
      label="Material Time"
      defaultValue="2020-03-02 21:35:00"
      type="mui-time"
    />
    <EnhancedField
      label="Material Time Every 1 min"
      defaultValue="2020-03-02 21:35:00"
      type="mui-time"
      minutesStep={1}
    />
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
    <EnhancedField
      label="Service Call ID"
      defaultValue={86086}
      type="eventId"
      onChange={console.log}
    />
    <EnhancedField label="Technician" type="technician" defaultValue={'0'} />
    <EnhancedField label="Technicians" type="technicians" defaultValue={'0'} />
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
      label="Multiselect"
      options={SELECT_OPTIONS_PAIRS}
      defaultValue={[
        SELECT_OPTIONS_PAIRS[0].value,
        SELECT_OPTIONS_PAIRS[2].value,
      ]}
      type="multiselect"
    />
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
      label="Select Field With Icon"
      options={SELECT_OPTIONS_ICON}
      defaultValue={SELECT_OPTIONS_ICON[0].value}
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
