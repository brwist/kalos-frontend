export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;

const AddLog = require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/AddLog`).AddLog;
const React = require('react');
const shallow = require('enzyme').shallow;

const expect = require('chai').expect;

describe('ComponentsLibrary', () => {
  describe('AddLog', () => {
    describe('<AddLog onClose={() => alert("Would close")} loggedUserId={101253} />', () => {
      it('has a Log Details title', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <AddLog onClose={() => alert('Would close')} loggedUserId={101253} />,
        )
          .childAt(0)
          .dive();

        expect(wrapper.find({ title: 'Log Details' })).to.have.lengthOf(1);
      });
    });
  });
});
