import React, { FC } from 'react';
import clsx from 'clsx';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { TextFieldProps } from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isSameDay from 'date-fns/isSameDay';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import isWithinInterval from 'date-fns/isWithinInterval';
import { DatePicker } from '../CustomControls';
import "./WeekPicker.module.less";

type Props = {
  label: string;
  value: Date | '';
  onChange: (value: Date) => void;
  inputVariant?: TextFieldProps['variant'];
  size?: 'small' | 'medium';
  white?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export const WeekPicker: FC<Props> = ({
  label,
  value,
  onChange,
  inputVariant,
  size,
  white,
  weekStartsOn = 0,
}) => {
  const options = { weekStartsOn };
  const handleWeekChange = (date: MaterialUiPickersDate) => {
    onChange(startOfWeek(date || value || new Date().valueOf(), options));
  };

  const formatWeekSelectLabel = (
    date: MaterialUiPickersDate,
    invalidLabel: string,
  ) => {
    let dateClone = new Date(date || value);

    return dateClone && isValid(dateClone)
      ? `Week of ${format(startOfWeek(dateClone, options), 'MMM do')}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (
    date: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean,
  ) => {
    let dateClone = new Date(date || value);
    let selectedDateClone = new Date(selectedDate || value);

    const start = startOfWeek(selectedDateClone, options);
    const end = endOfWeek(selectedDateClone, options);

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      ['WeekPickerHighlight']: dayIsBetween,
      ['WeekPickerFirstHighlight']: isFirstDay,
      ['WeekPickerEndHighlight']: isLastDay,
    });

    const dayClassName = clsx('WeekPickerDay', {
      ['WeekPickerNonCurrentMonthDay']: !dayInCurrentMonth,
      ['WeekPickerHighlightNonCurrentMonthDay']:
        !dayInCurrentMonth && dayIsBetween,
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
      white={true}
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
