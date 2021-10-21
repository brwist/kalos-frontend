/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Description: Tests for Customer Details

  Design Specification / Document: Testing this screen https://app.kalosflorida.com/index.cfm?action=admin:customers.details&user_id=2573

*/

export {};

import CustomerDetails = require('../../../modules/CustomerDetails/main');
import CustomerDetailsComponent = require('../../../modules/CustomerDetails/components/CustomerDetails');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../test-tools/logging');

const component = (
  <CustomerDetails.CustomerDetails userID={2573} loggedUserId={8418} />
);

describe('CustomerDetails', () => {
  describe(`<CustomerDetails${Object.keys(component.props).map(
    key =>
      ` ${key}={${
        typeof component.props[key] === 'string'
          ? `"${component.props[key]}"`
          : component.props[key]
      }}`,
  )} />`, () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(component);
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.containsMatchingElement(component)).to.equal(true);
    });

    describe('screen', () => {
      it('shows the Customer Details component', () => {
        Chai.expect(
          wrapper.containsMatchingElement(
            <CustomerDetailsComponent.CustomerDetails
              userID={2573}
              loggedUserId={8418}
            />,
          ),
        ).to.be.true;
      });
    });
  });
});
