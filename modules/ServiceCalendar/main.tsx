import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { format, startOfWeek, startOfMonth, endOfMonth, endOfYear, startOfYear, eachDayOfInterval, addDays } from 'date-fns';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import { Event, EventClient } from '@kalos-core/kalos-rpc/Event/index';
import { JobType } from "@kalos-core/kalos-rpc/compiled-protos/job_type_pb";
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
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
      gridTemplateColumns: 'repeat(7, 1fr)',
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

type Filters = {
  customers: number[],
  jobType: number | null,
  jobSubType: number | null,
  zip: number[],
  propertyUse: string[],
};

type State = {
  speedDialOpen: boolean;
  viewBy: string;
  selectedDate: Date,
  shownDates: string[];
  filters: Filters;
}

type Action =
  | { type: 'viewBy', value: string }
  | { type: 'speedDialOpen' }
  | { type: 'changeSelectedDate', value: Date}
  | { type: 'changeFilters', value: Filters};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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

const initialState: State = {
  speedDialOpen: false,
  viewBy: 'week',
  selectedDate: getDefaultSelectedDate('week'),
  shownDates: getShownDates('week', getDefaultSelectedDate('week')),
  filters: {
    customers: [],
    jobType: null,
    jobSubType: null,
    zip: [],
    propertyUse: [],
  }
};

type EmployeesContext = {
  employees: User.AsObject[];
  employeesLoading: boolean;
};

export const EmployeesContext = createContext<EmployeesContext>({ employees: [], employeesLoading: false });

const ServiceCalendar = ({ userId }: Props) => {
  const classes = useStyles();
  const [{speedDialOpen, viewBy, shownDates, selectedDate, filters}, dispatch] = useReducer(reducer, initialState);
  const fetchEmployees = useCallback( async (page) => {
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setPageNumber(page);
    return (await userClient.BatchGet(user)).toObject();
  }, []);

  const { data:employees, isLoading:employeesLoading } = useFetchAll(fetchEmployees);
  const fetchCalls = useCallback( async (page) => {
    const event = new Event();
    event.setDateStarted(`${format(today, 'yyyy-MM-dd')} 00:00:00%`);
    // event.setDateRangeList(['>', shownDates[0], '<', shownDates[shownDates.length - 1]]);
    // event.setDateRangeList['>', '2020-02-02', '<', '2020-20-22'];
    event.setPageNumber(page);
    return (await eventClient.BatchGet(event)).toObject();
  }, [shownDates]);

  const { data:calls } = useFetchAll(fetchCalls);

  // console.log(calls);
  const { callsByDate, customersList } = calls.reduce((acc, call) => {
    let { callsByDate, customersList } = acc;
    let customer = call?.customer;
    let dateFormatted = format(new Date(call.dateStarted), 'yyyy-MM-dd');

    if (callsByDate[dateFormatted]) {
      callsByDate[dateFormatted].push(call);
    } else {
      callsByDate[dateFormatted] = [call];
    }
    if (customer) {
      customersList[customer.id] = `${customer.firstname} ${customer.lastname}`;
    }

    return {
      callsByDate,
      customersList,
    };
  }, { callsByDate: {}, customersList: {} });

  useEffect(() => {
    userClient.GetToken('test', 'test');
  }, []);

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
      <EmployeesContext.Provider value={{ employees, employeesLoading }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Filter
            viewBy={viewBy}
            changeViewBy={changeViewBy}
            selectedDate={selectedDate}
            changeSelectedDate={changeSelectedDate}
            changeFilters={changeFilters}
            customersList={customersList}
            filters={filters}
          />
        </MuiPickersUtilsProvider>
        <Container className={viewBy !== 'day' ? classes.week : ''} maxWidth={false}>
          {shownDates.map(date => (
            <Column key={date} date={date} data={callsByDate[date]} filters={filters} />
          ))}
        </Container>
        <Backdrop open={speedDialOpen} style={{ zIndex: 10 }} />
        <AddNewButton open={speedDialOpen} setOpen={() => dispatch({ type: 'speedDialOpen' })} />
      </EmployeesContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;