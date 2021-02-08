import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransactionUserView } from './components/view';
import { Loader } from '../Loader/main';
import {
  UserType,
  getCustomerName,
  UserClientService,
  TimesheetDepartmentClientService,
} from '../../helpers';
import { PERMISSION_NAME_MANAGER } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { User } from '@kalos-core/kalos-rpc/User';

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
  const managerCheck = useCallback(
    async (u: User.AsObject) => {
      try {
        await TimesheetDepartmentClientService.getDepartmentByManagerID(userID);
        return true;
      } catch (e) {
        const pg = u.permissionGroupsList.filter(
          pg => pg.name === PERMISSION_NAME_MANAGER,
        );
        if (pg.length > 0) {
          return true;
        }
        return false;
      }
    },
    [userID],
  );
  const load = useCallback(async () => {
    setLoading(true);
    await UserClientService.refreshToken();
    const user = await UserClientService.loadUserById(userID);
    setUser(user);
    const isManager = await managerCheck(user);
    setIsManager(isManager);
    setLoading(false);
  }, [setLoading, userID, managerCheck]);
  useEffect(() => {
    if (!loaded || !user) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load, user]);
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
