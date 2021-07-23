export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import TasksModule = require('../../../../modules/ComponentsLibrary/Tasks/index');
import React = require('react');
import Enzyme = require('enzyme');
import SectionBarModule = require('../../../../modules/ComponentsLibrary/SectionBar/index');
import PlainFormModule = require('../../../../modules/ComponentsLibrary/PlainForm/index');

import Chai = require('chai');

describe('ComponentsLibrary', () => {
  describe('Tasks', () => {
    describe('<Tasks externalCode="customers" externalId={2573} loggedUserId={101253}/>', () => {
      it('renders with a section bar and a plain form', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = Enzyme.shallow(
          <TasksModule.Tasks
            externalCode="customers"
            externalId={2573}
            loggedUserId={101253}
          />,
        );

        Chai.expect(
          wrapper.containsAllMatchingElements([
            <SectionBarModule.SectionBar></SectionBarModule.SectionBar>,
            // ? Suppressing props errors because they aren't quite applicable for the uses of this test (we aren't rendering the component)
            // @ts-expect-error
            <PlainFormModule.PlainForm></PlainFormModule.PlainForm>,
          ]),
        ).to.equal(true);
      });
    });
  });
});
