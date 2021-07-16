import { UserClient } from '@kalos-core/kalos-rpc/User';
import { ENDPOINT } from '../../constants';
import {
  TimesheetDepartment,
  TimesheetDepartmentList,
} from '@kalos-core/kalos-rpc/TimesheetDepartment';
import { TimesheetDepartmentClientService } from '../../helpers';
import Sinon from 'sinon';

const u = new UserClient(ENDPOINT); // Needed to setup the auth token

let newTD = new TimesheetDepartment();
newTD.setDescription('Test');
console.log('NEW TD: ', newTD);

let newTDList = new TimesheetDepartmentList();
newTDList.setResultsList([]);

const setupStubs = () => {
  Sinon.stub(TimesheetDepartmentClientService, 'BatchGet').resolves(newTDList);
};

setupStubs();

export { u, setupStubs };
