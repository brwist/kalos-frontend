import React, { useState } from "react";
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {
  ServicesRenderedClient,
  ServicesRendered,
} from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLineClient,
  TimesheetLine
} from '@kalos-core/kalos-rpc/TimesheetLine';
import customTheme from '../Theme/main';
import { ENDPOINT } from '../../constants';
import { useFetchAll } from './hooks';

const srClient = new ServicesRenderedClient(ENDPOINT);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      overflow: 'auto',
    },
    week: {
      minWidth: 1500,
      display: 'grid',
      gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
      gridGap: theme.spacing(2),
    },
  }),
);

type Props = {
  userId: number;
}

type State = {

}


const today = new Date();

const getShownDates = (date?: Date): string[] => {
  const firstDay = date || startOfWeek(today);
  const lastDay = addDays(firstDay, 6);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  return days.map(date => format(date, 'yyyy-MM-dd'));
}

const Timesheet = ({ userId }: Props) => {
  const classes = useStyles();
  const [state, setState] = useState();

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <Container className={classes.week} maxWidth={false}>
        {/*k
        {shownDates.map(date => (
          <Column
            key={date}
            date={date}
            viewBy={viewBy}
            userId={userId}
            isAdmin={user.isAdmin}
          />
        ))}
        */}
      </Container>
    </ThemeProvider>
  );
};

export default Timesheet;
