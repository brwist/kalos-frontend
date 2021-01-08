import React, {
  FC,
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useState,
} from 'react';
import { startOfWeek, subDays, parseISO, addDays, format } from 'date-fns';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import EventIcon from '@material-ui/icons/Event';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import Alert from '@material-ui/lab/Alert';
import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ServicesRendered } from '@kalos-core/kalos-rpc/ServicesRendered';
import {
  TimesheetLineClient,
  TimesheetLine,
  TimesheetReq,
} from '@kalos-core/kalos-rpc/TimesheetLine';
import { TransactionClient } from '@kalos-core/kalos-rpc/Transaction';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import { ConfirmServiceProvider } from '../ComponentsLibrary/ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import { TripInfoTable } from '../ComponentsLibrary/TripInfoTable';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../constants';
import {
  getTimeoffRequestByFilter,
  TimeoffRequestClientService,
  TimeoffRequestTypes,
  UserClientService,
  getPerDiemRowIds,
} from '../../helpers';
import { getShownDates, reducer } from './reducer';
import ReceiptsIssueDialog from './components/ReceiptsIssueDialog';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { Modal } from '../ComponentsLibrary/Modal';
import { TimeOff } from '../ComponentsLibrary/TimeOff';

import './styles.less';

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
    ? startOfWeek(today, { weekStartsOn: 6 })
    : startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
};

export const Timesheet: FC<Props> = props => {
  const { userId, timesheetOwnerId } = props;
  const [timeoffOpen, setTimeoffOpen] = useState<boolean>(false);
  const [tripsOpen, setTripsOpen] = useState<boolean>(false);
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
  const [
    timeoffRequestTypes,
    setTimeoffRequestTypes,
  ] = useState<TimeoffRequestTypes>();
  const [perDiemRowId, setPerDiemRowId] = useState<number[]>();

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
    reload();
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
      // url:
      //   'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest',
      action: () => {
        setTimeoffOpen(true);
      },
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
      icon: <DriveEtaIcon />,
      name: 'Trips',
      action: () => {
        setTripsOpen(true);
      },
    },
    /*{
      icon: <AssessmentIcon />,
      name: 'Timesheet Weekly Report',
      action: () => {
        console.log('Timesheet Weekly Report');
      },
    },*/
  ];

  const handleDateChange = (value: Date) => {
    dispatch({ type: 'changeDate', value });
  };

  const handleTimeout = (): void => {
    localStorage.setItem('TIMESHEET_TIMEOUT', `${new Date().valueOf()}`);
    dispatch({ type: 'showReceiptsIssueDialog', value: false });
    dispatch({
      type: 'setReceiptsIssue',
      data: {
        hasReceiptsIssue: false,
        receiptsIssueStr: 'User is on 24 hour timeout',
      },
    });
  };

  const checkReceiptIssue = (): boolean => {
    console.log({ receiptsIssue });
    if (receiptsIssue.hasReceiptsIssue) {
      dispatch({ type: 'showReceiptsIssueDialog', value: true });
      return false;
    }
    return true;
  };

  const handleSubmitTimesheet = useCallback(() => {
    (async () => {
      if (!checkReceiptIssue()) return;
      const ids: number[] = [];
      let overlapped = false;
      for (let i = 0; i < shownDates.length; i++) {
        let dayList = [...data[shownDates[i]].timesheetLineList].sort(
          (a, b) =>
            parseISO(a.timeStarted).getTime() -
            parseISO(b.timeStarted).getTime(),
        );
        let result = dayList.reduce(
          (acc, current, idx, arr) => {
            if (idx === 0) {
              acc.idList.push(current.id);
              return acc;
            }
            let previous = arr[idx - 1];
            let previousEnd = parseISO(previous.timeFinished).getTime();
            let currentStart = parseISO(current.timeStarted).getTime();
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
          {
            ranges: [] as {
              previous: TimesheetLine.AsObject;
              current: TimesheetLine.AsObject;
            }[],
            idList: [] as number[],
          },
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
        if (
          user?.timesheetAdministration &&
          props.userId !== props.timesheetOwnerId
        ) {
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
    const userResult = await UserClientService.loadUserById(userId);
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
      const ownerResult = await UserClientService.loadUserById(
        timesheetOwnerId,
      );
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

  const fetchTimeoffRequestTypes = useCallback(async () => {
    const timeoffRequestTypes = await TimeoffRequestClientService.getTimeoffRequestTypes();
    setTimeoffRequestTypes(
      timeoffRequestTypes.reduce(
        (aggr, item) => ({ ...aggr, [item.id]: item.requestType }),
        {},
      ),
    );
  }, [setTimeoffRequestTypes]);

  useEffect(() => {
    (async () => {
      fetchUsers();
    })();
    if (!timeoffRequestTypes) {
      setTimeoffRequestTypes({});
      fetchTimeoffRequestTypes();
    }
  }, [timeoffRequestTypes]);

  const reload = () => {
    dispatch({ type: 'fetchingTimesheetData' });
    (async () => {
      const sr = new ServicesRendered();
      sr.setIsActive(1);
      sr.setHideFromTimesheet(0);
      //sr.setEventId(123110101010101);
      //sr.setTimeStarted('%nevergonnamatchhopeitdoesntbreak%');
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
        `${format(
          addDays(parseISO(shownDates[shownDates.length - 1]), 1),
          'yyyy-MM-dd',
        )}%`,
      );
      const timeoffs = await getTimeoffRequestByFilter({
        isActive: 1,
        userId: timesheetOwnerId,
        dateRangeList: [
          '>=',
          shownDates[0],
          '<',
          format(
            addDays(parseISO(shownDates[shownDates.length - 1]), 1),
            'yyyy-MM-dd',
          ),
        ],
        dateTargetList: ['time_started', 'time_started'],
      });
      dispatch({
        type: 'fetchedTimesheetData',
        data: result,
        timeoffs: timeoffs.toObject().resultsList,
      });
    })();
  };

  useEffect(reload, [shownDates]);

  if (!user) {
    return null;
  }
  const hasAccess = userId === timesheetOwnerId || user.timesheetAdministration;
  getPerDiemRowIds(selectedDate).then(value => {
    setPerDiemRowId(value?.toArray());
  });
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
            isTimesheetOwner={props.userId === props.timesheetOwnerId}
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
                    timeoffRequestTypes={timeoffRequestTypes}
                    loggedUserId={userId}
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
      {timeoffOpen && (
        <Modal open onClose={() => setTimeoffOpen(false)} fullScreen>
          <TimeOff
            loggedUserId={userId}
            userId={timesheetOwnerId}
            onCancel={() => setTimeoffOpen(false)}
            onSaveOrDelete={() => {
              setTimeoffOpen(false);
              reload();
            }}
          />
        </Modal>
      )}
      {tripsOpen && perDiemRowId?.length != 0 && (
        <Modal open onClose={() => setTripsOpen(false)}>
          <TripInfoTable
            canAddTrips
            loggedUserId={props.userId}
            perDiemRowIds={perDiemRowId!}
          />
        </Modal>
      )}
    </PageWrapper>
  );
};
