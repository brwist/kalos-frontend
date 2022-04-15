/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Description: a dumb test module

  Design Specification / Document: None Specified

*/ 

export {};

import DumbTestModule = require('../../../modules/DumbTestModule/main');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../test-tools/logging');

const component = (<DumbTestModule.DumbTestModule loggedUserId={8418} />);

describe('DumbTestModule', () => {
  describe(`<DumbTestModule${Object.keys(component.props).map(
    key =>
      ` ${key}={${
        typeof component.props[key] === 'string'
          ? `"${component.props[key]}"`
          : component.props[key]
      }}`,
  )} />`, () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(
        component,
      );
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.containsMatchingElement(component)).to.equal(true);      
    })

    describe('Loading', () => {
      it('renders a loader when loading'); // Implement here
    })

    // Rest of the spec tests here, make them pass as you go
  });
});
