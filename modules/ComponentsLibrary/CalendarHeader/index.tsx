import React, { FC, ReactNode } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MuiToolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button } from '../Button';
import { WeekPicker } from '../WeekPicker';
import { Actions, ActionsProps } from '../Actions';
import './CalendarHeader.module.less';

interface Props {
  selectedDate: Date;
  title: string;
  onDateChange: (value: Date) => void;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  actions?: ActionsProps;
  asideTitle?: ReactNode;
}

export const CalendarHeader: FC<Props> = ({
  selectedDate,
  title,
  asideTitle,
  onDateChange,
  onSubmit,
  submitLabel = 'Submit',
  submitDisabled = false,
  weekStartsOn = 0,
  actions,
  children,
}) => (
  <MuiToolbar className="CalendarHeader">
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <>
        <WeekPicker
          white
          label="Set a Period"
          inputVariant="outlined"
          size="small"
          value={selectedDate}
          onChange={onDateChange}
          weekStartsOn={weekStartsOn}
        />
        {asideTitle}
        <Typography className="CalendarHeaderTitle" variant="subtitle1">
          {title}
        </Typography>
        <Box className="CalendarHeaderInfo">
          <Box className="CalendarHeaderChildren">{children}</Box>
          {onSubmit && (
            <Button
              onClick={onSubmit}
              label={submitLabel}
              disabled={submitDisabled}
            />
          )}
          {actions && <Actions actions={actions} fixed />}
        </Box>
      </>
    </MuiPickersUtilsProvider>
  </MuiToolbar>
);
