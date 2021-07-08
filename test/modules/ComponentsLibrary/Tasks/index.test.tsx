/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys
const Tasks = require('../../../../modules/ComponentsLibrary/Tasks').Tasks;
const React = require('react');
const shallow = require('enzyme').shallow;
const SectionBar =
  require('../../../../modules/ComponentsLibrary/SectionBar/index').SectionBar;
const PlainForm =
  require('../../../../modules/ComponentsLibrary/PlainForm/index').PlainForm;

require('../../../grpc-endpoint.js'); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require('../../../enzyme-setup.js'); // ? Required to run tests with Enzyme for React
const expectImport = require('../../../chai-setup.js').expectImport;

describe('ComponentsLibrary', () => {
  describe('Tasks', () => {
    describe('<Tasks externalCode="customers" externalId={2573} loggedUserId={101253}/>', () => {
      it('renders with a section bar and a plain form', () => {
        const wrapper = shallow(
          <Tasks
            externalCode="customers"
            externalId={2573}
            loggedUserId={101253}
          />,
        );

        expectImport(
          wrapper.containsAllMatchingElements([
            <SectionBar></SectionBar>,
            <PlainForm></PlainForm>,
          ]),
        ).to.equal(true);
      });
    });
  });
});
