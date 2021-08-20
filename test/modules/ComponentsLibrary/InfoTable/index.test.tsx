export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import Helpers = require('../../../../helpers');

import InfoTableModule = require('../../../../modules/ComponentsLibrary/InfoTable');

import React = require('react');
import Enzyme = require('enzyme');
import Sinon = require('sinon');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner

import constants = require('../../../test-constants/constants');

const EXAMPLE: InfoTableModule.Data = [
  [{ value: 'Row 0.0' }, { value: 'Row 0.1' }, { value: 'Row 0.2' }],
];
const EXAMPLE_COLUMNS = [{ name: 'Column 1' }, { name: 'Column 2' }];
describe.only('ComponentsLibrary', () => {
  let wrapper: Enzyme.ReactWrapper;
  beforeEach(() => {
    wrapper = Enzyme.mount(
      <InfoTableModule.InfoTable
        data={EXAMPLE}
        addRowButton
        columns={EXAMPLE_COLUMNS}
      />,
    );
  });
  afterEach(() => {
    wrapper.unmount();
  });
  describe('InfoTable', () => {
    describe(`<InfoTable data={EXAMPLE} addRowButton columns={EXAMPLE_COLUMNS}/>`, () => {
      it('has an action that can be clicked to open a new row', () => {
        let burger = wrapper.find('.Actions');
        burger.simulate('click');
        console.log(wrapper.debug());
        wrapper.find('.MuiButton-label').first().simulate('click');
        wrapper.update();
        describe('new row', () => {
          it('has an "OK" button at the end to confirm changes', () => {
            describe('results', () => {
              it('outputs the correct results', () => {});
            });
          });
          describe('fields', () => {
            it('has the correct number of fields for the columns', () => {});
            it('allows you to fill out the fields with information', () => {});
          });
        });
      });
    });
  });
});
