/* 

  Design Specification: Property Pane at https://app.kalosflorida.com/index.cfm?action=admin:contracts.contractnew&contract_id=3365
 
*/

export {};

import PropertyDropdown = require('../../../../modules/ComponentsLibrary/PropertyDropdown/index');
import PropertyProto = require('../../../@kalos-core/kalos-rpc/Property');
import React = require('react');
import Enzyme = require('enzyme');
import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

import Chai = require('chai');
import ResponseData = require('../../../test-constants/test-response-data');
import Constants = require('../../../test-constants/constants');
describe('ComponentsLibrary', () => {
  describe('PropertyDropdown', () => {
    describe('<PropertyDropdown />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        wrapper = Enzyme.mount(
          <PropertyDropdown.PropertyDropdown
            userId={69}
            onSave={() => {}}
            onClose={() => {}}
          />,
        );
        let req = new PropertyProto.Property();
        req.setUserId(69);
        console.log('Being passed in: ', req);
        Stubs.setupStubs(
          'PropertyClientService',
          'BatchGet',
          ResponseData.getFakePropertyList(69),
          req,
        );
      });
      after(() => {
        wrapper.unmount();
        Stubs.restoreStubs();
      });

      it('renders correctly', () => {
        Chai.expect(wrapper.text().includes('Properties')).to.equal(true);
      });

      describe('Table', () => {
        describe('Items', () => {
          // TODO possible stubbing bug? Cannot for the life of me figure out why the property client service isn't being stubbed out
          it.skip('renders the items that were loaded correctly', async () => {
            await Constants.ReRenderAfterLoad();
            wrapper.update();
            console.log(wrapper.find({ type: 'multiselect' }).prop('options'));
            Chai.expect(
              wrapper.find({ type: 'multiselect' }).prop('options'),
            ).to.be.lengthOf(3);
          });
          it('are in a list of checkboxes', () => {
            Chai.expect(wrapper.find({ type: 'multiselect' })).to.be.lengthOf(
              1,
            );
          });
        });

        // TODO fill these out once the bug is figured out above
        describe('Error handling', () => {
          it('shows an error screen if loading fails for any reason', () => {});
          it('sends off a devlog in the case of an error', () => {});
        });
      });
    });
  });
});
