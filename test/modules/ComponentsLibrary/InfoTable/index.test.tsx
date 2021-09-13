export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import Helpers = require('../../../../helpers');

import InfoTableModule = require('../../../../modules/ComponentsLibrary/InfoTable');
import TransactionModule = require('@kalos-core/kalos-rpc/Transaction');

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
describe('ComponentsLibrary', () => {
  let wrapper: Enzyme.ReactWrapper;
  beforeEach(() => {
    wrapper = Enzyme.mount(
      <InfoTableModule.InfoTable
        data={EXAMPLE}
        onSaveRowButton={result => console.log('RESULT OF ROW SAVE: ', result)}
        rowButton={{
          type: new TransactionModule.Transaction(),
          columnDefinition: {
            columnsToIgnore: [],
            columnTypeOverrides: [
              { columnName: 'Column 1', columnType: 'number' },
            ],
          },
        }}
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
        wrapper
          .find('.MuiButton-label')
          .filterWhere(label => label.text() === 'Add New Row')
          .simulate('click');
        wrapper.update();
      });
      describe('new row', () => {
        it('has an "OK" button at the end to confirm changes', () => {
          describe('results', () => {
            it('outputs the correct results', () => {});
          });
        });
        describe('fields', () => {
          it('has the correct number of fields for the columns', () => {
            let burger = wrapper.find('.Actions');
            burger.simulate('click');
            wrapper
              .find('.MuiButton-label')
              .filterWhere(label => label.text() === 'Add New Row')
              .simulate('click');
            wrapper.update();
            console.log('DEBUG: ', wrapper.debug());
            Chai.expect(
              wrapper
                .find('.MuiFormLabel-root')
                .filterWhere(label => label.text() === 'Column 1'),
            ).to.be.lengthOf(2);
            Chai.expect(
              wrapper
                .find('label')
                .filterWhere(label => label.text() === 'Column 2'),
            ).to.be.lengthOf(2);
          });
        });
      });
    });
  });
});
