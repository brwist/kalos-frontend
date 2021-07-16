/*
    NOTE The client services are interfaced here of all places because if they are required then the reference to the exact client
    service used during execution of the test is lost. As a result, Sinon cannot use them. I'm open to suggestions on how to 
    make this better! If someone finds a way to import that while maintaining the stub inside a test file, that would be absolutely
    amazing!
*/

import { TimesheetDepartmentList } from '@kalos-core/kalos-rpc/TimesheetDepartment';
import Sinon from 'sinon';
import * as Helpers from '../../helpers';

let newTDList = new TimesheetDepartmentList();
newTDList.setResultsList([]);

let sandbox = Sinon.createSandbox();

/**
 * @param  {string} clientService The client service to set up a stub for
 * @param  {string} method The method to stub out
 * @param  {any} result The result to be given for the stub
 * @param {any} args The arguments to be passed to the function being mocked to give the result (IE a "req" variable)
 * @example setupStubs("UserClientService", "BatchGet", []);
 * @returns void
 */
const setupStubs = (
  clientService: string,
  method: string,
  result: any,
  args?: any,
) => {
  try {
    args
      ? sandbox
          .stub((Helpers as any)[clientService as any], method as any)
          .withArgs(args)
          .resolves(result)
      : sandbox
          .stub((Helpers as any)[clientService as any], method as any)
          .resolves(result);
  } catch (err) {
    console.error(
      `An error occurred while setting up stubs (are you sure you spelled the name of the client service and corresponding method correctly?): ${err}`,
    );
  }
};
/**
 * Restores stubs to their original state before the tests messed with them
 */
const restoreStubs = () => {
  sandbox.restore();
};

export { setupStubs, restoreStubs };
