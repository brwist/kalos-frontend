export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

let MODULES_PATH_FROM_TEST =
  require('../../test-constants/constants').MODULES_PATH_FROM_TEST;
let SETUP_PATH_FROM_TEST_MODULES =
  require('../../test-constants/constants').SETUP_PATH_FROM_TEST_MODULES;

const ContractInfo =
  require(`${MODULES_PATH_FROM_TEST}/CustomerDetails/components/ContractInfo`).ContractInfo;
const SectionBar =
  require(`${MODULES_PATH_FROM_TEST}/ComponentsLibrary/SectionBar/index`).SectionBar;
let CustomerDetails =
  require(`${MODULES_PATH_FROM_TEST}/CustomerDetails/components/CustomerDetails`).CustomerDetails;
let React = require('react');
let shallow = require('enzyme').shallow;

require(`${SETUP_PATH_FROM_TEST_MODULES}/grpc-endpoint.js`); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require(`${SETUP_PATH_FROM_TEST_MODULES}/enzyme-setup.js`); // ? Required to run tests with Enzyme for React
let expectImport =
  require(`${SETUP_PATH_FROM_TEST_MODULES}/chai-setup.js`).expectImport;

describe('CustomerDetails', () => {
  describe('<CustomerDetails userID={2573} loggedUserId={101253} withHeader />', () => {
    it('renders a customer information div', () => {
      const wrapper = shallow(
        <CustomerDetails userID={2573} loggedUserId={101253} withHeader />,
      ).dive();
      expectImport(wrapper.find('div.CustomerInformation')).to.have.lengthOf(1);
    });
    it('renders a component with the title "Customer Information"', () => {
      const wrapper = shallow(
        <CustomerDetails userID={2573} loggedUserId={101253} withHeader />,
      ).dive();
      expectImport(
        wrapper.find({ title: 'Customer Information' }),
      ).to.have.lengthOf(1);
    });
  });
});
