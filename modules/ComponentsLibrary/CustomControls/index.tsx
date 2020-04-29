import React, { FC } from 'react';
import clsx from 'clsx';
import { DatePicker as MuiDatePicker, DatePickerProps } from '@material-ui/pickers';
import {
  TextField as MuiTextField,
  StandardTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputWhite: {
      cursor: 'pointer',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey.A100,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
      },
      '& .MuiSelect-selectMenu, & .MuiInputBase-input': {
        color: 'white',
      },
      '& .MuiSelect-icon': {
        color: 'white',
      },
      '& .MuiFormLabel-root': {
        color: theme.palette.grey.A100,
      },
      '& .MuiInput-underline:before, .MuiFilledInput-underline:before': {
        borderColor: 'rgba(255, 255, 255, .42)',
      },
      '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderColor: 'rgba(255, 255, 255, .87)',
      },
    },
  }
));

interface DPProps extends DatePickerProps {
  white?: boolean,
  className?: string,
};


export const DatePicker: FC<DPProps> = ({white, className, ...rest}) => {
  const classes = useStyles();
  return (
    <MuiDatePicker
      className={clsx(className && className, white && classes.inputWhite)}
      {...rest}
    />
  );
};

interface StandardTextFieldPropsWhite extends StandardTextFieldProps {
  white?: boolean,
  className?: string,
};

interface FilledTextFieldPropsWhite extends FilledTextFieldProps {
  white?: boolean,
  className?: string,
};

interface OutlinedTextFieldPropsWhite extends OutlinedTextFieldProps {
  white?: boolean,
  className?: string,
};

type TextFieldPropsWhite = StandardTextFieldPropsWhite | FilledTextFieldPropsWhite | OutlinedTextFieldPropsWhite;


export const TextField: FC<TextFieldPropsWhite> = ({white, className, ...rest}) => {
  const classes = useStyles();
  return (
    <MuiTextField
      className={clsx(className, white && classes.inputWhite)}
      {...rest}
    />
  );
};
