export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const GetPathFromName =
  require('../../../test-constants/constants').GetPathFromName;

const Payroll = require(GetPathFromName(
  'Payroll',
  'ComponentsLibrary',
)).Payroll;
const React = require('react');
const mount = require('enzyme').mount;

const expect = require('chai').expect;

describe('ComponentsLibrary', () => {
  describe('Payroll', () => {
    describe('<Payroll userID={101253} />', () => {
      it('has a Payroll title', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = mount(<Payroll userID={101253} />);

        expect(wrapper.find({ title: 'Payroll' })).to.have.lengthOf(1);
      });
    });
  });
});
