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
import { AddNewButton } from '../AddNewButton';
import { ConfirmServiceProvider } from '../ConfirmService';
import Toolbar from './components/Toolbar';
import Column from './components/Column';
import { TripInfoTable } from '../TripInfoTable';
import EditTimesheetModal from './components/EditModal';
import { ENDPOINT } from '../../../constants';
import {
  PerDiemClientService,
  TimeoffRequestClientService,
  TimeoffRequestTypes,
  UserClientService,
  UserType,
} from '../../../helpers';
import { getShownDates, reducer } from './reducer';
import ReceiptsIssueDialog from './components/ReceiptsIssueDialog';
import { Modal } from '../Modal';
import { TimeOff } from '../TimeOff';

import './styles.less';
import { TripSummary } from '../TripSummary';
import { RoleType } from '../Payroll';
import { NULL_TIME_VALUE } from './constants';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/TimeoffRequest';

const tslClient = new TimesheetLineClient(ENDPOINT);
const txnClient = new TransactionClient(ENDPOINT);

export type Props = {
  userId: number;
  timesheetOwnerId: number;
  week?: string;
  startOnWeek?: boolean;
  onClose?: () => void;
};

type EditTimesheetContext = {
  editTimesheetCard: (card: TimesheetLine.AsObject) => void;
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => void;
};

export const EditTimesheetContext = createContext<EditTimesheetContext>({
  editTimesheetCard: (card: TimesheetLine.AsObject) => {},
  editServicesRenderedCard: (card: ServicesRendered.AsObject) => {},
});

const getWeekStart = (
  userId: number,
  timesheetOwnerId: number,
  week?: string,
  toggleStartOnWeek?: boolean,
) => {
  const today = week ? parseISO(week) : new Date();
  return userId === timesheetOwnerId || toggleStartOnWeek === true
    ? startOfWeek(today, { weekStartsOn: 6 })
    : startOfWeek(subDays(today, 7), { weekStartsOn: 6 });
};

export const Timesheet: FC<Props> = props => {
  const { userId, timesheetOwnerId, week, onClose, startOnWeek } = props;
  //const [timeoffOpen, setTimeoffOpen] = useState<boolean>(false);
  //const [tripsOpen, setTripsOpen] = useState<boolean>(false);

  const [role, setRole] = useState<RoleType>();

  const [state, dispatch] = useReducer(reducer, {
    user: undefined,
    owner: undefined,
    perDiemRowId: null,
    timeoffOpen: false,
    tripsOpen: false,
    timeoffRequestTypes: undefined,
    fetchingTimesheetData: true,
    data: {},
    pendingEntries: false,
    selectedDate: getWeekStart(userId, timesheetOwnerId, week, startOnWeek),
    shownDates: getShownDates(
      getWeekStart(userId, timesheetOwnerId, week, startOnWeek),
    ),
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
  //imeoffRequestTypes,setTimeoffRequestTypes,] = useState<TimeoffRequestTypes>();
  //const [perDiemRowId, setPerDiemRowId] = useState<number[]>();

  const {
    user,
    owner,
    fetchingTimesheetData,
    timeoffOpen,
    tripsOpen,
    timeoffRequestTypes,
    perDiemRowId,
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
    dispatch({ type: 'addNewTimesheet' });
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
  const setTimeoffOpen = (value: boolean) => {
    dispatch({ type: 'timeoffOpen', value });
  };
  const setTripsOpen = (value: boolean) => {
    dispatch({ type: 'tripsOpen', value });
  };
  const setPerDiemRowId = (value: number[]) => {
    dispatch({ type: 'perDiemRowId', value });
  };
  const setTimeoffRequestTypes = useCallback((value: TimeoffRequestTypes) => {
    dispatch({ type: 'timeoffRequestTypes', value });
  }, []);

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

  const checkReceiptIssue = async (): Promise<boolean> => {
    const [hasIssue, issueStr] = await txnClient.timesheetCheck(userId);
    if (hasIssue) {
      dispatch({ type: 'showReceiptsIssueDialog', value: true });
      return false;
    }
    return true;
  };

  const handleSubmitTimesheet = useCallback(async () => {
    (async () => {
      if (await !checkReceiptIssue()) return;
      const ids: number[] = [];
      let overlapped = false;
      let sameTimeConflict = false; //Track if there was a same time conflict
      for (let i = 0; i < shownDates.length; i++) {
        let days = [...data[shownDates[i]].timesheetLineList]; //interate through each day
        for (var val of days) {
          //iterate through each card in the day, as long as it is defined
          if (val != undefined) {
            if (val.timeFinished === val.timeStarted) {
              //if the Start and End time are the same, trip the flag
              sameTimeConflict = true;
            }
          }
        }
      }
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
              if (
                !current.adminApprovalUserId ||
                current.adminApprovalUserId === 0
              ) {
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

        if (overlapped || sameTimeConflict) {
          //Adding the sameTimeConflict check to here as well, since
          //we would like to break if either one has been tripped
          break;
        } else {
          ids.push(...result.idList);
          console.log(ids);
        }
      }
      if (overlapped) {
        dispatch({ type: 'error', text: 'Timesheet lines are overlapping' });
      } else if (sameTimeConflict && role != 'Payroll') {
        dispatch({
          type: 'error',
          text: 'Timesheet contains value with same Start and End time.', // dispatch the error
        });
      } else {
        let isManager = false;
        console.log(ids);
        if (user) {
          const { permissionGroupsList } = user;
          isManager = !!permissionGroupsList.find(p => p.name === 'Manager');
        }
        if (
          (user?.timesheetAdministration || isManager) &&
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
  const handleProcessTimesheet = useCallback(async () => {
    (async () => {
      const ids: number[] = [];
      for (let i = 0; i < shownDates.length; i++) {
        let dayList = [...data[shownDates[i]].timesheetLineList].sort(
          (a, b) =>
            parseISO(a.timeStarted).getTime() -
            parseISO(b.timeStarted).getTime(),
        );
        let result = dayList.reduce(
          (acc, current, idx, arr) => {
            if (
              idx === 0 &&
              current.adminApprovalUserId &&
              current.adminApprovalUserId != 0
            ) {
              acc.idList.push(current.id);
              return acc;
            }

            let previous = arr[idx - 1];
            acc.ranges.push({
              previous: previous,
              current: current,
            });
            if (
              current.adminApprovalUserId &&
              current.adminApprovalUserId !== 0 &&
              current.adminApprovalDatetime != NULL_TIME_VALUE
            ) {
              acc.idList.push(current.id);
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
        ids.push(...result.idList);
        console.log(ids);
      }
      for (let i = 0; i < shownDates.length; i++) {
        //
        let timeoffDayList = [...data[shownDates[i]].timeoffs];
        for (let j = 0; j < timeoffDayList.length; j++) {
          let day = timeoffDayList[j];
          console.log(day);
          if (
            day.adminApprovalUserId != 0 &&
            day.requestStatus == 1 &&
            (day.requestType == 9 ||
              day.requestType == 10 ||
              day.requestType == 11)
          ) {
            const req = new TimeoffRequest();
            req.setId(day.id);
            req.setPayrollProcessed(true);
            await TimeoffRequestClientService.Update(req);
          }
        }
      }
      await tslClient.Process(ids, userId);
      dispatch({ type: 'processTimesheet' });
    })();
  }, [userId, data, shownDates]);
  const handleRejectTimesheet = useCallback(async () => {
    (async () => {
      const ids: number[] = [];
      for (let i = 0; i < shownDates.length; i++) {
        let dayList = [...data[shownDates[i]].timesheetLineList].sort(
          (a, b) =>
            parseISO(a.timeStarted).getTime() -
            parseISO(b.timeStarted).getTime(),
        );
        let result = dayList.reduce(
          (acc, current, idx, arr) => {
            if (
              idx === 0 &&
              current.adminApprovalUserId &&
              current.adminApprovalUserId != 0
            ) {
              acc.idList.push(current.id);
              return acc;
            }

            let previous = arr[idx - 1];
            acc.ranges.push({
              previous: previous,
              current: current,
            });
            if (
              current.adminApprovalUserId &&
              current.adminApprovalUserId !== 0 &&
              current.adminApprovalDatetime != NULL_TIME_VALUE
            ) {
              acc.idList.push(current.id);
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
        ids.push(...result.idList);
        console.log(ids);
      }
      dispatch({ type: 'rejectTimesheet' });
      await tslClient.Reject(ids, userId);
    })();
  }, [userId, data, shownDates]);
  const handleDenyTimesheet = useCallback(async () => {
    (async () => {
      const ids: number[] = [];
      for (let i = 0; i < shownDates.length; i++) {
        let dayList = [...data[shownDates[i]].timesheetLineList].sort(
          (a, b) =>
            parseISO(a.timeStarted).getTime() -
            parseISO(b.timeStarted).getTime(),
        );
        let result = dayList.reduce(
          (acc, current, idx, arr) => {
            if (idx === 0 && current.userApprovalDatetime != NULL_TIME_VALUE) {
              acc.idList.push(current.id);
              return acc;
            }

            let previous = arr[idx - 1];
            acc.ranges.push({
              previous: previous,
              current: current,
            });
            if (
              current.adminApprovalUserId &&
              current.adminApprovalUserId !== 0 &&
              current.adminApprovalDatetime != NULL_TIME_VALUE
            ) {
              acc.idList.push(current.id);
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
        ids.push(...result.idList);
        console.log(ids);
      }
      dispatch({ type: 'denyTimesheet' });
      await tslClient.Deny(ids, userId);
    })();
  }, [userId, data, shownDates]);
  const fetchUsers = async () => {
    const userResult = await UserClientService.loadUserById(userId);
    const role = userResult.permissionGroupsList.find(p => p.type === 'role');
    if (role) {
      setRole(role.name as RoleType);
    }
    const [hasIssue, issueStr] = await txnClient.timesheetCheck(userId);
    console.log('Our current issue:' + hasIssue);
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
      const timeoffs = await TimeoffRequestClientService.getTimeoffRequestByFilter(
        {
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
        },
      );
      dispatch({
        type: 'fetchedTimesheetData',
        data: result,
        timeoffs: timeoffs.toObject().resultsList,
      });
    })();
  };

  useEffect(reload, [shownDates, timesheetOwnerId]);

  if (!user) {
    return null;
  }
  const { permissionGroupsList } = user;
  const isManager = !!permissionGroupsList.find(p => p.name === 'Manager');
  const hasAccess =
    userId === timesheetOwnerId || user.timesheetAdministration || isManager;
  if (!perDiemRowId) {
    PerDiemClientService.getPerDiemRowIds(selectedDate).then(value => {
      if (!value) return;

      const pdIds: number[] = [];
      for (const pd of value!.getResultsList()) {
        pdIds.push(pd.getId());
      }

      if (pdIds.length === 0) {
        console.error('Could not get per diem ids to match that date.');
        return;
      }

      setPerDiemRowId(pdIds);
    });
  }
  return (
    <div>
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
            timesheetAdministration={
              !!user.timesheetAdministration || isManager
            }
            payroll={payroll}
            submitTimesheet={handleSubmitTimesheet}
            processTimesheet={handleProcessTimesheet}
            rejectTimesheet={handleRejectTimesheet}
            pendingEntries={pendingEntries}
            isTimesheetOwner={props.userId === props.timesheetOwnerId}
            onClose={onClose}
            role={role}
            userId={props.userId}
          />
          {error && (
            <Alert
              severity="error"
              onClose={() => dispatch({ type: 'error', text: '' })}
            >
              {error}
            </Alert>
          )}
          <Box
            className="Timesheet"
            bgcolor={role === 'Payroll' ? '#e8e8e8' : null}
          >
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
              timesheetAdministration={
                !!user.timesheetAdministration || isManager
              }
              role={role}
              defaultDepartment={user.employeeDepartmentId}
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
          isAdmin={user.timesheetAdministration || isManager}
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
          {/*<TripInfoTable
            canAddTrips
            canDeleteTrips
            loggedUserId={props.userId}
            perDiemRowIds={perDiemRowId!}
          />*/}
          <TripSummary
            key={'key' + perDiemRowId}
            userId={props.userId}
            loggedUserId={props.userId}
            perDiemRowIds={perDiemRowId!}
            canDeleteTrips
            canAddTrips
            viewingOwn
            canApprove={role === 'Manager'}
            canProcessPayroll={role === 'Payroll'}
          ></TripSummary>
        </Modal>
      )}
    </div>
  );
};
