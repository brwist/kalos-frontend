import UserModule = require('@kalos-core/kalos-rpc/User');
import TransactionModule = require('@kalos-core/kalos-rpc/Transaction');
import TimesheetDepartmentModule = require('@kalos-core/kalos-rpc/TimesheetDepartment/index');
export const getFakeUserData = () => {
  let TestTesterman = new UserModule.User();
  TestTesterman.setFirstname('Test');
  TestTesterman.setLastname('Testerman');
  TestTesterman.setId(0);
  TestTesterman.setPhone('888-222-1111');
  TestTesterman.setEmail('test-testerman@kalosflorida.com');
  TestTesterman.setAddress('1332 66 Ave');
  TestTesterman.setCity('Grand Forks');
  TestTesterman.setState('BC V0H 1H0');

  return [TestTesterman];
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

export const getFakeTransactions = () => {
  let testTxn = new TransactionModule.Transaction();
  testTxn.setAmount(69.69);
  testTxn.setDescription(
    'This is a test transaction that should be easy to understand and test for.',
  );
  testTxn.setId(0);
  testTxn.setIsActive(1);

  return [testTxn];
};
