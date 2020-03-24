import React, { useState } from 'react';
import clsx from 'clsx';
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
      [theme.breakpoints.only('xs')]: {
        padding: theme.spacing(2),
      },
    },
    dateControls: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.only('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    viewByBox: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.only('xs')]: {
        marginBottom: theme.spacing(2),
      },
    },
    setDefaultViewButton: {
      margin: theme.spacing(1),
      lineHeight: 1.2,
      color: 'white',
      fontWeight: 100,
    },
    select: {
      minWidth: 100,
    },
    inputWhite: {
      cursor: 'pointer',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey.A100,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
      },
      '& .MuiSelect-selectMenu, & .MuiOutlinedInput-input': {
        color: 'white',
      },
      '& .MuiSelect-icon': {
        color: 'white',
      },
      '& .MuiInputLabel-outlined': {
        color: theme.palette.grey.A100,
      },
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
        <Box className={classes.viewByBox}>
          <TextField
            select
            className={clsx(classes.select, classes.inputWhite)}
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
            className={classes.setDefaultViewButton}
            label="Set to default view"
            variant="text"
            color="secondary"
            onClick={setDefaultView}
            disabled={!defaultView || viewBy === defaultView}
          />
        </Box>
        {viewBy === 'week' ? (
          <WeekPicker
            className={classes.inputWhite}
            label="Set a Period"
            value={selectedDate}
            inputVariant="outlined"
            size="small"
            onChange={changeSelectedDate}
          />
        ) : (
          <DatePicker
            className={classes.inputWhite}
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
      <FilterDrawer
        open={showDrawer}
        toggleDrawer={toggleDrawer}
      />
    </Toolbar>
  );
};

export default Filter;
