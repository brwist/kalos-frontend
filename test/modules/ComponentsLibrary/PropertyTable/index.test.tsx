/* 

  Design Specification: Property Pane at https://app.kalosflorida.com/index.cfm?action=admin:contracts.contractnew&contract_id=3365
 
*/

export {};

import PropertyTable = require('../../../../modules/ComponentsLibrary/PropertyTable/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');
describe('ComponentsLibrary', () => {
  describe('PropertyTable', () => {
    describe('<PropertyTable />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        wrapper = Enzyme.mount(<PropertyTable.PropertyTable userId={69} />);
      });
      after(() => {
        wrapper.unmount();
      });

      it('renders correctly', () => {
        Chai.expect(wrapper.text().includes('PropertyTable works!')).to.equal(
          true,
        );
      });

      describe('Table', () => {
        describe('Items', () => {
          it('renders the items that were loaded correctly', () => {
            Chai.expect(wrapper.find('.Property')).to.be.lengthOf(3);
          });
          it('are in a list of checkboxes', () => {
            Chai.expect(wrapper.find({ type: 'multiselect' })).to.be.lengthOf(
              3,
            );
          });
        });

        describe('Error handling', () => {
          it('shows an error screen if loading fails for any reason');
          it('sends off a devlog in the case of an error');
        });
      });
    });
  });
});
