/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/ 

export {};

import NewContract = require('../../../../modules/ComponentsLibrary/NewContract/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');
describe('ComponentsLibrary', () => {
  describe('NewContract', () => {
    describe('<NewContract />', () => {
      let wrapper: Enzyme.ReactWrapper; 
      before(() => {
        wrapper = Enzyme.mount(
          <NewContract.NewContract />,
        );
      });
      after(() => {
        wrapper.unmount();
      });

      it('renders correctly', () => {
        Chai.expect(wrapper.text().includes('NewContract works!')).to.equal(true);      
      })

      // Rest of the spec tests here, make them pass as you go
    });
  })
});
