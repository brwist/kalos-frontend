import React, { useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import { DatePickerView } from '@material-ui/pickers/DatePicker/DatePicker';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import WeekPicker from '../../WeekPicker/main';
import { Button } from '../../ComponentsLibrary/Button';
import FilterDrawer from './FilterDrawer';

type Props = {
  defaultView: string,
  setDefaultView: () => void;
  viewBy: string;
  changeViewBy: (value: string) => void;
  selectedDate: Date;
  changeSelectedDate: (date: Date) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      justifyContent: 'space-between',
    },
    dateControls: {
      display: 'flex',
      alignItems: 'baseline',
    },
    select: {
      minWidth: 100,
    },
  }),
);

const Filter = ({
  defaultView,
  setDefaultView,
  viewBy,
  changeViewBy,
  selectedDate,
  changeSelectedDate,
}: Props) => {
  const classes = useStyles();
  const getCalendarView = (): DatePickerView => viewBy === 'month' ? 'month' : 'date';
  const [showDrawer, toggleDrawer] = useState<boolean>(false);

  return (
    <Toolbar className={classes.bar}>
      <Box className={classes.dateControls}>
        <TextField
          select
          className={classes.select}
          label="View By"
          value={viewBy}
          onChange={e => changeViewBy(e.target.value)}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </TextField>
        <Button
          label="Set to default view"
          variant="text"
          color="secondary"
          onClick={setDefaultView}
          disabled={!defaultView || viewBy === defaultView}
        />
        {viewBy === 'week' ? (
          <WeekPicker
            label="Set a Period"
            value={selectedDate}
            onChange={changeSelectedDate}
          />
        ) : (
          <DatePicker
            views={[getCalendarView()]}
            label="Set a Period"
            value={selectedDate}
            // @ts-ignore
            onChange={changeSelectedDate}
          />
        )}
      </Box>
      <Button label="Filter" onClick={() => toggleDrawer(!showDrawer)} />
      <FilterDrawer
        open={showDrawer}
        toggleDrawer={toggleDrawer}
      />
    </Toolbar>
  );
};

export default Filter;
