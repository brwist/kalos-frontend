/* 
    The selector for times for the Macro Gantt Chart. Should mimic the excellent time selector in Timesheet
*/

import React, { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import MuiToolbar from '@material-ui/core/Toolbar';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { WeekPicker } from '../../WeekPicker';

type Props = {
  selectedDate: Date;
  handleDateChange: (value: Date) => void;
};

const TimeSelector: FC<Props> = ({
  selectedDate,
  handleDateChange,
}): JSX.Element => {
  return (
    <MuiToolbar className="TimesheetToolbarBar">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <WeekPicker
          white
          label="Set a Period"
          inputVariant="outlined"
          size="small"
          value={selectedDate}
          onChange={handleDateChange}
          weekStartsOn={6}
        />
      </MuiPickersUtilsProvider>
    </MuiToolbar>
  );
};

export default TimeSelector;
