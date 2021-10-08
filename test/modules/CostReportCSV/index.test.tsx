/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/ 

export {};

import CostReportCSV = require('../../../modules/CostReportCSV/main');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('CostReportCSV', () => {
  describe('<CostReportCSV userID={8418} />', () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(
        <CostReportCSV.CostReportCSV userID={8418} />,
      );
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.text().includes('CostReportCSV works!')).to.equal(true);      
    })

    describe('Loading', () => {
      it('renders a loader when loading', () => {
        throw new Error("Testing is not implemented yet for the module CostReportCSV");
      });
    })

    // Rest of the spec tests here, make them pass as you go
  });
});
