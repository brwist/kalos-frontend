/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/ 

export {};

import DepartmentDashboard = require('../../../../modules/ComponentsLibrary/DepartmentDashboard/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('DepartmentDashboard', () => {
  describe('<DepartmentDashboard />', () => {
    let wrapper: Enzyme.ReactWrapper; 
    before(() => {
      wrapper = Enzyme.mount(
        <DepartmentDashboard.DepartmentDashboard />,
      );
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.text().includes('DepartmentDashboard works!')).to.equal(true);      
    })

    // Rest of the spec tests here, make them pass as you go
  });
});
