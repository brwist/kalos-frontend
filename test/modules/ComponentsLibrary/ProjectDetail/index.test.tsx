export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import Constants = require('../../../test-constants/constants');

import User = require('@kalos-core/kalos-rpc/User');

import ProjectDetailModule = require('../../../../modules/ComponentsLibrary/ProjectDetail/index');

import LoaderModule = require('../../../../modules/Loader/main');

import UserProto = require('@kalos-core/kalos-rpc/compiled-protos/user_pb');

import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

// ? Commented because it isn't quite set up yet and does send requests to the dev server
// describe('ComponentsLibrary', () => {
//   describe('ProjectDetail', () => {
//     describe('<ProjectDetail userID={2573} loggedUserId={101253} propertyId={0} />', () => {
//       before(async () => {
//         let olbinski = new User.User();
//         olbinski.setId(2573);
//         olbinski.setFirstname('Krzysztof'); // So glad I had the database open with his name there
//         olbinski.setLastname('Olbinski');
//         let newPG = new UserProto.PermissionGroup();
//         newPG.setType('role');
//         newPG.setName('Payroll');
//         olbinski.setPermissionGroupsList([newPG]);
//         Stubs.setupStubs('UserClientService', 'loadUserById', olbinski, 2573);
//       });
//       after(() => {
//         Stubs.restoreStubs();
//       });
//       let wrapper: any;
//       beforeEach(() => {
//         console.log('Mounting');
//         wrapper = Enzyme.mount(
//           <ProjectDetailModule.ProjectDetail
//             userID={2573}
//             loggedUserId={101253}
//             propertyId={0}
//           />,
//         );
//         console.log('Done mounting');
//       });
//       afterEach(() => {
//         wrapper.unmount();
//       });

//       it('renders a "Customer / Property Details" title', () => {
//         Chai.expect(
//           wrapper.find({ title: 'Customer / Property Details' }),
//         ).to.be.lengthOf(1);
//       });
//     });
//   });
// });
