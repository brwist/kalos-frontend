import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransactionUserView } from './components/view';
import { Loader } from '../Loader/main';
import {
  UserType,
  getDepartmentByManagerID,
  getCustomerName,
  refreshToken,
  UserClientService,
} from '../../helpers';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';

interface Props extends PageWrapperProps {
  userID: number;
  isProd?: boolean;
}

const Transaction: FC<Props> = props => {
  const { userID } = props;
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
    const user = await UserClientService.loadUserById(userID);
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
    <PageWrapper {...props}>
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
