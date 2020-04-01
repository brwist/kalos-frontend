import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MuiToolbar from '@material-ui/core/Toolbar';
import { WeekPicker } from '../../ComponentsLibrary/WeekPicker';

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
  }),
);

type Props = {
  selectedDate: Date,
  handleDateChange: (value: Date) => void;
};

const Toolbar: FC<Props> = ({ selectedDate, handleDateChange }): JSX.Element => {
  const classes = useStyles();
 return (
   <MuiToolbar className={classes.bar}>
     <MuiPickersUtilsProvider utils={DateFnsUtils}>
       <WeekPicker label="Set Period" value={selectedDate} onChange={handleDateChange} />
     </MuiPickersUtilsProvider>
   </MuiToolbar>
 );
};

export default Toolbar;
