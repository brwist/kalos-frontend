import React, { createContext, useEffect, useReducer } from "react";
import { startOfWeek, subDays } from 'date-fns';
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
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import { TimesheetLineClient, TimesheetLine, TimesheetReq } from '@kalos-core/kalos-rpc/TimesheetLine';
import customTheme from '../Theme/main';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import { ConfirmServiceProvider } from '../ComponentsLibrary/ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../constants';
import { loadUserById } from '../../helpers';
import { getShownDates, reducer } from './reducer';

const userClient = new UserClient(ENDPOINT);
const tslClient = new TimesheetLineClient(ENDPOINT);

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

type EditTimesheetContext = {
  editTimesheetCard: (card: TimesheetLine.AsObject) => void;
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => void;
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

const getWeekStart = (userId: number, timesheetOwnerId: number) => {
  const today = new Date();
  return userId === timesheetOwnerId ?
    startOfWeek(today) :
    startOfWeek(subDays(today, 7));
};

const Timesheet = ({ userId, timesheetOwnerId }: Props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    user: undefined,
    owner: undefined,
    fetchingTimesheetData: true,
    data: {},
    selectedDate: getWeekStart(userId, timesheetOwnerId),
    shownDates: getShownDates(getWeekStart(userId, timesheetOwnerId)),
    payroll: {
      total: null,
      billable: null,
      unbillable: null,
    },
    editing: {
      entry: new TimesheetLine().toObject(),
      modalShown: false,
      action: '',
      editedEntries: [],
      hiddenSR: [],
    },
  });
  const { user, owner, fetchingTimesheetData, data, payroll, selectedDate, shownDates, editing } = state;
  console.log(data);
  const handleOnSave = (card: TimesheetLine.AsObject, action?: 'delete' | 'approve' | 'reject') => {
    dispatch({ type: 'saveTimecard', data: card, action: editing.action || action });
  };

  const handleAddNewTimeshetCardClicked = () => {
    dispatch({type: 'addNewTimesheet'});
  };

  const editTimesheetCard = (card: TimesheetLine.AsObject) => {
    dispatch({ type: 'editTimesheetCard', data: card });
  };
  const editServicesRenderedCard = (card: ServicesRendered.AsObject) => {
    dispatch({ type: 'editServicesRenderedCard', data: card });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'closeEditingModal' });
  };

  const addNewOptions = [
    { icon: <EventIcon />, name: 'Timecard', action: handleAddNewTimeshetCardClicked },
    { icon: <TimerOffIcon />, name: 'Request Off', url: 'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest' },
    { icon: <AddAlertIcon />, name: 'Reminder', url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder' },
    { icon: <AssignmentIndIcon />, name: 'Task', url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask' },
    { icon: <AssessmentIcon />, name: 'Timesheet Weekly Report', action: () => {console.log('Timesheet Weekly Report')} },
  ];

  const handleDateChange = (value: Date) => {
    dispatch({ type: 'changeDate', value })
  };

  const handleSubmitTimesheet = () => {
    if (user?.timesheetAdministration) {
      tslClient.Approve([], userId);
    } else {
      tslClient.Submit([]);
    }
  };

  const fetchUsers = async () => {
    const userResult = await loadUserById(userId);
    if (userId === timesheetOwnerId) {
      dispatch({ type: 'setUsers', data: { user: userResult, owner: userResult }});
    } else {
      const ownerResult = await loadUserById(timesheetOwnerId);
      dispatch({ type: 'setUsers', data: { user: userResult, owner: ownerResult }});
    }
  };

  useEffect(() => {
    userClient.GetToken('test', 'test');
    fetchUsers();
  }, []);

  useEffect(() => {
    dispatch({ type: 'fetchingTimesheetData' });
    (async () => {
      const sr = new ServicesRendered();
      sr.setIsActive(1);
      sr.setHideFromTimesheet(0);
      sr.setTechnicianUserId(timesheetOwnerId);
      const tl = new TimesheetLine();
      tl.setIsActive(1);
      tl.setTechnicianUserId(timesheetOwnerId);
      const req = new TimesheetReq();
      req.setServicesRendered(sr);
      req.setTimesheetLine(tl);
      const result = await tslClient.GetTimesheet(req, `${shownDates[0]}%`, `${shownDates[shownDates.length - 1]}%`);
      dispatch({type: 'fetchedTimesheetData', data: result });
    })();
  }, [shownDates]);

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
            submitTimesheet={() => {}}
          />
          <Box className={classes.wrapper}>
              {hasAccess ? (
                <Container className={classes.week} maxWidth={false}>
                  {shownDates.map((date: string) => (
                    <Column
                      key={date}
                      date={date}
                      data={data[date]}
                      loading={fetchingTimesheetData}
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
          {editing.modalShown && (
            <EditTimesheetModal
              entry={editing.entry}
              timesheetOwnerId={timesheetOwnerId}
              userId={userId}
              timesheetAdministration={!!user.timesheetAdministration}
              onClose={handleCloseModal}
              onSave={handleOnSave}
              action={editing.action}
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
