import React, { useState } from "react";
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import Box from '@material-ui/core/Box';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import EventIcon from '@material-ui/icons/Event';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import AssessmentIcon from '@material-ui/icons/Assessment';

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

const weekStart = startOfWeek(new Date());

const getShownDates = (date?: Date): string[] => {
  const firstDay = date || weekStart;
  const lastDay = addDays(firstDay, 6);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  return days.map(date => format(date, 'yyyy-MM-dd'));
};

const Timesheet = ({ userId }: Props) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(weekStart);

  const addNewOptions = [
    { icon: <EventIcon />, name: 'Timecard', url: `https://app.kalosflorida.com/index.cfm?action=admin:timesheet.timesheetEdit&tlid=0&user_id=${userId}` },
    { icon: <TimerOffIcon />, name: 'Request Off', url: 'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest' },
    { icon: <AddAlertIcon />, name: 'Reminder', url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder' },
    { icon: <AssignmentIndIcon />, name: 'Task', url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask' },
    { icon: <AssessmentIcon />, name: 'Timesheet Weekly Report', action: () => {console.log('Timesheet Weekly Report')} },
  ];

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };
  const shownDates = getShownDates(selectedDate);
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <Toolbar selectedDate={selectedDate} handleDateChange={handleDateChange} />
      <Box className={classes.wrapper}>
        <Container className={classes.week} maxWidth={false}>
          {shownDates.map(date => (
            <Column
              key={date}
              date={date}
              userId={userId}
            />
          ))}
        </Container>
      </Box>
      <AddNewButton options={addNewOptions} />
    </ThemeProvider>
  );
};

export default Timesheet;
