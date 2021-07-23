export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import CustomerDetailsModule = require('../../../modules/CustomerDetails/components/CustomerDetails');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('CustomerDetails', () => {
  describe('<CustomerDetails userID={2573} loggedUserId={101253} withHeader />', () => {
    it('renders a customer information div', () => {
      // FIXME write out a more extensive "mount" test when possible now that we have mount working
      const wrapper = Enzyme.shallow(
        <CustomerDetailsModule.CustomerDetails
          userID={2573}
          loggedUserId={101253}
        />,
      ).dive();
      Chai.expect(wrapper.find('div.CustomerInformation')).to.have.lengthOf(1);
    });
    it('renders a component with the title "Customer Information"', () => {
      const wrapper = Enzyme.shallow(
        <CustomerDetailsModule.CustomerDetails
          userID={2573}
          loggedUserId={101253}
        />,
      ).dive();
      Chai.expect(
        wrapper.find({ title: 'Customer Information' }),
      ).to.have.lengthOf(1);
    });
  });
});
