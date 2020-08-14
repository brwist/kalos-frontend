import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransactionUserView } from './components/view';
import { Loader } from '../Loader/main';
import {
  loadUserById,
  UserType,
  getDepartmentByManagerID,
  getCustomerName,
  refreshToken,
} from '../../helpers';
import { PageWrapper } from '../PageWrapper/main';

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
    await refreshToken();
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
    <PageWrapper userID={userID}>
      {loading || !user ? (
        <Loader />
      ) : (
        <TransactionUserView
          userID={userID}
          userName={getCustomerName(user)}
          departmentId={user.employeeDepartmentId}
          isManager={isManager}
        />
      )}
    </PageWrapper>
  );
};

export default Transaction;
