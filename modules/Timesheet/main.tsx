import React, { createContext, useEffect, useState } from "react";
import { format, startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import EventIcon from '@material-ui/icons/Event';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import AssessmentIcon from '@material-ui/icons/Assessment';
import customTheme from '../Theme/main';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import EditTimesheetModal from './components/EditModal';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import { ENDPOINT } from '../../constants';
const userClient = new UserClient(ENDPOINT);

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

type EditTimesheetContext = {
  editTimesheetCard: (card: TimesheetLine.AsObject) => void;
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => void;
};

type EditingState = {
  entry: TimesheetLine.AsObject,
  modalShown: boolean,
  action: 'create' | 'update' | 'convert' | '',
  editedEntries: TimesheetLine.AsObject[],
};

export const EditTimesheetContext = createContext<EditTimesheetContext>({
  editTimesheetCard: (card: TimesheetLine.AsObject) => {},
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => {},
});

const emptyTimesheet = new TimesheetLine().toObject();

const Timesheet = ({ userId }: Props) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date>(weekStart);
  const [editingState, setEditingState] = useState<EditingState>({
    entry: emptyTimesheet,
    modalShown: false,
    action: '',
    editedEntries: [],
  });

  const handleOnSave = (entry: TimesheetLine.AsObject, action: 'delete' | 'approve' | 'reject') => {
    const editedEntries = [...editingState.editedEntries];
    const alreadyEditedIndex = editedEntries.findIndex(item => item.id === entry.id);
    const data = { ...entry, action: action || editingState.action };
    if (alreadyEditedIndex >= 0) {
      editedEntries[alreadyEditedIndex] = data;
    } else {
      editedEntries.push(data);
    }

    setEditingState({
      entry: emptyTimesheet,
      modalShown: false,
      action: '',
      editedEntries,
    })
  };

  const handleAddNewTimeshetCardClicked = () => {
    setEditingState({
      ...editingState,
      entry: new TimesheetLine().toObject(),
      modalShown: true,
      action: 'create',
    });
  };

  const editTimesheetCard = (card: TimesheetLine.AsObject) => {
    setEditingState({
      ...editingState,
      entry: card,
      modalShown: true,
      action: 'update',
    });
  };
  const editServicesRenderedCard = (card: ServicesRendered.AsObject) => {
    const entry = new TimesheetLine().toObject();
    Object.keys(entry).forEach(key => {
      if (card.hasOwnProperty(key)) {
        entry[key] = card[key];
      }
    });
    setEditingState({
      ...editingState,
      modalShown: true,
      entry,
      action: 'convert',
    });
  };

  const handleCloseModal = () => {
    setEditingState({
      ...editingState,
      entry: emptyTimesheet,
      modalShown: false,
      action: '',
    })
  };

  const shownDates = getShownDates(selectedDate);
  const addNewOptions = [
    { icon: <EventIcon />, name: 'Timecard', action: handleAddNewTimeshetCardClicked },
    { icon: <TimerOffIcon />, name: 'Request Off', url: 'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest' },
    { icon: <AddAlertIcon />, name: 'Reminder', url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder' },
    { icon: <AssignmentIndIcon />, name: 'Task', url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask' },
    { icon: <AssessmentIcon />, name: 'Timesheet Weekly Report', action: () => {console.log('Timesheet Weekly Report')} },
  ];

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
  };

  useEffect(() => {
    userClient.GetToken('test', 'test');

  }, []);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <EditTimesheetContext.Provider
        value={{
          editTimesheetCard,
          editServicesRenderedCard,
        }}
      >
        <Toolbar selectedDate={selectedDate} handleDateChange={handleDateChange} />
        <Box className={classes.wrapper}>
          <Container className={classes.week} maxWidth={false}>
            {shownDates.map(date => (
              <Column
                key={date}
                date={date}
                userId={userId}
                editedEntries={editingState.editedEntries}
              />
            ))}
          </Container>
        </Box>
        {editingState.modalShown && (
          <EditTimesheetModal
            entry={editingState.entry}
            userId={userId}
            onClose={handleCloseModal}
            onSave={handleOnSave}
            action={editingState.action}
          />
        )}
        <AddNewButton options={addNewOptions} />
      </EditTimesheetContext.Provider>
    </ThemeProvider>
  );
};

export default Timesheet;
