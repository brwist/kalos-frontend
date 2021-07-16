export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const GetPathFromName =
  require('../../../test-constants/constants').GetPathFromName;

const TimesheetDepartmentClientService =
  require('../../../../helpers.ts').TimesheetDepartmentClientService;
const UserClientService = require('../../../../helpers.ts').UserClientService;

const {
  TimesheetDepartment,
  TimesheetDepartmentList,
} = require('@kalos-core/kalos-rpc/TimesheetDepartment');

const { User } = require('@kalos-core/kalos-rpc/User');

const Payroll = require(GetPathFromName(
  'Payroll',
  'ComponentsLibrary',
)).Payroll;

const Loader = require(`../../../../modules/Loader/main`).Loader;

const PermissionGroup =
  require(`@kalos-core/kalos-rpc/compiled-protos/user_pb`).PermissionGroup;

const Timesheet = require(`${GetPathFromName(
  'Payroll',
  'ComponentsLibrary',
)}/components/Timesheet`).Timesheet;
const React = require('react');
const mount = require('enzyme').mount;
const OPTION_ALL = require('../../../../constants').OPTION_ALL;

const expect = require('chai').expect;

const Setup = require('../../../test-setup/endpoint-setup'); // ? Sets the auth token up in a one-liner
const Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

const getDepartmentId = async () => {
  const depReq = new TimesheetDepartment();
  depReq.setIsActive(1);
  const departments = await (
    await TimesheetDepartmentClientService.BatchGet(depReq)
  ).getResultsList();
  return departments[0].getId();
};

const getRole = async () => {
  const loggedUser = await UserClientService.loadUserById(1550);
  const role = loggedUser
    .getPermissionGroupsList()
    .find((p: any) => p.getType() === 'role');
  if (role) {
    return role.getName();
  }
  return 'Payroll';
};

describe('ComponentsLibrary', () => {
  describe('Payroll', () => {
    describe('$ Payroll Role', () => {
      describe('<Payroll userID={101253} />', () => {
        before(() => {
          let newTDList = new TimesheetDepartmentList();
          newTDList.setResultsList([]); // ? Could set up the results here
          Stubs.setupStubs(
            'TimesheetDepartmentClientService',
            'BatchGet',
            newTDList,
          );

          // Maybe when this is a little more fleshed out, we can pull db data and use JSON.Parse on that for this data?
          let maryOrr = new User();
          maryOrr.setId(3);
          maryOrr.setFirstname('Mary');
          maryOrr.setLastname('Orr');
          maryOrr.setEmail('Mary@Kalosflorida.com');

          let robertOrr = new User();
          robertOrr.setId(68);
          robertOrr.setFirstname('Robert');
          robertOrr.setLastname('Orr');
          robertOrr.setEmail('Robert@Kalosflorida.com');

          let newTechnicianList = [robertOrr, maryOrr];

          Stubs.setupStubs(
            'UserClientService',
            'loadTechnicians',
            newTechnicianList,
          );

          let olbinski = new User();
          olbinski.setId(101253);
          olbinski.setFirstname('Krzysztof'); // So glad I had the database open with his name there
          olbinski.setLastname('Olbinski');

          let newPG = new PermissionGroup();
          newPG.setType('role');
          newPG.setName('Payroll');
          olbinski.setPermissionGroupsList([newPG]);

          Stubs.setupStubs(
            'UserClientService',
            'loadUserById',
            olbinski,
            101253,
          );
        });
        after(() => {
          Stubs.restoreStubs();
        });
        let wrapper: any;
        beforeEach(async () => {
          wrapper = await mount(<Payroll userID={101253} />);
        });
        afterEach(() => {
          wrapper.unmount();
        });
        it('has a Payroll title', () => {
          expect(wrapper.find({ title: 'Payroll' })).to.have.lengthOf(1);
        });
        it('has a loader when loading', () => {
          expect(wrapper.containsAllMatchingElements([<Loader />])).to.equal(
            true,
          );
        });
        it('loads correctly with no loader remaining', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.containsAllMatchingElements([<Loader />])).to.equal(
            false,
          );
        });

        it('loads a "Timesheet" title in the default page', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ title: 'Timesheet' })).to.be.lengthOf(1);
        });

        it('loads two "Timesheet" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Timeoff Requests' })).to.be.lengthOf(2);
        });

        it('loads two "Timeoff Request" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Timeoff Requests' })).to.be.lengthOf(2);
        });

        it('loads two "Spiff/Bonus/Commission" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(
            wrapper.find({ label: 'Spiff/Bonus/Commission' }),
          ).to.be.lengthOf(2);
        });

        it('loads two "Tool Logs" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Tool Logs' })).to.be.lengthOf(2);
        });

        it('loads two "Per Diem" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Per Diem' })).to.be.lengthOf(2);
        });

        it('loads two "Trips" labels for the tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Trips' })).to.be.lengthOf(2);
        });

        it('loads no "Employee Report" labels for the tab while not a Manager', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          expect(wrapper.find({ label: 'Employee Report' })).to.be.lengthOf(0);
        });

        it('can switch to the "Timeoff Requests" tab', async () => {
          await new Promise(res => setTimeout(res, 1)); // ! Updates the wrapper after the time has passed to "load"
          wrapper.update();
          wrapper.find({ label: 'Timeoff Requests' }).first().simulate('click');
          wrapper.update();
          expect(wrapper.find({ title: 'Timeoff Requests' })).to.be.lengthOf(1);
        });
      });

      // NOTE These are now technically Integration Tests so I'm gonna keep them around for now, they don't run in watch mode after all so no harm no foul
      describe('RPC', () => {
        // ? Uses RPCs to load the dependencies as the Timesheet tab does
        before(async () => {
          await Setup.u.GetToken('test', 'test');
        });

        describe('Timesheet tab', () => {
          let wrapper: any;
          beforeEach(async () => {
            const deptId = await getDepartmentId();
            const role = await getRole();
            wrapper = await mount(
              <Timesheet
                departmentId={deptId}
                employeeId={0}
                week={OPTION_ALL}
                type={role}
                loggedUser={1550}
              />,
            );
          });
          it('renders timesheet with a timesheet title', async () => {
            expect(wrapper.find({ title: 'Timesheet' })).to.have.lengthOf(1);
          });

          it('renders timesheet with a Department title in the info table', async () => {
            let contained = false;
            wrapper.find('.InfoTableDir').forEach((result: any) => {
              if (result.text().trim() === 'Department') contained = true;
            });
            expect(contained).to.equal(true);
          });

          it('renders timesheet with a Employee title in the info table', async () => {
            let contained = false;
            wrapper.find('.InfoTableDir').forEach((result: any) => {
              if (result.text().trim() === 'Employee') contained = true;
            });
            expect(contained).to.equal(true);
          });

          it('renders timesheet with a Week Approved title in the info table', async () => {
            let contained = false;
            wrapper.find('.InfoTableDir').forEach((result: any) => {
              if (result.text().trim() === 'Week Approved') contained = true;
            });
            expect(contained).to.equal(true);
          });
        });
      });
    });
  });
});
