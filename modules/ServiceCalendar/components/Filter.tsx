import React, { useState } from 'react';
import { DatePickerView } from '@material-ui/pickers/DatePicker/DatePicker';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import { TextField, DatePicker } from '../../ComponentsLibrary/CustomControls';
import { WeekPicker } from '../../ComponentsLibrary/WeekPicker';
import { Button } from '../../ComponentsLibrary/Button';
import FilterDrawer from './FilterDrawer';
import './Filter.module.less';

type Props = {
  defaultView?: string;
  setDefaultView: () => void;
  viewBy: string;
  changeViewBy: (value: string) => void;
  selectedDate: Date | '';
  changeSelectedDate: (date: Date) => void;
};

const Filter = ({
  defaultView,
  setDefaultView,
  viewBy,
  changeViewBy,
  selectedDate,
  changeSelectedDate,
}: Props) => {
  const getCalendarView = (): DatePickerView =>
    viewBy === 'month' ? 'month' : 'date';
  const [showDrawer, toggleDrawer] = useState<boolean>(false);
  return (
    <Toolbar className="ServiceCalendarFilterBar">
      <Box className="ServiceCalendarFilterDateControls">
        <Box className="ServiceCalendarFilterViewByBox">
          <TextField
            white
            className="ServiceCalendarFilterSelect"
            select
            label="View By"
            variant="outlined"
            size="small"
            value={viewBy}
            onChange={e => changeViewBy(e.target.value)}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </TextField>
          <Button
            className="ServiceCalendarFilterSetDefaultViewButton"
            label="Set to default view"
            variant="text"
            color="secondary"
            onClick={setDefaultView}
            disabled={!defaultView || viewBy === defaultView}
          />
        </Box>
        {viewBy === 'week' ? (
          <WeekPicker
            white
            label="Set a Period"
            value={selectedDate}
            inputVariant="outlined"
            size="small"
            onChange={changeSelectedDate}
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
            onChange={changeSelectedDate}
          />
        )}
      </Box>
      <Button label="Filter" onClick={() => toggleDrawer(!showDrawer)} />
      <FilterDrawer open={showDrawer} toggleDrawer={toggleDrawer} />
    </Toolbar>
  );
};

export default Filter;
