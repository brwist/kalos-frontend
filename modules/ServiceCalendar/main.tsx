import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User, UserClient } from '@kalos-core/kalos-rpc/User';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import customTheme from '../Theme/main';
import {ENDPOINT} from '../../constants';
import { timestamp } from '../../helpers';
import Column from './components/Column';
import AddNewButton from './components/AddNewButton';
import { useFetchAll } from './hooks';

type Props = {
  userId: number;
}

const userClient = new UserClient(ENDPOINT);

type EmployeesContext = {
  employees: User.AsObject[];
  employeesLoading: boolean;
};

export const EmployeesContext = createContext<EmployeesContext>({ employees: [], employeesLoading: false });

const ServiceCalendar = ({ userId }: Props) => {
  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);
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

  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      <EmployeesContext.Provider value={{ employees, employeesLoading }}>
        {/*<Filter></Filter>*/}
        <Container>
          <Column date={`${timestamp(true)} 00:00:00%`} />
        </Container>
        <Backdrop open={speedDialOpen} style={{ zIndex: 10 }} />
        <AddNewButton open={speedDialOpen} setOpen={setSpeedDialOpen} />
      </EmployeesContext.Provider>
    </ThemeProvider>
  );
};

export default ServiceCalendar;