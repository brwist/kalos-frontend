import React, { useState } from 'react';
import { WeekPicker } from './';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default () => {
  const [value, setValue] = useState(new Date());

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <WeekPicker
        label="Set a Period"
        value={value}
        inputVariant="outlined"
        size="small"
        onChange={val => setValue(val)}
      />
    </MuiPickersUtilsProvider>
  );
}
