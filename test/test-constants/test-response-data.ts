import UserModule = require('@kalos-core/kalos-rpc/User');
import TransactionModule = require('@kalos-core/kalos-rpc/Transaction');
import TransactionActivityModule = require('@kalos-core/kalos-rpc/TransactionActivity');
import TimesheetDepartmentModule = require('@kalos-core/kalos-rpc/TimesheetDepartment/index');
import DateFns = require('date-fns');
export const getFakeUser = (userId: number) => {
  let TestTesterman = new UserModule.User();
  TestTesterman.setFirstname('Test');
  TestTesterman.setLastname('Testerman');
  TestTesterman.setId(userId);
  TestTesterman.setPhone('888-222-1111');
  TestTesterman.setEmail('test-testerman@kalosflorida.com');
  TestTesterman.setAddress('1332 66 Ave');
  TestTesterman.setCity('Grand Forks');
  TestTesterman.setState('BC V0H 1H0');
  return TestTesterman;
};

export const getFakeUserData = () => {
  return [getFakeUser(0)];
};

export const getFakeTimesheetDepartments = () => {
  let ServiceOther = new TimesheetDepartmentModule.TimesheetDepartment();
  ServiceOther.setId(22);
  ServiceOther.setValue('O');
  ServiceOther.setDescription('(Service, Other) Bryan Orr');
  ServiceOther.setManagerId(336);
  ServiceOther.setIsActive(1);

  return [ServiceOther];
};

export const getFakeTransactionList = () => {
  let testTxn = new TransactionModule.Transaction();
  testTxn.setAmount(69.69);
  testTxn.setDescription(
    'This is a test transaction that should be easy to understand and test for.',
  );
  testTxn.setId(100);
  testTxn.setIsActive(1);

  let testTxnList = new TransactionModule.TransactionList();
  testTxnList.setResultsList([testTxn]);
  testTxnList.setTotalCount(1);

  return testTxnList;
};

export const getFakeActivityLogList = (
  transactionId: number,
  userId?: number,
) => {
  let testLog = new TransactionActivityModule.TransactionActivity();
  testLog.setTransactionId(transactionId);
  testLog.setDescription('Did something important that was logged');
  testLog.setTimestamp(DateFns.format(new Date(), 'yyyy-MM-dd hh:mm:ss'));
  testLog.setIsActive(1);
  testLog.setUserId(userId ? userId : 0);

  let testList = new TransactionActivityModule.TransactionActivityList();
  testList.setResultsList([testLog]);

  return testList;
};
