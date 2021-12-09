import React, {
  FC,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
} from 'date-fns';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { TimeoffRequest } from '@kalos-core/kalos-rpc/compiled-protos/timeoff_request_pb';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import * as jspb from 'google-protobuf';
import { ENDPOINT, PERMISSION_PRIVILEGE } from '../../constants';
import Filter from './components/Filter';
import Column from './components/Column';
import { useFetchAll } from '../ComponentsLibrary/hooks';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import EventIcon from '@material-ui/icons/Event';
import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/PersonAdd';
import { Modal } from '../ComponentsLibrary/Modal';
import { CustomerEdit } from '../ComponentsLibrary/CustomerEdit';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { TimeOff } from '../ComponentsLibrary/TimeOff';
import {
  TimeoffRequestClientService,
  TimeoffRequestTypes,
} from '../../helpers';
import './styles.less';
import { CodeSharp } from '@material-ui/icons';

type Props = PageWrapperProps & {
  userId: number;
  initialCustomer?: string;
  initialZip?: string;
  initialTech?: string;
};

const userClient = new UserClient(ENDPOINT);
const eventClient = new EventClient(ENDPOINT);

const today = new Date();
const calendarOptions = { weekStartsOn: 1 as const };

const getDefaultSelectedDate = (viewBy: string): Date => {
  switch (viewBy) {
    case 'day':
      return today;
    case 'week':
      return startOfWeek(today, calendarOptions);
    case 'month':
      return startOfMonth(today);
    default:
      return today;
  }
};

const getShownDates = (viewBy: string, date?: Date): string[] => {
  switch (viewBy) {
    case 'day':
      return [format(date || today, 'yyyy-MM-dd')];
    case 'week': {
      const firstDay = date || startOfWeek(today, calendarOptions);
      const lastDay = addDays(firstDay, 6);
      const days = eachDayOfInterval({ start: firstDay, end: lastDay });
      const theDays = days.map(date => format(date, 'yyyy-MM-dd'));
      return theDays;
    }
    case 'month': {
      const firstDay = date || startOfMonth(today);
      const lastDay = endOfMonth(date || today);
      const days = eachDayOfInterval({ start: firstDay, end: lastDay });
      return days.map(date => format(date, 'yyyy-MM-dd'));
    }
    default:
      return [];
  }
};

type MapList = {
  [key: string]: string;
};

const mapToObject = (mapping: jspb.Map<string | number, string>): MapList =>
  mapping
    .toArray()
    .reduce((acc: MapList, [key, val]: [string | number, string]) => {
      acc[key] = val;
      return acc;
    }, {});

type Filters = {
  customers: string[];
  jobType: string;
  jobSubType: number;
  zip: string[];
  states: string[];
  propertyUse: string[];
  techIds: string;
  timeoffDepartmentIds: string;
};

type State = {
  user?: User;
  fetchingCalendarData: boolean;
  datesMap?: jspb.Map<string, CalendarDay>;
  customersMap: MapList;
  zipCodesMap: MapList;
  statesMap: MapList;
  speedDialOpen: boolean;
  viewBy: string | '';
  defaultView?: string;
  selectedDate: Date | '';
  shownDates: string[];
  filters: Filters;
  addCustomer: boolean;
};

type Action =
  | { type: 'toggleAddCustomer'; value: boolean }
  | { type: 'setUser'; value: User }
  | { type: 'fetchingCalendarData' }
  | { type: 'fetchedCalendarData'; data: CalendarData }
  | { type: 'viewBy'; value: string }
  | { type: 'speedDialOpen' }
  | { type: 'changeSelectedDate'; value: Date }
  | { type: 'changeFilters'; value: Filters }
  | { type: 'defaultView'; value: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.value,
        defaultView: action.value.getCalendarPref(),
      };
    }
    case 'toggleAddCustomer': {
      return {
        ...state,
        addCustomer: !state.addCustomer,
      };
    }
    case 'fetchingCalendarData': {
      return {
        ...state,
        fetchingCalendarData: true,
      };
    }
    case 'fetchedCalendarData': {
      const CalendarData = action.data;
      return {
        ...state,
        datesMap: CalendarData.getDatesMap(),
        customersMap: mapToObject(CalendarData.getCustomersMap()),
        zipCodesMap: mapToObject(CalendarData.getZipCodesMap()),
        statesMap: mapToObject(CalendarData.getStatesMap()),

        fetchingCalendarData: false,
      };
    }
    case 'defaultView': {
      return {
        ...state,
        defaultView: action.value,
      };
    }
    case 'viewBy': {
      return {
        ...state,
        viewBy: action.value,
        selectedDate: getDefaultSelectedDate(action.value),
        shownDates: getShownDates(action.value),
      };
    }
    case 'speedDialOpen': {
      return {
        ...state,
        speedDialOpen: !state.speedDialOpen,
      };
    }
    case 'changeSelectedDate': {
      return {
        ...state,
        selectedDate: action.value,
        shownDates: getShownDates(state.viewBy, action.value),
      };
    }
    case 'changeFilters': {
      return {
        ...state,
        filters: action.value,
      };
    }
    default:
      return { ...state };
  }
};

const cachedInitialFilters = window.localStorage.getItem(
  'SERVICE_CALENDAR_FILTER',
);
const initialFilters: Filters = cachedInitialFilters
  ? JSON.parse(cachedInitialFilters)
  : {
      customers: [],
      jobType: '0',
      jobSubType: 0,
      zip: [],
      propertyUse: [],
      techIds: '0',
      timeoffDepartmentIds: '0',
      states: [],
    };
let temp = initialFilters.jobType;
if (typeof temp === 'number') {
  initialFilters.jobType = initialFilters.jobType.toString();
}
if (initialFilters.timeoffDepartmentIds === undefined) {
  initialFilters.timeoffDepartmentIds = '0';
}
if (initialFilters.states === undefined) {
  initialFilters.states = [];
}
const initialState: State = {
  fetchingCalendarData: true,
  speedDialOpen: false,
  viewBy: '',
  selectedDate: '',
  shownDates: [],
  filters: initialFilters,
  customersMap: {},
  zipCodesMap: {},
  statesMap: {},
  addCustomer: false,
};

type EmployeesContext = {
  employees: User[];
  employeesLoading: boolean;
};

type CalendarDay = {
  getServiceCallsList(): Array<Event>;
  getCompletedServiceCallsList(): Array<Event>;
  getRemindersList(): Array<Event>;
  getTimeoffRequestsList(): Array<TimeoffRequest>;
};

type CalendarData = {
  getDatesMap(): jspb.Map<string, CalendarDay>;
  getCustomersMap(): jspb.Map<number, string>;
  getZipCodesMap(): jspb.Map<string, string>;
  getStatesMap(): jspb.Map<string, string>;
};

type CalendarDataContext = {
  fetchingCalendarData?: boolean;
  datesMap?: jspb.Map<string, CalendarDay>;
  customersMap?: MapList;
  zipCodesMap?: MapList;
  statesMap?: MapList;
  initialFilters: Filters;
  filters: Filters;
  changeFilters: (value: Filters) => void;
};

export const CalendarDataContext = createContext<CalendarDataContext>({
  initialFilters: initialFilters,
  filters: initialFilters,
  changeFilters: () => {},
});
export const EmployeesContext = createContext<EmployeesContext>({
  employees: [],
  employeesLoading: false,
});

export const ServiceCalendar: FC<Props> = props => {
  const { userId, initialCustomer, initialTech, initialZip } = props;
  if (initialCustomer) {
    initialFilters.customers.concat([initialCustomer]);
  }
  if (initialTech) {
    initialFilters.techIds = initialTech;
  }
  if (initialZip) {
    initialFilters.zip.concat([initialZip]);
  }
  const [
    {
      user,
      defaultView,
      fetchingCalendarData,
      datesMap,
      customersMap,
      zipCodesMap,
      statesMap,
      viewBy,
      shownDates,
      selectedDate,
      filters,
      addCustomer,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [customerOpened, setCustomerOpened] = useState<User>();
  const [timeoffOpen, setTimeoffOpen] = useState<boolean>(false);
  const [timeoffRequestTypes, setTimeoffRequestTypes] =
    useState<TimeoffRequestTypes>();

  const fetchUser = useCallback(async () => {
    const req = new User();
    req.setId(userId);
    const result = await userClient.Get(req);
    dispatch({ type: 'setUser', value: result });
  }, [userId]);

  if (defaultView && !viewBy) {
    dispatch({ type: 'viewBy', value: defaultView });
  }

  const fetchEmployees = useCallback(async () => {
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setOverrideLimit(true);
    return await userClient.BatchGet(user);
  }, []);
  const resp = useFetchAll(fetchEmployees);
  const employees = resp.data;
  const employeesLoading = resp.isLoading;
  // const { data: employees, isLoading: employeesLoading } = useFetchAll(
  //   fetchEmployees,
  // );

  const fetchTimeoffRequestTypes = useCallback(async () => {
    const timeoffRequestTypes =
      await TimeoffRequestClientService.getTimeoffRequestTypes();
    setTimeoffRequestTypes(
      timeoffRequestTypes.reduce(
        (aggr, item) => ({ ...aggr, [item.getId()]: item.getRequestType() }),
        {},
      ),
    );
  }, [setTimeoffRequestTypes]);

  useEffect(() => {
    userClient.GetToken('test', 'test');
    fetchUser();
    if (!timeoffRequestTypes) {
      setTimeoffRequestTypes({});
      fetchTimeoffRequestTypes();
    }
  }, [timeoffRequestTypes, fetchTimeoffRequestTypes, fetchUser]);

  useEffect(() => {
    if (shownDates.length) {
      dispatch({ type: 'fetchingCalendarData' });
      (async () => {
        const req = new Event();
        req.setDateStarted(shownDates[0]);
        req.setDateEnded(shownDates[shownDates.length - 1]);
        req.setIsActive(1);
        req.setOrderBy('time_started');
        req.setOrderDir('asc');
        console.log('req', req);
        const data = await eventClient.GetCalendarData(req);
        console.log('data', data);
        dispatch({ type: 'fetchedCalendarData', data });
      })();
    }
  }, [shownDates]);

  const changeViewBy = useCallback(value => {
    dispatch({ type: 'viewBy', value });
  }, []);

  const changeSelectedDate = useCallback((value: Date): void => {
    dispatch({ type: 'changeSelectedDate', value });
  }, []);

  const changeFilters = useCallback((value: Filters): void => {
    dispatch({ type: 'changeFilters', value });
  }, []);

  const setDefaultView = useCallback(() => {
    (async () => {
      const req = new User();
      req.setId(userId);
      req.setCalendarPref(viewBy);
      req.setFieldMaskList(['CalendarPref']);
      const result = await userClient.Update(req);
      dispatch({ type: 'defaultView', value: result.getCalendarPref() });
    })();
  }, [viewBy, userId]);
  const addNewOptions = [
    {
      icon: <TimerOffIcon />,
      name: 'Request Time Off',
      // url: 'https://app.kalosflorida.com/index.cfm?action=admin:timesheet.addTimeOffRequest',
      action: () => {
        setTimeoffOpen(true);
      },
    },
    {
      icon: <AddAlertIcon />,
      name: 'Reminder',
      url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder',
    },
    /*{
      icon: <EventIcon />,
      name: 'Service Call',
      url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.addServiceCallGeneral',
    },*/
    {
      icon: <PersonIcon />,
      name: 'Add Customer',
      url: 'https://app.kalosflorida.com/index.cfm?action=admin:customers.add',
    },
    {
      icon: <SearchIcon />,
      name: 'Search Calls',
      url: 'https://app.kalosflorida.com/index.cfm?action=admin:service.calls',
    },
  ];
  const calendarPrivilege = user
    ?.getPermissionGroupsList()
    .filter(pg => pg.getType() === PERMISSION_PRIVILEGE)
    ?.find(privilege => privilege.getName() === 'FullCalendar');
  const canSeeFullCalendar =
    calendarPrivilege !== undefined || !!user?.getIsAdmin() || false;

  return (
    <PageWrapper {...props} userID={userId}>
      <CalendarDataContext.Provider
        value={{
          fetchingCalendarData,
          datesMap,
          customersMap,
          zipCodesMap,
          statesMap,
          initialFilters,
          filters,
          changeFilters,
        }}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Filter
            defaultView={defaultView}
            setDefaultView={setDefaultView}
            viewBy={viewBy}
            changeViewBy={changeViewBy}
            selectedDate={selectedDate}
            changeSelectedDate={changeSelectedDate}
          />
        </MuiPickersUtilsProvider>
        <EmployeesContext.Provider value={{ employees, employeesLoading }}>
          <Box className="ServiceCalendarWrapper">
            <Container
              className={clsx(viewBy !== 'day' && 'ServiceCalendarWeek')}
              maxWidth={false}
            >
              {shownDates.map(date => (
                <Column
                  key={date}
                  date={date}
                  viewBy={viewBy}
                  userId={userId}
                  isAdmin={canSeeFullCalendar}
                  timeoffRequestTypes={timeoffRequestTypes}
                />
              ))}
            </Container>
          </Box>
        </EmployeesContext.Provider>
        <AddNewButton options={addNewOptions} />
      </CalendarDataContext.Provider>
      {/*addCustomer && (
        <Modal open onClose={handleToggleAddCustomer(false)}>
          <CustomerEdit
            onClose={handleToggleAddCustomer(false)}
            onSave={handleCustomerSave}
          />
        </Modal>
      )*/}
      {timeoffOpen && (
        <Modal open onClose={() => setTimeoffOpen(false)} fullScreen>
          <TimeOff
            loggedUserId={userId}
            userId={userId}
            onCancel={() => setTimeoffOpen(false)}
            onSaveOrDelete={() => {
              setTimeoffOpen(false);
              document.location.reload();
            }}
          />
        </Modal>
      )}
    </PageWrapper>
  );
};
