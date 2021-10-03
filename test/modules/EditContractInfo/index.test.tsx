/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/

export {};

import EditContractInfoComponent = require('../../../modules/EditContractInfo/main');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('EditContractInfo', () => {
  describe('<EditContractInfo userID={8418} />', () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(
        <EditContractInfoComponent.EditContractInfo
          userID={8418}
          onSave={() => {}}
          onClose={() => {}}
        />,
      );
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.text().includes('New Contract')).to.equal(true);
    });
  });
});
