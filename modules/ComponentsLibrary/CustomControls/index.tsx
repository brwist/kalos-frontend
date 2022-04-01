import React, { FC } from 'react';
import clsx from 'clsx';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps,
} from '@material-ui/pickers';
import { TextField as MuiTextField } from '@material-ui/core';
import {
  OutlinedTextFieldProps,
  FilledTextFieldProps,
  StandardTextFieldProps,
} from '@material-ui/core/TextField';
import './CustomControls.module.less';

interface DPProps extends DatePickerProps {
  white?: boolean;
  className?: string;
}

export const DatePicker: FC<DPProps> = ({ white, className, ...rest }) => (
  <MuiDatePicker
    className={clsx(
      className && className,
      white && 'CustomControlsInputWhite',
    )}
    {...rest}
  />
);

interface StandardTextFieldPropsWhite extends StandardTextFieldProps {
  white?: boolean;
  className?: string;
}

interface FilledTextFieldPropsWhite extends FilledTextFieldProps {
  white?: boolean;
  className?: string;
}

interface OutlinedTextFieldPropsWhite extends OutlinedTextFieldProps {
  white?: boolean;
  className?: string;
}

type TextFieldPropsWhite =
  | StandardTextFieldPropsWhite
  | FilledTextFieldPropsWhite
  | OutlinedTextFieldPropsWhite;

export const TextField: FC<TextFieldPropsWhite> = ({
  white,
  className,
  ...rest
}) => (
  <MuiTextField
    className={clsx(className, white && 'CustomControlsInputWhite')}
    {...rest}
  />
);
