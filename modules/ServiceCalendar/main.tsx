import React, {createContext, useEffect, useReducer} from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
import { timestamp } from '../../helpers';
import Column from './components/Column';
import { useGetAll } from './hooks';

type Props = {
  userId: number;
}

type State = {
  employees: User.AsObject[];
  isLoading: boolean;
  totalCount: number,
  fetchedCount: number,
  page: number,
}

type Action =
  | { type: 'toggleLoading' }
  | { type: 'addData', data: User.AsObject[], totalCount: number, page: number };

const userClient = new UserClient(ENDPOINT);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case 'addData': {
    return {
      ...state,
      employees: [...state.employees, ...action.data],
      totalCount: action.totalCount,
      fetchedCount: state.fetchedCount + action.data.length,
      page: action.page,
    };
  }
  case 'toggleLoading': {
    return {
      ...state,
      isLoading: !state.isLoading,
    };
  }
  default:
    return {...state};
  }
};

const initialState: State = {
  isLoading: false,
  employees: [],
  totalCount: 0,
  fetchedCount: 0,
  page: 0,
};

export const EmployeesContext = createContext({ employees: [], isLoading: false });

const ServiceCalendar = ({ userId }: Props) => {
  const [
    {
      employees,
      isLoading,
      fetchedCount,
      totalCount,
      page
    },
    dispatch
  ] = useReducer(reducer, initialState);
  /* TODO make a hook
  const fetchEmployees = useGetAll(0, async () => {
    const user = new User();
    user.setIsActive(1);
    user.setIsEmployee(1);
    user.setPageNumber(0);
    const res = (await userClient.BatchGet(user)).toObject();
    return res;
  });
  */
  
  const fetchEmployees = (page = 0) => {
    (async () => {
      const user = new User();
      user.setIsActive(1);
      user.setIsEmployee(1);
      user.setPageNumber(page);
      const res = (await userClient.BatchGet(user)).toObject();
      await dispatch({ type: 'addData', data: res.resultsList, totalCount: res.totalCount, page });
    })();
  };
  useEffect(() => {
    userClient.GetToken('test', 'test');
    fetchEmployees();
  }, []);

  useEffect(() => {
    if(fetchedCount < totalCount) {
      fetchEmployees(page + 1);
    }
  }, [fetchedCount]);

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <EmployeesContext.Provider value={{ employees, employeesLoading: fetchedCount < totalCount }}>
        {/*<Filter></Filter>*/}
        <Container>
          <Column date={`${timestamp(true)} 00:00:00%`} />
        </Container>
      </EmployeesContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;
