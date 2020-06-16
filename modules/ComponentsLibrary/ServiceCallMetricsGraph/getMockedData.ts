import { format, addDays } from 'date-fns';
import { getRandomDigit } from '../helpers';
import { formatDate } from '../../../helpers';
import { Data } from './';

export default () => {
  const d = new Date();
  let serviceCalls = 0;
  let phoneCalls = 0;
  let activeCustomers = 0;
  let totalCustomers = 0;
  let totalContracts = 0;
  let totalInstallationTypeCalls = 0;
  const data: Data = [];
  [...Array(80)].forEach((_, idx) => {
    serviceCalls += 4 * getRandomDigit();
    phoneCalls += 3 * getRandomDigit();
    activeCustomers += 2 * getRandomDigit();
    totalCustomers += getRandomDigit();
    totalContracts = 30 * getRandomDigit();
    totalInstallationTypeCalls = 5 * getRandomDigit();
    data.push({
      name: formatDate(format(addDays(d, -idx * 7), 'yyyy-MM-dd')),
      serviceCalls,
      phoneCalls,
      activeCustomers,
      totalCustomers,
      totalContracts,
      totalInstallationTypeCalls,
    });
  });
  return data;
};
