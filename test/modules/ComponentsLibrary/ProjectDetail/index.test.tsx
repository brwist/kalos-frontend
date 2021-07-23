export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import Constants = require('../../../test-constants/constants');

import User = require('@kalos-core/kalos-rpc/User');

import EventModule = require('@kalos-core/kalos-rpc/Event');

import ProjectDetailModule = require('../../../../modules/ComponentsLibrary/ProjectDetail/index');

import LoaderModule = require('../../../../modules/Loader/main');

import UserProto = require('@kalos-core/kalos-rpc/compiled-protos/user_pb');

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
        projectsRes.setDateStarted('2020-01-12 00:00:00');
        projectsRes.setDateEnded('2021-08-01 00:00:00');

        let projectsResList = new EventModule.EventList();
        projectsResList.setResultsList([projectsRes]);

        Stubs.setupStubs('EventClientService', 'BatchGet', projectsResList);
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
    });
  });
});
