/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Description: The documentation for the Trello Slash command bot on our Slack. 

  Design Specification / Document: Slack app: https://api.slack.com/apps/A02SJF64ND7 (you will see "There's been a glitch" if you do not have the correct permissions to view the app)
 
*/ 

export {};

import TrelloSlashCommandDocumentation = require('../../../../modules/ComponentsLibrary/TrelloSlashCommandDocumentation/index');
import React = require('react');
import Enzyme = require('enzyme');
import Chai = require('chai');

import LogModule = require('../../../test-tools/logging');

const component = (<TrelloSlashCommandDocumentation.TrelloSlashCommandDocumentation loggedUserId={8418} />);

describe('ComponentsLibrary', () => {
  describe('TrelloSlashCommandDocumentation', () => {
    describe(`<TrelloSlashCommandDocumentation${Object.keys(component.props).map(
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
