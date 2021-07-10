export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;
const SETUP_PATH_FROM_TEST =
  require('../../../test-constants/constants').SETUP_PATH_FROM_TEST;

const AddLog = require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/AddLog`).AddLog;
const React = require('react');
const shallow = require('enzyme').shallow;
const SectionBar =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/SectionBar/index`).SectionBar;
const PlainForm =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/PlainForm/index`).PlainForm;

require(`${SETUP_PATH_FROM_TEST}/grpc-endpoint.js`); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require(`${SETUP_PATH_FROM_TEST}/enzyme-setup.js`); // ? Required to run tests with Enzyme for React
const expectImport =
  require(`${SETUP_PATH_FROM_TEST}/chai-setup.js`).expectImport;

describe('ComponentsLibrary', () => {
  describe('AddLog', () => {
    describe('<AddLog onClose={() => alert("Would close")} loggedUserId={101253} />', () => {
      it('has a Log Details title', () => {
        const wrapper = shallow(
          <AddLog onClose={() => alert('Would close')} loggedUserId={101253} />,
        )
          .childAt(0)
          .dive();

        expectImport(wrapper.find({ title: 'Log Details' })).to.have.lengthOf(
          1,
        );
      });
    });
  });
});
