import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransactionUserView } from './components/view';
import Grid from '@material-ui/core/Grid';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import customTheme from '../Theme/main';
import { Loader } from '../Loader/main';
import {
  loadUserById,
  UserType,
  getDepartmentByManagerID,
  getCustomerName,
} from '../../helpers';

interface Props {
  userID: number;
  isProd?: boolean;
}

const Transaction: FC<Props> = ({ userID }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType>();
  const [isManager, setIsManager] = useState<boolean>(false);
  const managerCheck = useCallback(async () => {
    try {
      await getDepartmentByManagerID(userID);
      return true;
    } catch (e) {
      return false;
    }
  }, [userID]);
  const load = useCallback(async () => {
    setLoading(true);
    const user = await loadUserById(userID);
    const isManager = await managerCheck();
    setUser(user);
    setIsManager(isManager);
    setLoading(false);
  }, [setLoading, userID, managerCheck]);
  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load]);
  return (
    <ThemeProvider theme={customTheme.lightTheme}>
      {loading || !user ? (
        <Loader />
      ) : (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="flex-start"
        >
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            style={{ maxHeight: '100%' }}
          >
            <TransactionUserView
              userID={userID}
              userName={getCustomerName(user)}
              departmentId={user.employeeDepartmentId}
              isManager={isManager}
            />
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default Transaction;
