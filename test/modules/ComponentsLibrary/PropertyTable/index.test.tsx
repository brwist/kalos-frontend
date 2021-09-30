/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: TODO add spec
 
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
        wrapper = Enzyme.mount(
          <PropertyTable.PropertyTable />,
        );
      });
      after(() => {
        wrapper.unmount();
      });

      it('renders correctly', () => {
        Chai.expect(wrapper.text().includes('PropertyTable works!')).to.equal(true);      
      })

      // Rest of the spec tests here, make them pass as you go
    });
  })
});
