export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;

const Tasks = require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/Tasks`).Tasks;
const React = require('react');
const shallow = require('enzyme').shallow;
const SectionBar =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/SectionBar/index`).SectionBar;
const PlainForm =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/PlainForm/index`).PlainForm;

const expect = require('chai').expect;

describe('ComponentsLibrary', () => {
  describe('Tasks', () => {
    describe('<Tasks externalCode="customers" externalId={2573} loggedUserId={101253}/>', () => {
      it('renders with a section bar and a plain form', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <Tasks
            externalCode="customers"
            externalId={2573}
            loggedUserId={101253}
          />,
        );

        expect(
          wrapper.containsAllMatchingElements([
            <SectionBar></SectionBar>,
            <PlainForm></PlainForm>,
          ]),
        ).to.equal(true);
      });
    });
  });
});
