export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import User = require('../../../@kalos-core/kalos-rpc/User');

import EventModule = require('../../../@kalos-core/kalos-rpc/Event');
import PropertyModule = require('../../../@kalos-core/kalos-rpc/Property');

import ProjectDetailModule = require('../../../../modules/ComponentsLibrary/ProjectDetail/index');

import LoaderModule = require('../../../../modules/Loader/main');

import UserProto = require('../../../@kalos-core/kalos-rpc/compiled-protos/user_pb');
import TimesheetDepartmentProto = require('../../../@kalos-core/kalos-rpc/TimesheetDepartment');

import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

// ? Commented because it isn't quite set up yet and does send requests to the dev server
describe('ComponentsLibrary', () => {
  describe('ProjectDetail', () => {
    describe('<ProjectDetail userID={2573} loggedUserId={101253} propertyId={0} />', () => {
      before(async () => {
        let olbinski = new User.User();
        olbinski.setId(2573);
        olbinski.setFirstname('Krzysztof'); // So glad I had the database open with his name there
        olbinski.setLastname('Olbinski');
        let newPG = new UserProto.PermissionGroup();
        newPG.setType('role');
        newPG.setName('Payroll');
        olbinski.setPermissionGroupsList([newPG]);
        Stubs.setupStubs('UserClientService', 'loadUserById', olbinski, 2573);

        let projectsReq = new EventModule.Event();
        projectsReq.setNotEqualsList(['DepartmentId']);
        projectsReq.setPageNumber(0);
        projectsReq.setOrderBy('date_started');
        projectsReq.setOrderDir('ASC');
        projectsReq.setWithoutLimit(true);

        let projectsRes = new EventModule.Event();
        projectsRes.setId(86246);
        projectsRes.setName('Test Event');
        projectsRes.setDescription('Testing this out');
        projectsRes.setDateStarted('2020-01-12 01:01:00');
        projectsRes.setDateEnded('2021-08-01 12:01:00');
        projectsRes.setIsActive(1);
        projectsRes.setNotes('This is a test project');
        projectsRes.setPropertyId(256);
        projectsRes.setDateUpdated('2020-01-12 00:00:00');
        projectsRes.setIsAllDay(0);
        projectsRes.setIsLmpc(0);
        projectsRes.setIsResidential(0);
        projectsRes.setParentId(114);

        let projectsResList = new EventModule.EventList();
        projectsResList.setResultsList([projectsRes]);

        Stubs.setupStubs('EventClientService', 'BatchGet', projectsResList);

        let propertyReq = new PropertyModule.Property();
        propertyReq.setId(0);
        propertyReq.setIsActive(1);

        let propertyRes = new PropertyModule.Property();
        propertyRes.setId(0);
        propertyRes.setIsActive(1);
        propertyRes.setAddress('Testing address!!!');

        Stubs.setupStubs(
          'PropertyClientService',
          'Get',
          propertyRes,
          propertyReq,
        );

        let eventReq = new EventModule.Event();
        eventReq.setId(0);

        let eventRes = new EventModule.Event();
        eventRes.setId(0);
        eventRes.setName('Testing project #1');
        eventRes.setDepartmentId(100);
        eventRes.setDescription('Testing this out');
        eventRes.setDateStarted('2020-01-12 01:01:00');
        eventRes.setDateEnded('2021-08-01 12:01:00');
        eventRes.setIsActive(1);
        eventRes.setNotes('This is a test project');
        eventRes.setPropertyId(256);
        eventRes.setDateUpdated('2020-01-12 00:00:00');
        eventRes.setIsAllDay(0);
        eventRes.setIsLmpc(0);
        eventRes.setIsResidential(0);
        eventRes.setParentId(114);

        Stubs.setupStubs('EventClientService', 'Get', eventRes, eventReq);

        let tdReq = new TimesheetDepartmentProto.TimesheetDepartment();
        tdReq.setId(100);

        let tdRes = new TimesheetDepartmentProto.TimesheetDepartment();
        tdRes.setId(100);
        tdRes.setDescription('Test');
        tdRes.setValue('A test timesheet department');

        Stubs.setupStubs(
          'TimesheetDepartmentClientService',
          'Get',
          tdReq,
          tdRes,
        );
      });
      after(() => {
        Stubs.restoreStubs();
      });
      let wrapper: Enzyme.ReactWrapper;
      beforeEach(() => {
        wrapper = Enzyme.mount(
          <ProjectDetailModule.ProjectDetail
            userID={2573}
            loggedUserId={101253}
            propertyId={0}
          />,
        );
      });
      afterEach(() => {
        wrapper.unmount();
      });

      it('renders a "Customer / Property Details" title', () => {
        Chai.expect(
          wrapper.find({ title: 'Customer / Property Details' }),
        ).to.be.lengthOf(1);
      });

      it('renders a loader when it is loading', () => {
        Chai.expect(
          wrapper.containsAllMatchingElements([<LoaderModule.Loader />]),
        ).to.be.equal(true);
      });

      it('renders a "General" tab', async () => {
        await new Promise(res => setTimeout(res, 1));
        Chai.expect(wrapper.find({ label: 'General' })).to.have.lengthOf(2);
      });

      it('renders a "Equipment" tab', async () => {
        await new Promise(res => setTimeout(res, 1));
        Chai.expect(wrapper.find({ label: 'Equipment' })).to.have.lengthOf(2);
      });

      it('renders a "Billing" tab', async () => {
        await new Promise(res => setTimeout(res, 1));
        Chai.expect(wrapper.find({ label: 'Billing' })).to.have.lengthOf(2);
      });

      it('renders a "Logs" tab', async () => {
        await new Promise(res => setTimeout(res, 1));
        Chai.expect(wrapper.find({ label: 'Logs' })).to.have.lengthOf(2);
      });

      it('renders a "Create" tab', async () => {
        await new Promise(res => setTimeout(res, 1));
        Chai.expect(wrapper.find({ label: 'Create' })).to.have.lengthOf(2);
      });

      // describe('Customer / Property Details Info Table', async () => {
      //   it('displays the proper customer name', async () => {
      //     await new Promise(res => setTimeout(res, 1000));
      //     wrapper.update();

      //     Chai.expect(
      //       wrapper.find('.InfoTableValueContent').first().text(),
      //     ).to.be.equal('Krzysztof Olbinski');
      //   });
      // });
    });
  });
});
