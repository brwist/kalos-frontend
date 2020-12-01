import React, { useState } from 'react';
import { WeekPicker } from './';
import DateFnsUtils from '@date-io/date-fns';
import { startOfWeek } from 'date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default () => {
  const [value, setValue] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

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
          weekStartsOn={1}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};
