/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/ 

export {};

import NewContract = require('../../../modules/NewContract/main');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('NewContract', () => {
  describe('<NewContract userID={8418} />', () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(
        <NewContract.NewContract userID={8418} />,
      );
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.text().includes('NewContract works!')).to.equal(true);      
    })

    describe('Loading', () => {
      it('renders a loader when loading', () => {
        throw new Error("Testing is not implemented yet for the module NewContract");
      });
    })

    // Rest of the spec tests here, make them pass as you go
  });
});
