/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Description: The logs for service calls (to replace admin:service.viewlogs)

  Design Specification / Document: admin:service.viewlogs
 
*/ 

export {};

import ServiceCallLogs = require('../../../../modules/ComponentsLibrary/ServiceCallLogs/index');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../../test-tools/logging');

const component = (<ServiceCallLogs.ServiceCallLogs loggedUserId={8418} />);

describe('ComponentsLibrary', () => {
  describe('ServiceCallLogs', () => {
    describe(`<ServiceCallLogs${Object.keys(component.props).map(
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
