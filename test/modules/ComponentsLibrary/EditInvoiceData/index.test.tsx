/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: TODO add spec
 
*/

export {};

import EditInvoiceData = require('../../../../modules/ComponentsLibrary/EditInvoiceData/index');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../../test-tools/logging');

describe('ComponentsLibrary', () => {
  describe('EditInvoiceData', () => {
    describe('<EditInvoiceData />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        wrapper = Enzyme.mount(<EditInvoiceData.EditInvoiceData />);
      });
      after(() => {
        wrapper.unmount();
      });

      it('renders correctly', () => {
        Chai.expect(
          wrapper.containsMatchingElement(<EditInvoiceData.EditInvoiceData />),
        ).to.equal(true);
      });

      // Rest of the spec tests here, make them pass as you go
    });
  });
});
