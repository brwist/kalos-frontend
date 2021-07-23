export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import AddLogModule = require('../../../../modules/ComponentsLibrary/AddLog/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('ComponentsLibrary', () => {
  describe('AddLog', () => {
    describe('<AddLog onClose={() => alert("Would close")} loggedUserId={101253} />', () => {
      it('has a Log Details title', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = Enzyme.shallow(
          <AddLogModule.AddLog
            onClose={() => alert('Would close')}
            loggedUserId={101253}
          />,
        )
          .childAt(0)
          .dive();

        Chai.expect(wrapper.find({ title: 'Log Details' })).to.have.lengthOf(1);
      });
    });
  });
});
