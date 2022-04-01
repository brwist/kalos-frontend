export {};

/*
    ! This module is a temporary test to show off how to construct proper unit tests. 
*/

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import User = require('../../../@kalos-core/kalos-rpc/User');

import TestModule = require('../../../../modules/ComponentsLibrary/Test/index');

import LoaderModule = require('../../../../modules/Loader/main');

import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

import ConstantsModule = require('../../../test-constants/constants');
// ? Commented because it isn't quite set up yet and does send requests to the dev server
describe('ComponentsLibrary', () => {
  describe('Test', () => {
    describe('<Test />', () => {
      before(async () => {
        // Changed this to being Mary as well for consistency, you can see I changed that in the actual module too (otherwise it fails)
        let res = new User.User();
        res.setFirstname('Mary');
        res.setLastname('Orr');

        let req = new User.User();
        req.setFirstname('Mary');
        req.setLastname('Orr');
        Stubs.setupStubs('UserClientService', 'Get', req, res);
      });
      after(() => {
        Stubs.restoreStubs();
      });
      let wrapper: Enzyme.ReactWrapper;
      beforeEach(() => {
        wrapper = Enzyme.mount(<TestModule.Test />);
      });
      afterEach(() => {
        wrapper.unmount();
      });

      it('renders a loader when it is loading', () => {
        wrapper.update();
        Chai.expect(
          wrapper.containsAllMatchingElements([<LoaderModule.Loader />]),
        ).to.be.eql(true);
      });

      it('shows a button when loaded', async () => {
        await ConstantsModule.ReRenderAfterLoad();
        wrapper.update();

        Chai.expect(
          wrapper.find({ label: 'Click to See User Name' }),
        ).to.be.lengthOf(1);
      });

      it('shows a modal with the text of the correct username when the button is clicked', async () => {
        await ConstantsModule.ReRenderAfterLoad();
        wrapper.update();
        wrapper.find({ label: 'Click to See User Name' }).simulate('click');

        wrapper.update();

        Chai.expect(
          wrapper
            .find('.MuiPaper-root')
            .filterWhere(
              wrapperElement =>
                wrapperElement.text() === 'The user is Mary Orr',
            ),
        ).to.be.lengthOf(1);
      });
    });
  });
});
