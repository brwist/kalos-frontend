/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1
   
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
