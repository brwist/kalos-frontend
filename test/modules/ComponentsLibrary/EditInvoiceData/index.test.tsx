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

const component = (
  <EditInvoiceData.EditInvoiceData
    userId={8418}
    onClose={() => {}}
    onSave={() => {}}
  />
);

describe('ComponentsLibrary', () => {
  describe('EditInvoiceData', () => {
    describe(`<EditInvoiceData${Object.keys(component.props).map(
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

      describe('Form', () => {
        describe('Terms field', () => {
          it('should have a "Terms" field', () => {
            Chai.expect(wrapper.find({ label: 'Terms' }).exists()).to.be.true;
          });
          it('should be multiline', () => {
            Chai.expect(
              wrapper
                .find({ label: 'Terms' })
                .find({ multiline: true })
                .exists(),
            ).to.be.true;
          });
        });

        describe('Services Performed fields', () => {
          it('should have multiple Services Performed fields');
          it('should have a grand total field');

          describe('Services Performed field', () => {
            it('should have a Total Amount field');
          });
        });
      });
    });
  });
});
