export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const MODULES_PATH_FROM_TEST =
  require('../../test-constants/constants').MODULES_PATH_FROM_TEST;

const CustomerDetails =
  require(`${MODULES_PATH_FROM_TEST}/CustomerDetails/components/CustomerDetails`).CustomerDetails;
const React = require('react');
const shallow = require('enzyme').shallow;

const expect = require('chai').expect;

describe('CustomerDetails', () => {
  describe('<CustomerDetails userID={2573} loggedUserId={101253} withHeader />', () => {
    it('renders a customer information div', () => {
      // FIXME write out a more extensive "mount" test when possible now that we have mount working
      const wrapper = shallow(
        <CustomerDetails userID={2573} loggedUserId={101253} withHeader />,
      ).dive();
      expect(wrapper.find('div.CustomerInformation')).to.have.lengthOf(1);
    });
    it('renders a component with the title "Customer Information"', () => {
      const wrapper = shallow(
        <CustomerDetails userID={2573} loggedUserId={101253} withHeader />,
      ).dive();
      expect(wrapper.find({ title: 'Customer Information' })).to.have.lengthOf(
        1,
      );
    });
  });
});
