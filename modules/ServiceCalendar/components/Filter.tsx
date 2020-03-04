import React from 'react';
import { format } from 'date-fns';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

type Props = {
  viewBy: string;
  changeViewBy: (value: string) => void;
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

const Filter = ({ viewBy, changeViewBy, week, changeDate, thisYearWeeks }: Props) => {
  const classes = useStyles();
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
      <TextField
        select
        className={classes.select}
        value={week - 1}
        onChange={e => changeDate(e.target.value)}
      >
        {thisYearWeeks.map( (week, index) => (
          <MenuItem value={index}>{format(week, 'MMMM d, yyyy')}</MenuItem>
        )}
      </TextField>
    </Toolbar>
  );
};

export default Filter;
