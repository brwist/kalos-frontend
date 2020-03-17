import React, { createContext, useCallback, useEffect, useState, useReducer, useRef } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format, startOfWeek, startOfMonth, endOfMonth, endOfYear, startOfYear, eachDayOfInterval, addDays } from 'date-fns';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import { ENDPOINT } from '../../constants';
import Filter from './components/Filter';
import Column from './components/Column';
import AddNewButton from './components/AddNewButton';
import { useFetchAll } from './hooks';

type Props = {
  userId: number;
}

const userClient = new UserClient(ENDPOINT);
const eventClient = new EventClient(ENDPOINT);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    week: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
      gridGap: theme.spacing(2),
    },
  }),
);

const today = new Date();

const getDefaultSelectedDate = (viewBy: string): Date => {
  switch (viewBy) {
  case 'day':
    return today;
  case 'week':
    return startOfWeek(today);
  case 'month':
    return startOfMonth(today);
  case 'year':
    return startOfYear(today);
  default:
    return today;
  }
};

const getShownDates = (viewBy: string, date?: Date) => {
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
  case 'year': {
    const firstDay = date || startOfYear(today);
    const lastDay = endOfYear(date || today);
    const days = eachDayOfInterval({ start: firstDay, end: lastDay });
    return days.map(date => format(date, 'yyyy-MM-dd'));
  }
  default:
    return [];
  }
};

const mapToObject = (mapping: Map<string, CalendarDay>) => mapping.toArray().reduce((acc, [key, val]) => {acc[key] = val; return acc}, {});

type Filters = {
  customers: string[],
  jobType: number,
  jobSubType: number,
  zip: string[],
  propertyUse: string[],
};

type State = {
  fetchingCalendarData: boolean;
  datesMap?: Map<string, CalendarDay>;
  speedDialOpen: boolean;
  viewBy: string;
  selectedDate: Date,
  shownDates: string[];
  filters: Filters;
}

type Action =
  | { type: 'fetchingCalendarData' }
  | { type: 'fetchedCalendarData', data: CalendarData }
  | { type: 'viewBy', value: string }
  | { type: 'speedDialOpen' }
  | { type: 'changeSelectedDate', value: Date}
  | { type: 'changeFilters', value: Filters};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
  case 'changeFilters' : {
    return {
      ...state,
      filters: action.value,
    };
  }
  default:
    return {...state};
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
  viewBy: 'week',
  selectedDate: getDefaultSelectedDate('week'),
  shownDates: getShownDates('week', getDefaultSelectedDate('week')),
  filters: initialFilters,
};

type EmployeesContext = {
  employees: User.AsObject[];
  employeesLoading: boolean;
};

type CalendarDay = {
  getServiceCallsList(): Array<Event>;
  getCompletedServiceCallsList(): Array<Event>;
  getRemindersList(): Array<Event>;
  getTimeoffRequestsList(): Array<timeoff_request_pb.TimeoffRequest>;
};

type CalendarData = {
  getDatesMap(): Map<string, CalendarDay>;
  getCustomersMap(): Map<number, string>;
  getZipCodesMap(): Map<string, string>;
};

export const CalendarDataContext = createContext();
export const EmployeesContext = createContext<EmployeesContext>({ employees: [], employeesLoading: false });

const ServiceCalendar = ({ userId }: Props) => {
  const classes = useStyles();
  const [{
    fetchingCalendarData,
    datesMap,
    customersMap,
    zipCodesMap,
    speedDialOpen,
    viewBy,
    shownDates,
    selectedDate,
    filters
  }, dispatch] = useReducer(reducer, initialState);

  const fetchEmployees = useCallback( async (page) => {
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setPageNumber(page);
    return (await userClient.BatchGet(user)).toObject();
  }, []);

  const { data:employees, isLoading:employeesLoading } = useFetchAll(fetchEmployees);

  useEffect(() => {
    userClient.GetToken('test', 'test');
  }, []);

  useEffect(() => {
    dispatch({ type: 'fetchingCalendarData' });
    (async () => {
      const data = (await eventClient.GetCalendarData(shownDates[0], shownDates[shownDates.length - 1]));
      dispatch({ type: 'fetchedCalendarData', data });
    })();
  }, [shownDates]);

  const changeViewBy = useCallback(value => {
    dispatch({ type: 'viewBy', value });
  }, []);

  const changeSelectedDate = useCallback((value: Date): void => {
    dispatch({ type: 'changeSelectedDate', value });
  }, [viewBy]);

  const changeFilters = useCallback((value: Filters): void => {
    dispatch({ type: 'changeFilters', value});
  }, []);

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
            viewBy={viewBy}
            changeViewBy={changeViewBy}
            selectedDate={selectedDate}
            changeSelectedDate={changeSelectedDate}
          />
        </MuiPickersUtilsProvider>
        <EmployeesContext.Provider value={{ employees, employeesLoading }}>
          <Container className={viewBy !== 'day' ? classes.week : ''} maxWidth={false}>
            {shownDates.map(date => (
              <Column key={date} date={date} />
            ))}
          </Container>
        </EmployeesContext.Provider>
        <Backdrop open={speedDialOpen} style={{ zIndex: 10 }} />
        <AddNewButton open={speedDialOpen} setOpen={() => dispatch({ type: 'speedDialOpen' })} />
      </CalendarDataContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;