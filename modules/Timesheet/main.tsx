import React, {
  FC,
  createContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { startOfWeek, subDays } from 'date-fns';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
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
import {
  TimesheetLineClient,
  TimesheetLine,
  TimesheetReq,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';
import customTheme from '../Theme/main';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import { ConfirmServiceProvider } from '../ComponentsLibrary/ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../constants';
import { loadUserById } from '../../helpers';
import { getShownDates, reducer } from './reducer';
import ReceiptsIssueDialog from './components/ReceiptsIssueDialog';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import './styles.less';

const userClient = new UserClient(ENDPOINT);
const tslClient = new TimesheetLineClient(ENDPOINT);
const txnClient = new TransactionClient(ENDPOINT);

type Props = PageWrapperProps & {
  userId: number;
  timesheetOwnerId: number;
};

type EditTimesheetContext = {
  editTimesheetCard: (card: TimesheetLine.AsObject) => void;
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => void;
};

export const EditTimesheetContext = createContext<EditTimesheetContext>({
  editTimesheetCard: (card: TimesheetLine.AsObject) => {},
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => {},
});

const getWeekStart = (userId: number, timesheetOwnerId: number) => {
  const today = new Date();
  return userId === timesheetOwnerId
    ? startOfWeek(today)
    : startOfWeek(subDays(today, 7));
};

const Timesheet: FC<Props> = (props: Props) => {
  const { userId, timesheetOwnerId } = props;
  const [state, dispatch] = useReducer(reducer, {
    user: undefined,
    owner: undefined,
    fetchingTimesheetData: true,
    data: {},
    pendingEntries: false,
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
    error: '',
    receiptsIssue: {
      shown: false,
      hasReceiptsIssue: false,
      receiptsIssueStr: '',
    },
  });
  const {
    user,
    owner,
    fetchingTimesheetData,
    data,
    pendingEntries,
    payroll,
    selectedDate,
    shownDates,
    editing,
    error,
    receiptsIssue,
  } = state;
  const handleOnSave = (
    card: TimesheetLine.AsObject,
    action?: 'delete' | 'approve' | 'reject',
  ) => {
    dispatch({
      type: 'saveTimecard',
      data: card,
      action: action || editing.action,
    });
  };

  const handleAddNewTimeshetCardClicked = () => {
    if (!checkReceiptIssue()) return;
    dispatch({ type: 'addNewTimesheet' });
  };

  const editTimesheetCard = (card: TimesheetLine.AsObject) => {
    if (!checkReceiptIssue()) return;
    dispatch({ type: 'editTimesheetCard', data: card });
  };
  const editServicesRenderedCard = (card: ServicesRendered.AsObject) => {
    if (!checkReceiptIssue()) return;
    dispatch({ type: 'editServicesRenderedCard', data: card });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'closeEditingModal' });
  };

  const addNewOptions = [
    {
      icon: <EventIcon />,
      name: 'Timecard',
      action: handleAddNewTimeshetCardClicked,
    },
    {
      icon: <TimerOffIcon />,
      name: 'Request Off',
      url:
        'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest',
    },
    {
      icon: <AddAlertIcon />,
      name: 'Reminder',
      url:
        'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder',
    },
    {
      icon: <AssignmentIndIcon />,
      name: 'Task',
      url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask',
    },
    {
      icon: <AssessmentIcon />,
      name: 'Timesheet Weekly Report',
      action: () => {
        console.log('Timesheet Weekly Report');
      },
    },
  ];

  const handleDateChange = (value: Date) => {
    dispatch({ type: 'changeDate', value });
  };

  const checkTimeout = (): boolean => {
    const lastTimeout = localStorage.getItem('TIMESHEET_TIMEOUT');
    if (lastTimeout) {
      const lastVal = parseInt(lastTimeout);
      const currVal = new Date().valueOf();
      return currVal - lastVal <= 86400;
    }
    return false;
  };

  const handleTimeout = (): void => {
    localStorage.setItem('TIMESHEET_TIMEOUT', `${new Date().valueOf()}`);
    dispatch({ type: 'showReceiptsIssueDialog', value: false });
  };

  const checkReceiptIssue = (): boolean => {
    if (!receiptsIssue.hasReceiptsIssue && !checkTimeout()) {
      dispatch({ type: 'showReceiptsIssueDialog', value: true });
      return false;
    }
    return true;
  };

  const handleSubmitTimesheet = useCallback(() => {
    (async () => {
      if (!checkReceiptIssue()) return;
      const ids = [];
      let overlapped = false;
      for (let i = 0; i < shownDates.length; i++) {
        let dayList = [...data[shownDates[i]].timesheetLineList].sort(
          (a, b) =>
            new Date(a.timeStarted).getTime() -
            new Date(b.timeStarted).getTime(),
        );
        let result = dayList.reduce(
          (acc, current, idx, arr) => {
            if (idx === 0) {
              acc.idList.push(current.id);
              return acc;
            }
            let previous = arr[idx - 1];
            let previousEnd = new Date(previous.timeFinished).getTime();
            let currentStart = new Date(current.timeStarted).getTime();
            let overlap = previousEnd > currentStart;
            if (overlap) {
              overlapped = true;
            } else {
              acc.ranges.push({
                previous: previous,
                current: current,
              });
              if (!current.adminApprovalUserId) {
                acc.idList.push(current.id);
              }
            }
            return acc;
          },
          { ranges: [], idList: [] },
        );

        if (overlapped) {
          break;
        } else {
          ids.push(...result.idList);
        }
      }
      if (overlapped) {
        dispatch({ type: 'error', text: 'Timesheet lines are overlapping' });
      } else {
        if (user?.timesheetAdministration) {
          await tslClient.Approve(ids, userId);
          dispatch({ type: 'approveTimesheet' });
        } else {
          await tslClient.Submit(ids);
          dispatch({ type: 'submitTimesheet' });
        }
      }
    })();
  }, [userId, data, shownDates, tslClient]);

  const fetchUsers = async () => {
    const userResult = await loadUserById(userId);
    const [hasIssue, issueStr] = await txnClient.timesheetCheck(userId);
    if (userId === timesheetOwnerId) {
      dispatch({
        type: 'setUsers',
        data: {
          user: userResult,
          owner: userResult,
          hasReceiptsIssue: hasIssue,
          receiptsIssueStr: issueStr,
        },
      });
    } else {
      const ownerResult = await loadUserById(timesheetOwnerId);
      dispatch({
        type: 'setUsers',
        data: {
          user: userResult,
          owner: ownerResult,
          hasReceiptsIssue: hasIssue,
          receiptsIssueStr: issueStr,
        },
      });
    }
  };

  useEffect(() => {
    (async () => {
      await userClient.GetToken('test', 'test');
      await txnClient.GetToken('test', 'test');
      fetchUsers();
    })();
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
      const result = await tslClient.GetTimesheet(
        req,
        `${shownDates[0]}%`,
        `${shownDates[shownDates.length - 1]}%`,
      );
      dispatch({ type: 'fetchedTimesheetData', data: result });
    })();
  }, [shownDates]);

  if (!user) {
    return null;
  }
  const hasAccess = userId === timesheetOwnerId || user.timesheetAdministration;

  return (
    <PageWrapper {...props} userID={userId}>
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
            submitTimesheet={handleSubmitTimesheet}
            pendingEntries={pendingEntries}
          />
          {error && (
            <Alert
              severity="error"
              onClose={() => dispatch({ type: 'error', text: '' })}
            >
              {error}
            </Alert>
          )}
          <Box className="Timesheet">
            {hasAccess ? (
              <Container className="TimesheetWeek" maxWidth={false}>
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
            )}
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
          {hasAccess && <AddNewButton options={addNewOptions} />}
        </EditTimesheetContext.Provider>
      </ConfirmServiceProvider>
      {receiptsIssue.shown && (
        <ReceiptsIssueDialog
          isAdmin={user.timesheetAdministration}
          receiptsIssueStr={receiptsIssue.receiptsIssueStr}
          handleTimeout={handleTimeout}
        />
      )}
    </PageWrapper>
  );
};

export default Timesheet;
