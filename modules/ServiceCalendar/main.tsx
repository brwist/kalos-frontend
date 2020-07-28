import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
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
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import * as jspb from 'google-protobuf';
import customTheme from '../Theme/main';
import { ENDPOINT } from '../../constants';
import Filter from './components/Filter';
import Column from './components/Column';
import { useFetchAll } from '../ComponentsLibrary/hooks';
import { AddNewButton } from '../ComponentsLibrary/AddNewButton';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import EventIcon from '@material-ui/icons/Event';
import './styles.less';

type Props = {
  userId: number;
};

const userClient = new UserClient(ENDPOINT);
const eventClient = new EventClient(ENDPOINT);

const today = new Date();

const getDefaultSelectedDate = (viewBy: string): Date => {
  switch (viewBy) {
    case 'day':
      return today;
    case 'week':
      return startOfWeek(today);
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
      const firstDay = date || startOfWeek(today);
      const lastDay = addDays(firstDay, 6);
      const days = eachDayOfInterval({ start: firstDay, end: lastDay });
      return days.map(date => format(date, 'yyyy-MM-dd'));
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
  jobType: number;
  jobSubType: number;
  zip: string[];
  propertyUse: string[];
};

type State = {
  user?: User.AsObject;
  fetchingCalendarData: boolean;
  datesMap?: jspb.Map<string, CalendarDay>;
  customersMap: MapList;
  zipCodesMap: MapList;
  speedDialOpen: boolean;
  viewBy: string | '';
  defaultView?: string;
  selectedDate: Date | '';
  shownDates: string[];
  filters: Filters;
};

type Action =
  | { type: 'setUser'; value: User.AsObject }
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
        defaultView: action.value.calendarPref,
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

const initialFilters: Filters = {
  customers: [],
  jobType: 0,
  jobSubType: 0,
  zip: [],
  propertyUse: [],
};

const initialState: State = {
  fetchingCalendarData: true,
  speedDialOpen: false,
  viewBy: '',
  selectedDate: '',
  shownDates: [],
  filters: initialFilters,
  customersMap: {},
  zipCodesMap: {},
};

type EmployeesContext = {
  employees: User.AsObject[];
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
};

type CalendarDataContext = {
  fetchingCalendarData?: boolean;
  datesMap?: jspb.Map<string, CalendarDay>;
  customersMap?: MapList;
  zipCodesMap?: MapList;
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

const addNewOptions = [
  {
    icon: <AssignmentIndIcon />,
    name: 'Task',
    url:
      'https://app.kalosflorida.com/index.cfm?action=admin:service.addServiceCallGeneral',
  },
  {
    icon: <AddAlertIcon />,
    name: 'Reminder',
    url:
      'https://app.kalosflorida.com/index.cfm?action=admin:service.addReminder',
  },
  {
    icon: <EventIcon />,
    name: 'Service Call',
    url: 'https://app.kalosflorida.com/index.cfm?action=admin:tasks.addtask',
  },
];

const ServiceCalendar = ({ userId }: Props) => {
  const [
    {
      user,
      defaultView,
      fetchingCalendarData,
      datesMap,
      customersMap,
      zipCodesMap,
      viewBy,
      shownDates,
      selectedDate,
      filters,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const fetchUser = async () => {
    const req = new User();
    req.setId(userId);
    const result = await userClient.Get(req);
    dispatch({ type: 'setUser', value: result });
  };

  if (defaultView && !viewBy) {
    dispatch({ type: 'viewBy', value: defaultView });
  }

  const fetchEmployees = useCallback(async page => {
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setPageNumber(page);
    return (await userClient.BatchGet(user)).toObject();
  }, []);

  const { data: employees, isLoading: employeesLoading } = useFetchAll(
    fetchEmployees,
  );

  useEffect(() => {
    userClient.GetToken('test', 'test');
    fetchUser();
  }, []);

  useEffect(() => {
    if (shownDates.length) {
      dispatch({ type: 'fetchingCalendarData' });
      (async () => {
        const req = new Event();
        req.setDateStarted(shownDates[0]);
        req.setDateEnded(shownDates[shownDates.length - 1]);
        const data = await eventClient.GetCalendarData(req);
        dispatch({ type: 'fetchedCalendarData', data });
      })();
    }
  }, [shownDates]);

  const changeViewBy = useCallback(value => {
    dispatch({ type: 'viewBy', value });
  }, []);

  const changeSelectedDate = useCallback(
    (value: Date): void => {
      dispatch({ type: 'changeSelectedDate', value });
    },
    [viewBy],
  );

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
      dispatch({ type: 'defaultView', value: result.calendarPref });
    })();
  }, [viewBy]);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <CalendarDataContext.Provider
        value={{
          fetchingCalendarData,
          datesMap,
          customersMap,
          zipCodesMap,
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
                  isAdmin={user?.isAdmin || 0}
                />
              ))}
            </Container>
          </Box>
        </EmployeesContext.Provider>
        <AddNewButton options={addNewOptions} />
      </CalendarDataContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;
