import React, {createContext, useCallback, useEffect, useState} from "react";
import { format, startOfWeek, eachDayOfInterval, addDays, roundToNearestMinutes } from 'date-fns';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import EventIcon from '@material-ui/icons/Event';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Alert from '@material-ui/lab/Alert';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { TimesheetLine } from '@kalos-core/kalos-rpc/TimesheetLine';
import customTheme from '../Theme/main';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import { ConfirmServiceProvider } from '../ComponentsLibrary/ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../constants';
import { loadUserById } from '../../helpers';

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
  timesheetOwnerId: number;
};

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

interface EditedEntry extends TimesheetLine.AsObject {
  action: string
};

type EditingState = {
  entry: TimesheetLine.AsObject,
  modalShown: boolean,
  action: 'create' | 'update' | 'convert' | 'delete' | 'approve' | 'reject' | '',
  editedEntries: EditedEntry[],
  hiddenSR: ServicesRendered.AsObject[],
  convertingSR?: ServicesRendered.AsObject,
};

export type Payroll = {
  total: number | null,
  billable: number | null,
  unbillable: number | null,
};

export const EditTimesheetContext = createContext<EditTimesheetContext>({
  editTimesheetCard: (card: TimesheetLine.AsObject) => {},
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => {},
});

const emptyTimesheet = new TimesheetLine().toObject();

const Timesheet = ({ userId, timesheetOwnerId }: Props) => {
  const classes = useStyles();
  const [user, setUser] = useState<User.AsObject>();
  const [owner, setOwner] = useState<User.AsObject>();
  const [selectedDate, setSelectedDate] = useState<Date>(weekStart);
  const [editingState, setEditingState] = useState<EditingState>({
    entry: emptyTimesheet,
    modalShown: false,
    action: '',
    editedEntries: [],
    hiddenSR: [],
  });
  const [payroll, setPayroll] = useState<Payroll | null>(null);

  const handleOnSave = (entry: TimesheetLine.AsObject, action?: 'delete' | 'approve' | 'reject') => {
    const editedEntries = [...editingState.editedEntries];
    const alreadyEditedIndex = editedEntries.findIndex(item => item.id === entry.id);
    const data = { ...entry, action: action || editingState.action };
    if (alreadyEditedIndex >= 0) {
      editedEntries[alreadyEditedIndex] = data;
    } else {
      editedEntries.push(data);
    }

    const hiddenSR = [...editingState.hiddenSR];
    if (editingState.convertingSR) {
      hiddenSR.push(editingState.convertingSR);
    }

    setEditingState({
      entry: emptyTimesheet,
      modalShown: false,
      action: '',
      editedEntries,
      hiddenSR,
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
        // @ts-ignore
        entry[key] = card[key];
      }
    });
    entry.servicesRenderedId = card.id;
    if (card.status === 'Enroute') {
      entry.classCodeId = 37;
    }

    setEditingState({
      ...editingState,
      modalShown: true,
      entry,
      action: 'convert',
      convertingSR: card,
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

  const onPayrollCalculated = useCallback((() => {
    let counter = 0;
    let acc = {
      total: 0,
      billable: 0,
      unbillable: 0,
    };
    return (chunk: Payroll) => {
      acc = {
        total: acc.total + (chunk?.total || 0),
        billable: acc.billable + (chunk?.billable || 0),
        unbillable: acc.unbillable + (chunk?.unbillable || 0),
      };
      counter += 1;
      if (counter === 7) {
        counter = 0;
        setPayroll({...acc});
        acc = {
          total: 0,
          billable: 0,
          unbillable: 0,
        }
      }
    };
  })(), []);

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
    setPayroll(null);
  };

  const fetchUsers = async () => {
    const userResult = await loadUserById(userId);
    if (userId === timesheetOwnerId) {
      setUser(userResult);
      setOwner(userResult)
    } else {
      const ownerResult = await loadUserById(timesheetOwnerId);
      setUser(userResult);
      setOwner(ownerResult)
    }
  };

  useEffect(() => {
    userClient.GetToken('test', 'test');
    fetchUsers();
  }, []);

  if (!user) {
    return null;
  }
  const hasAccess = userId === timesheetOwnerId || user.timesheetAdministration;

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <ConfirmServiceProvider>
        <EditTimesheetContext.Provider
          value={{
            editTimesheetCard,
            editServicesRenderedCard,
          }}
        >
          <Toolbar
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            userName={`${owner?.firstname} ${owner?.lastname}`}
            timesheetAdministration={!!user.timesheetAdministration}
            payroll={payroll}
          />
          <Box className={classes.wrapper}>
              {hasAccess ? (
                <Container className={classes.week} maxWidth={false}>
                  {shownDates.map(date => (
                    <Column
                      key={date}
                      date={date}
                      userId={userId}
                      timesheetOwnerId={timesheetOwnerId}
                      editedEntries={editingState.editedEntries}
                      hiddenSR={editingState.hiddenSR}
                      onPayrollCalculated={onPayrollCalculated}
                    />
                  ))}
                </Container>
              ) : (
                <Alert severity="error">
                  You have no access to this timesheet.
                </Alert>
              )
            }
          </Box>
          {editingState.modalShown && (
            <EditTimesheetModal
              entry={editingState.entry}
              timesheetOwnerId={timesheetOwnerId}
              userId={userId}
              timesheetAdministration={!!user.timesheetAdministration}
              onClose={handleCloseModal}
              onSave={handleOnSave}
              action={editingState.action}
            />
          )}
          {hasAccess && (
            <AddNewButton options={addNewOptions} />
          )}
        </EditTimesheetContext.Provider>
      </ConfirmServiceProvider>
    </ThemeProvider>
  );
};

export default Timesheet;
