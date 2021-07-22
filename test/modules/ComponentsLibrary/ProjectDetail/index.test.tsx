export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const GetPathFromName =
  require('../../../test-constants/constants').GetPathFromName;

const { User } = require('@kalos-core/kalos-rpc/User');

const ProjectDetail = require(GetPathFromName(
  'ProjectDetail',
  'ComponentsLibrary',
)).ProjectDetail;

const Loader = require(`../../../../modules/Loader/main`).Loader;

const PermissionGroup =
  require(`@kalos-core/kalos-rpc/compiled-protos/user_pb`).PermissionGroup;

const React = require('react');
const mount = require('enzyme').mount;

const expect = require('chai').expect;

const Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

describe('ComponentsLibrary', () => {
  describe('ProjectDetail', () => {
    describe('<ProjectDetail userID={2573} loggedUserId={101253} propertyId={0} />', () => {
      before(async () => {
        let olbinski = new User();
        olbinski.setId(2573);
        olbinski.setFirstname('Krzysztof'); // So glad I had the database open with his name there
        olbinski.setLastname('Olbinski');
        let newPG = new PermissionGroup();
        newPG.setType('role');
        newPG.setName('Payroll');
        olbinski.setPermissionGroupsList([newPG]);
        Stubs.setupStubs('UserClientService', 'loadUserById', olbinski, 2573);
      });
      after(() => {
        Stubs.restoreStubs();
      });
      let wrapper: any;
      beforeEach(async () => {
        console.log('Mounting');
        wrapper = await mount(
          <ProjectDetail userID={2573} loggedUserId={101253} propertyId={0} />,
        );
        console.log('Done mounting');
      });
      afterEach(() => {
        wrapper.unmount();
      });

      it.only('renders a "Customer / Property Details" title', () => {
        expect(
          wrapper.find({ title: 'Customer / Property Details' }),
        ).to.be.lengthOf(1);
      });
    });
  });
});
