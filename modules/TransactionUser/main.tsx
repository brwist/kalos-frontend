import React, { FC, useState, useEffect, useCallback } from 'react';
import { TransactionUserView } from './components/view';
import { Loader } from '../Loader/main';
import { UserType, UserClientService } from '../../helpers';
import { ENDPOINT, PERMISSION_NAME_MANAGER } from '../../constants';
import { PageWrapper, PageWrapperProps } from '../PageWrapper/main';
import { User } from '@kalos-core/kalos-rpc/User';
import { RoleType } from '../ComponentsLibrary/Payroll';
import { Button } from '../ComponentsLibrary/Button';
import { Modal } from '../ComponentsLibrary/Modal';

import { UploadPhotoTransaction } from '../ComponentsLibrary/UploadPhotoTransaction';
import {
  TransactionAccountList,
  TransactionAccount,
  TransactionAccountClient,
} from '@kalos-core/kalos-rpc/TransactionAccount';
import { SectionBar } from '../ComponentsLibrary/SectionBar';

interface Props extends PageWrapperProps {
  userID: number;
  isProd?: boolean;
}

const Transaction: FC<Props> = props => {
  const { userID } = props;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [
    uploadPhotoTransactionOpen,
    setUploadPhotoTransactionOpen,
  ] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [costCenters, setCostCenters] = useState<TransactionAccountList>();
  const [isManager, setIsManager] = useState<boolean>(false);
  const [toggleAddTransaction, setToggleAddTransaction] = useState<boolean>(
    false,
  );
  const [managerDepartmentIds, setManagerDepartmentIds] = useState<number[]>(
    [],
  );
  const [role, setRole] = useState<RoleType>();

  const managerCheck = useCallback(async (u: User.AsObject) => {
    const pg = u.permissionGroupsList.filter(
      pg => pg.name === PERMISSION_NAME_MANAGER,
    );
    if (pg.length > 0) {
      return true;
    }
    return false;
  }, []);

  const handleSetUploadPhotoTransactionOpen = useCallback(
    (isOpen: boolean) => {
      setUploadPhotoTransactionOpen(isOpen);
    },
    [setUploadPhotoTransactionOpen],
  );

  const loadCostCenters = useCallback(async () => {
    const req = new TransactionAccount();
    req.setIsActive(1);
    const results = await new TransactionAccountClient(ENDPOINT).BatchGet(req);
    setCostCenters(results);
  }, [setCostCenters]);

  const load = useCallback(async () => {
    setLoading(true);
    await loadCostCenters();
    //await UserClientService.refreshToken();
    const user = await UserClientService.loadUserById(userID);
    setUser(user);
    const foundRole = user.permissionGroupsList.find(p => p.type === 'role');
    if (foundRole) {
      setRole(foundRole.name as RoleType);
    }
    const isManager = await managerCheck(user);
    const groupDepartments = user.permissionGroupsList.filter(
      group => group.type === 'department',
    );
    const totalDepartments = [];

    for (let i = 0; i < groupDepartments.length; i++) {
      let permissionObj = JSON.parse(groupDepartments[i].filterData);
      totalDepartments.push(permissionObj.value);
    }
    setManagerDepartmentIds(totalDepartments);
    console.log(totalDepartments);
    setIsManager(isManager || role === 'Manager');
    setLoading(false);
  }, [setLoading, userID, managerCheck, role]);
  useEffect(() => {
    if (!loaded || !user) {
      setLoaded(true);
      load();
    }
  }, [loaded, setLoaded, load, user]);
  const handleToggleAddTransaction = (value: boolean) => {
    setToggleAddTransaction(value);
  };
  return (
    <PageWrapper {...props}>
      {loading || !user ? (
        <Loader />
      ) : (
        <React.Fragment>
          {uploadPhotoTransactionOpen && (
            <Modal
              open
              onClose={() => handleSetUploadPhotoTransactionOpen(false)}
            >
              <UploadPhotoTransaction
                loggedUserId={props.userID}
                bucket="kalos-pre-transactions"
                onClose={() => handleSetUploadPhotoTransactionOpen(false)}
                costCenters={
                  costCenters ? costCenters : new TransactionAccountList()
                }
              />
            </Modal>
          )}
          {role === 'Accounts_Payable' ? (
            <Button
              label="Add Transaction"
              onClick={() => handleToggleAddTransaction(true)}
            />
          ) : (
            React.Fragment
          )}
          {toggleAddTransaction ? (
            <Modal
              open={toggleAddTransaction}
              onClose={() => handleToggleAddTransaction(false)}
            >
              <UploadPhotoTransaction
                loggedUserId={userID}
                bucket="kalos-transactions"
                costCenters={
                  costCenters ? costCenters : new TransactionAccountList()
                }
                onClose={() => handleToggleAddTransaction(false)}
              />
            </Modal>
          ) : null}
          {
            <SectionBar
              actions={[
                {
                  label: 'Upload Pick Ticket or Receipt',
                  onClick: () => handleSetUploadPhotoTransactionOpen(true),
                  fixed: true,
                },
              ]}
            />
          }
          <TransactionUserView
            userID={userID}
            userName={UserClientService.getCustomerName(user)}
            departmentId={user.employeeDepartmentId}
            departmentList={managerDepartmentIds}
            isManager={isManager}
            role={role}
            loggedUserId={userID}
          />
        </React.Fragment>
      )}
    </PageWrapper>
  );
};

export default Transaction;
