import React, {MutableRefObject, useState} from 'react';
import { DatePicker } from '@material-ui/pickers';
import { DatePickerView } from '@material-ui/pickers/DatePicker/DatePicker';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import WeekPicker from '../../WeekPicker/main';
import { Button } from '../../ComponentsLibrary/Button';
import FilterDrawer from './FilterDrawer';

type CustomerMap = {
  [id: number]: string;
};

type Props = {
  viewBy: string;
  changeViewBy: (value: string) => void;
  selectedDate: Date;
  changeSelectedDate: (date: Date) => void;
  changeFilters: (value: Filters) => void;
  filterOptions: MutableRefObject<CustomerMap>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    select: {
      minWidth: 100,
    },
  }),
);

const Filter = ({ viewBy, changeViewBy, selectedDate, changeSelectedDate, filterOptions, filters, changeFilters }: Props) => {
  const classes = useStyles();
  const getCalendarView = (): DatePickerView => {
    switch (viewBy) {
    case 'month':
      return 'month';
    case 'year':
      return 'year';
    default:
      return 'date';
    }
  };

  const [showDrawer, toggleDrawer] = useState<boolean>(false);

  return (
    <Toolbar className={classes.bar}>
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
        <MenuItem value="year">Year</MenuItem>
      </TextField>
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
      <Button label="Filter" onClick={() => toggleDrawer(!showDrawer)} />
      <FilterDrawer open={showDrawer} toggleDrawer={toggleDrawer} filters={filters} filterOptions={filterOptions} changeFilters={changeFilters} />
    </Toolbar>
  );
};

export default Filter;
