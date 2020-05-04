import React, { FC } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiToolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { WeekPicker } from '../../ComponentsLibrary/WeekPicker';
import { Button } from '../../ComponentsLibrary/Button';
import { Payroll } from '../main';
import { roundNumber } from '../../../helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bar: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
      [theme.breakpoints.down(400)]: {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
    userName: {
      margin: `0 ${theme.spacing(2)}px`,
      textAlign: 'center',
      [theme.breakpoints.down(400)]: {
        margin: theme.spacing(2),
      },
    },
    info: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      '& p': {
        color: 'white',
      },
      [theme.breakpoints.down(400)]: {
        flexDirection: 'column',
      },
    },
    payroll: {
      marginRight: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      [theme.breakpoints.down(400)]: {
        marginRight: 0,
        alignItems: 'center',
      },
    },
    details: {
      '& span:first-child': {
        marginRight: theme.spacing(2),
      },
    },
  }),
);

type Props = {
  selectedDate: Date;
  handleDateChange: (value: Date) => void;
  userName: string;
  timesheetAdministration: boolean;
  payroll: Payroll | null;
};

const Toolbar: FC<Props> = ({
  selectedDate,
  handleDateChange,
  userName,
  timesheetAdministration,
  payroll,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <MuiToolbar className={classes.bar}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <WeekPicker
          white
          label="Set a Period"
          inputVariant="outlined"
          size="small"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <Typography className={classes.userName} variant="subtitle1">
          {userName}
        </Typography>
        <Box className={classes.info}>
          <Box className={classes.payroll}>
            {payroll !== null ? (
              <>
                <Typography variant="subtitle2">Total: <strong>{roundNumber(payroll.total || 0)}</strong></Typography>
                <Typography className={classes.details}>
                  <span>Bill: <strong>{roundNumber(payroll.billable || 0)}</strong></span>
                  <span>Unbill: <strong>{roundNumber(payroll.unbillable || 0)}</strong></span>
                </Typography>
              </>
            ) : (
              <>
                <Skeleton variant="text" width={75} height={16} />
                <Skeleton variant="text" width={150} height={16} />
              </>
            )}

          </Box>
          <Button label={timesheetAdministration ? 'Approve Timesheet' : 'Submit Timesheet'} />
        </Box>
      </MuiPickersUtilsProvider>
    </MuiToolbar>
  );
};

export default Toolbar;
