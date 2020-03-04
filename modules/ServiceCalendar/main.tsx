import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import { eachWeekOfInterval, endOfYear, startOfYear, getWeek } from 'date-fns';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
import { timestamp } from '../../helpers';
import Filter from './components/Filter';
import Column from './components/Column';
import AddNewButton from './components/AddNewButton';
import { useFetchAll } from './hooks';


type Props = {
  userId: number;
}

const userClient = new UserClient(ENDPOINT);

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
const thisYearWeeks = eachWeekOfInterval({
  start: startOfYear(today),
  end: endOfYear(today),
});
getWeek(today);

type State = {
  speedDialOpen: boolean;
  viewBy: string;
  shownDates: string[];
}

type Action =
  | { type: 'viewBy', value: string }
  | { type: 'speedDialOpen' };

const getShownDates = (viewBy, week) => {
  switch (viewBy) {
    case 'day':
      return [today];
    case 'week': {
      return ['2020-03-01', '2020-03-02', '2020-03-03', '2020-03-04', '2020-03-05', '2020-03-06', '2020-03-07'];
    }
    case 'month':
      return [];
    case 'year':
      return [];
    default:
      return [];
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'viewBy': {
      return {
        ...state,
        viewBy: action.value,
        shownDates: getShownDates(action.value),
      };
    }
    case 'speedDialOpen': {
      return {
        ...state,
        speedDialOpen: !state.speedDialOpen,
      };
    }
    default:
      return {...state};
  }
};

const initialState: State = {
  speedDialOpen: false,
  viewBy: 'week',
  week: getWeek(today),
  shownDates: getShownDates('week', getWeek(today)),
};

type EmployeesContext = {
  employees: User.AsObject[];
  employeesLoading: boolean;
};

export const EmployeesContext = createContext<EmployeesContext>({ employees: [], employeesLoading: false });

const ServiceCalendar = ({ userId }: Props) => {
  const classes = useStyles();
  const [{speedDialOpen, viewBy, shownDates, week}, dispatch] = useReducer(reducer, initialState);
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

  const changeViewBy = useCallback(value => {
    dispatch({ type: 'viewBy', value });
  }, []);

  const changeDate = useCallback(value => {
    dispatch({ type: `change_${viewBy}`, value });
  }, [viewBy]);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <EmployeesContext.Provider value={{ employees, employeesLoading }}>
        <Filter
          viewBy={viewBy}
          changeViewBy={changeViewBy}
          changeDate={changeDate}
          thisYearWeeks={thisYearWeeks}
          week={week}
        />
        <Container className={classes[viewBy]} maxWidth={false}>
          {shownDates.map(date => (
            <Column key={date} date={date} />
          ))}
        </Container>
        <Backdrop open={speedDialOpen} style={{ zIndex: 10 }} />
        <AddNewButton open={speedDialOpen} setOpen={() => dispatch({ type: 'speedDialOpen' })} />
      </EmployeesContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;