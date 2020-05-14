import React, { createContext, useCallback, useEffect, useState, useReducer } from "react";
import {format, startOfWeek, eachDayOfInterval, addDays, subDays, differenceInMinutes} from 'date-fns';
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
import { TimesheetLineClient, TimesheetLine, TimesheetReq } from '@kalos-core/kalos-rpc/TimesheetLine';
import customTheme from '../Theme/main';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import { ConfirmServiceProvider } from '../ComponentsLibrary/ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../constants';
import { loadUserById } from '../../helpers';
import * as jspb from 'google-protobuf';

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

const getShownDates = (date: Date): string[] => {
  const firstDay = date;
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
type DayData = {
  servicesRenderedList: ServicesRendered.AsObject[],
  timesheetLineList: TimesheetLine.AsObject[],
};

type DataList = {
  [key: string]: DayData,
}

type State = {
  user?: User.AsObject;
  owner?: User.AsObject;
  fetchingTimesheetData: boolean;
  data: DataList;
  selectedDate: Date;
  shownDates: string[];
  payroll: {
    total: number | null,
    billable: number | null,
    unbillable: number | null,
  };
  editing: EditingState;
}

type TimesheetData = {
  getDatesMap(): jspb.Map<string, TimesheetReq>;
};

type Action =
  | { type: 'setUsers', data: {user: User.AsObject, owner: User.AsObject} }
  | { type: 'fetchingTimesheetData' }
  | { type: 'fetchedTimesheetData', data: TimesheetData }
  | { type: 'changeDate', value: Date }
  | { type: 'addNewTimesheet' }
  | { type: 'editTimesheetCard', data: TimesheetLine.AsObject }
  | { type: 'editServicesRenderedCard', data: ServicesRendered.AsObject }
  | { type: 'saveTimecard', data: TimesheetLine.AsObject, action: string }
  | { type: 'closeEditingModal' };


const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setUsers': {
      return {
        ...state,
        user: action.data.user,
        owner: action.data.owner
      };
    }
    case 'fetchingTimesheetData': {
      return {
        ...state,
        fetchingTimesheetData: true,
      };
    }
    case 'fetchedTimesheetData': {
      const datesMap = action.data.getDatesMap();
      const { data, totalPayroll } = state.shownDates.reduce(({ data, totalPayroll }, date) => {
        const dayData = datesMap.get(date);
        const srList = dayData?.getServicesRenderedList().map(i => i.toObject()) || [];
        const servicesRenderedList = srList.filter((item: ServicesRendered) => !item.hideFromTimesheet && item.status !== 'Completed' && item.status !== 'Incomplete')
        const timesheetLineList = dayData?.getTimesheetLineList().map(i => i.toObject()) || [];

        const payroll = timesheetLineList.reduce((acc, item) => {
          const payrollDiff = differenceInMinutes(new Date(item.timeFinished), new Date(item.timeStarted)) / 60;
          return {
            ...acc,
            billable: item.classCode?.billable ? acc.billable + payrollDiff : acc.billable,
            unbillable: item.classCode?.billable ? acc.unbillable : acc.unbillable + payrollDiff,
            total: acc.total + payrollDiff,
          }
        }, {billable: 0, unbillable: 0, total: 0});

        data[date] = {
          servicesRenderedList,
          timesheetLineList,
          payroll: payroll || {},
        };
        totalPayroll = {
          billable: totalPayroll.billable + payroll.billable,
          unbillable: totalPayroll.unbillable + payroll.unbillable,
          total: totalPayroll.total + payroll.total,
        };
        return {data, totalPayroll};
      }, {
        data: [],
        totalPayroll: {
          billable: 0,
          unbillable: 0,
          total: 0
        },
      });

      return {
        ...state,
        data,
        payroll: totalPayroll,
        fetchingTimesheetData: false,
      };
    }
    case 'changeDate':
      return {
        ...state,
        selectedDate: action.value,
        shownDates: getShownDates(action.value),
      };
    case 'addNewTimesheet':
      return {
        ...state,
        editing: {
          entry: new TimesheetLine().toObject(),
          modalShown: true,
          action: 'create',
        },
      };
    case 'editTimesheetCard':
      return {
        ...state,
        editing: {
          entry: action.data,
          modalShown: true,
          action: 'update',
        }
      };
    case 'editServicesRenderedCard': {
      const card = action.data;
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

      return {
        ...state,
        editing: {
          modalShown: true,
          entry,
          action: 'convert',
          convertingSR: card,
        },
      };
    }
    case 'saveTimecard': {
      const data = {...state.data};
      const entry = state.editing.entry;
      const card = action.data;
      const entryDate = format(new Date(entry.timeStarted), 'yyyy-MM-dd');
      const cardDate = format(new Date(card.timeStarted), 'yyyy-MM-dd');
      const datePresented = state.shownDates.indexOf(cardDate) >= 0;
      console.log('data: ', data);
      console.log('entry: ', entry);
      console.log('card: ', card);
      console.log('entryDate: ', entryDate);
      console.log('cardDate', cardDate);
      console.log('datePresented', datePresented);
      console.log('action: ', action.action);
      if (action.action === 'create' && datePresented) {
        data[cardDate].timesheetLineList.push(card);
      } else if (action.action === 'convert') {
        const sr = data[entryDate].servicesRenderedList.find(item => item.id === entry.servicesRenderedId);
        sr.hideFromTimesheet! = 1;
        if (datePresented) {
          data[cardDate].timesheetLineList.push(card);
        }
      } else if (action.action === 'update') {
        if (entryDate === cardDate) {
          const list = data[entryDate].timesheetLineList;
          const existingIndex = list.findIndex(item => item.id === card.id);
          if (existingIndex >= 0) {
            list[existingIndex] = {...list[existingIndex], ...card};
          }
        } else {
          const oldList = data[entryDate].timesheetLineList;
          const oldIndex = oldList.findIndex(item => item.id === card.id);
          if (oldIndex >= 0) {
            oldList.splice(oldIndex, 1);
          }
          if (datePresented) {
            data[cardDate].timesheetLineList.push(card);
          }
        }
      } else if (action.action === 'delete') {
        const list = data[entryDate].timesheetLineList;
        const existingIndex = list.findIndex(item => item.id === card.id);
        if (existingIndex >= 0) {
          list.splice(existingIndex, 1);
        }
      }
      return {
        ...state,
        data,
        editing: {
          entry: emptyTimesheet,
          modalShown: false,
          action: '',
        },
      };
    }
    case 'closeEditingModal':
      return {
        ...state,
        editing: {
          entry: emptyTimesheet,
          modalShown: false,
          action: '',
        },
      };
    default:
      return state;
  }
};

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
      entry: emptyTimesheet,
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
