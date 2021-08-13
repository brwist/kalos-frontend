export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import TransactionTableModule = require('../../../../modules/ComponentsLibrary/TransactionTable/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner
import TransactionModule = require('@kalos-core/kalos-rpc/Transaction');

import TestConstants = require('../../../test-constants/test-response-data');

describe('ComponentsLibrary', () => {
  describe('TransactionTable', () => {
    describe('<TransactionTable loggedUserId={98217} />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        Stubs.setupStubs(
          'UserClientService',
          'loadTechnicians',
          TestConstants.getFakeUserData(),
        );

        Stubs.setupStubs(
          'TimesheetDepartmentClientService',
          'loadTimeSheetDepartments',
          TestConstants.getFakeTimesheetDepartments(),
        );

        let req = new TransactionModule.Transaction();
        req.setIsActive(1);
        req.setFieldMaskList(['IsBillingRecorded']);
        req.setOrderBy('vendor, timestamp');
        req.setOrderDir('ASC');
        req.setVendorCategory("'PickTicket','Receipt'");

        Stubs.setupStubs(
          'TransactionClientService',
          'BatchGet',
          TestConstants.getFakeTransactions(),
          req,
        );
      });
      after(() => {
        Stubs.restoreStubs();
      });

      beforeEach(() => {
        wrapper = Enzyme.mount(
          <TransactionTableModule.TransactionTable loggedUserId={98217} />,
        );
      });

      afterEach(() => {
        wrapper.unmount();
      });

      
    });
  });
});
