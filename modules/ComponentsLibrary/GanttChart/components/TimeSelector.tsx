/* 
    The selector for times for the Macro Gantt Chart. Should mimic the excellent time selector in Timesheet
*/

import React, { FC, useCallback, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import MuiToolbar from '@material-ui/core/Toolbar';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import { WeekPicker } from '../../WeekPicker';
import { DatePicker, TextField } from '../../CustomControls';
import { MenuItem } from '@material-ui/core';

type Props = {
  selectedDate: Date;
  handleDateChange: (value: Date) => void;
};

const TimeSelector: FC<Props> = ({
  selectedDate,
  handleDateChange,
}): JSX.Element => {
  const [viewBy, setViewBy] = useState<string>('week');
  const handleSetViewBy = useCallback(
    (viewByNew: string) => {
      console.log(viewByNew);
      setViewBy(viewByNew);
    },
    [setViewBy],
  );

  const getCalendarView = () => (viewBy === 'month' ? 'month' : 'date');

  return (
    <MuiToolbar className="TimesheetToolbarBar">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <TextField
          white
          className="ServiceCalendarFilterSelect"
          select
          label="View By"
          variant="outlined"
          size="small"
          value={viewBy}
          onChange={e => handleSetViewBy(e.target.value)}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </TextField>
        {viewBy === 'week' ? (
          <WeekPicker
            white
            label="Set a Period"
            value={selectedDate}
            inputVariant="outlined"
            size="small"
            onChange={handleDateChange}
            weekStartsOn={1}
          />
        ) : (
          <DatePicker
            white
            views={[getCalendarView()]}
            label="Set a Period"
            inputVariant="outlined"
            size="small"
            value={selectedDate}
            // @ts-ignore
            onChange={handleDateChange}
          />
        )}
      </MuiPickersUtilsProvider>
    </MuiToolbar>
  );
};

export default TimeSelector;
