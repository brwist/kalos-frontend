import React from 'react';
import clsx from 'clsx';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { TextFieldProps } from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isSameDay from 'date-fns/isSameDay';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import isWithinInterval from 'date-fns/isWithinInterval';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayWrapper: {
      position: 'relative',
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: '0 2px',
      color: 'inherit',
    },
    customDayHighlight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '2px',
      right: '2px',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: '#676767',
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    firstHighlight: {
      extend: 'highlight',
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    endHighlight: {
      extend: 'highlight',
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    },
  }),
);

type Props = {
  label: string;
  value: Date | '';
  onChange: (value: Date) => void;
  inputVariant?: TextFieldProps['variant'];
  size?: 'small' | 'medium';
  className?: any;
}

const WeekPicker = ({ label, value, onChange, inputVariant, size, className }: Props) => {
  const classes = useStyles();
  const handleWeekChange = (date: MaterialUiPickersDate) => {
    onChange(startOfWeek(date || value || new Date().valueOf()));
  };

  const formatWeekSelectLabel = (date: MaterialUiPickersDate, invalidLabel: string) => {
    let dateClone = new Date(date || value);

    return dateClone && isValid(dateClone)
      ? `Week of ${format(startOfWeek(dateClone), 'MMM do')}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (date: MaterialUiPickersDate, selectedDate: MaterialUiPickersDate, dayInCurrentMonth: boolean) => {
    let dateClone = new Date(date || value);
    let selectedDateClone = new Date(selectedDate || value);

    const start = startOfWeek(selectedDateClone);
    const end = endOfWeek(selectedDateClone);

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    );
  };

  return (
    <DatePicker
      className={className}
      label={label}
      inputVariant={inputVariant}
      size={size}
      value={value}
      onChange={handleWeekChange}
      renderDay={renderWrappedWeekDay}
      labelFunc={formatWeekSelectLabel}
    />
  );
};

export default WeekPicker;
