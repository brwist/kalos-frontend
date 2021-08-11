export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import TransactionUserModule = require('../../../modules/TransactionUser/main');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

// Skipping as no test body yet, should fill it out after fixing up the client services in TransactionUser
describe.skip('TransactionUser', () => {
  describe('<Transaction userID={100153} withHeader />', () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(
        <TransactionUserModule.default userID={8418} withHeader />,
      );
    });
    after(() => {
      wrapper.unmount();
    });
    it('renders the Edit button because the user is Tim', () => {});
  });
});
