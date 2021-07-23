export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import React = require('react');
import Enzyme = require('enzyme');
import ExportJSONModule = require('../../../../modules/ComponentsLibrary/ExportJSON/index');

import Chai = require('chai');

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
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = Enzyme.shallow(
          <ExportJSONModule.ExportJSON
            filename="example"
            json={DATA}
            fields={FIELDS}
          />,
        ).dive();

        Chai.expect(wrapper.find('.ButtonWrapper').text()).to.be.eql(
          'Export to Excel',
        );
      });
    });
  });
});
