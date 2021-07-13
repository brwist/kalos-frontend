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
} = require('@kalos-core/kalos-rpc/TimesheetDepartment');

const Payroll = require(GetPathFromName(
  'Payroll',
  'ComponentsLibrary',
)).Payroll;

const Timesheet = require(`${GetPathFromName(
  'Payroll',
  'ComponentsLibrary',
)}/components/Timesheet`).Timesheet;
const React = require('react');
const mount = require('enzyme').mount;
const OPTION_ALL = require('../../../../constants').OPTION_ALL;

const expect = require('chai').expect;

const Setup = require('../../../test-setup/endpoint-setup.js'); // ? Sets the auth token up in a one-liner

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
    describe('<Payroll userID={101253} />', () => {
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
    });

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
