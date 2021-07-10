export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;
const SETUP_PATH_FROM_TEST =
  require('../../../test-constants/constants').SETUP_PATH_FROM_TEST;

const React = require('react');
const shallow = require('enzyme').shallow;
const ExportJSON =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/ExportJSON/index`).ExportJSON;

require(`${SETUP_PATH_FROM_TEST}/grpc-endpoint.js`); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require(`${SETUP_PATH_FROM_TEST}/enzyme-setup.js`); // ? Required to run tests with Enzyme for React
const expectImport =
  require(`${SETUP_PATH_FROM_TEST}/chai-setup.js`).expectImport;

const DATA = [...Array(40)].map(() => ({
  firstname: 'John',
  lastname: 'Doe',
  age: 69,
  job: 'Chief Underwater Basket Weaver',
  phone: '123-456-7890',
}));

const FIELDS = [
  { label: 'First Name', value: 'firstname' },
  { label: 'Last Name', value: 'lastname' },
  { label: 'Job Title', value: 'job' },
  { label: 'Age', value: 'age' },
  { label: 'Cell Phone', value: 'phone' },
];

describe('ComponentsLibrary', () => {
  describe('ExportJSON', () => {
    describe('<ExportJSON filename="example" json={DATA} fields={FIELDS} />', () => {
      it('renders a button that says "Export to Excel"', () => {
        const wrapper = shallow(
          <ExportJSON filename="example" json={DATA} fields={FIELDS} />,
        ).dive();

        expectImport(wrapper.find('.ButtonWrapper').text()).to.be.eql(
          'Export to Excel',
        );
      });
    });
  });
});
