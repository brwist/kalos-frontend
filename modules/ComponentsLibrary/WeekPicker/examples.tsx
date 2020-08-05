import React, { useState } from 'react';
import { WeekPicker } from './';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default () => {
  const [value, setValue] = useState(new Date());

  return (
    <div
      style={{
        backgroundColor: '#333',
        padding: 16,
      }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <WeekPicker
          label="Set a Period"
          value={value}
          inputVariant="outlined"
          size="small"
          onChange={val => setValue(val)}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};
