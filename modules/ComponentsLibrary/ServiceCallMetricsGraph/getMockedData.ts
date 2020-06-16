import { format, addDays } from 'date-fns';
import { getRandomDigit } from '../helpers';
import { formatDate } from '../../../helpers';
import { Data } from './';

const COUNT = 80;

export default (() => {
  const d = new Date();
  let serviceCalls = 0;
  let phoneCalls = 0;
  let activeCustomers = 0;
  let totalCustomers = 0;
  let totalContracts = 0;
  let totalInstallationTypeCalls = 0;
  const data: Data = [];
  [...Array(COUNT)].forEach((_, idx) => {
    serviceCalls += 4 * getRandomDigit();
    phoneCalls += 3 * getRandomDigit();
    activeCustomers += 2 * getRandomDigit();
    totalCustomers += getRandomDigit();
    totalContracts = 30 * getRandomDigit();
    totalInstallationTypeCalls = 5 * getRandomDigit();
    data.push({
      date: formatDate(
        format(addDays(d, -(COUNT - idx - 1) * 7), 'yyyy-MM-dd'),
      ),
      serviceCalls,
      phoneCalls,
      activeCustomers,
      totalCustomers,
      totalContracts,
      totalInstallationTypeCalls,
    });
  });
  return data;
})();
