/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Description: allow the entering of two addresses and get the trip information

  Design Specification / Document: None Specified
 
*/ 

export {};

import TripCalulator = require('../../../../modules/ComponentsLibrary/TripCalulator/index');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../../test-tools/logging');

const component = (<TripCalulator.TripCalulator loggedUserId={8418} />);

describe('ComponentsLibrary', () => {
  describe('TripCalulator', () => {
    describe(`<TripCalulator${Object.keys(component.props).map(
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

      // Rest of the spec tests here, make them pass as you go
    });
  })
});
