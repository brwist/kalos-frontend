export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import TransactionTableModule = require('../../../../modules/ComponentsLibrary/TransactionTable/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner
import TransactionModule = require('@kalos-core/kalos-rpc/Transaction');
import LoaderModule = require('../../../../modules/Loader/main');
import UserModule = require('@kalos-core/kalos-rpc/User');
import TransactionActivityModule = require('@kalos-core/kalos-rpc/TransactionActivity');

import TestConstants = require('../../../test-constants/test-response-data');
import Constants = require('../../../test-constants/constants');

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
        req.setDocumentsList([]);
        req.setActivityLogList([]);
        // @ts-expect-error
        req.setPageNumber(null);
        req.setNotEqualsList([]);
        // @ts-expect-error
        req.setIsBillingRecorded(null);
        (req as any)['wrappers_'] = null;

        Stubs.setupStubs(
          'TransactionClientService',
          'BatchGet',
          TestConstants.getFakeTransactionList(),
          req,
        );

        let userReq = new UserModule.User();
        userReq.setId(98217);

        Stubs.setupStubs(
          'UserClientService',
          'Get',
          TestConstants.getFakeUser(98217),
          userReq,
        );

        let transactionActivity =
          new TransactionActivityModule.TransactionActivity();
        transactionActivity.setTransactionId(100);

        Stubs.setupStubs(
          'TransactionActivityClientService',
          'BatchGet',
          TestConstants.getFakeActivityLogList(100, 98217),
          transactionActivity,
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

      it('has a loader while it is loading', () => {
        Chai.expect(
          wrapper.containsAllMatchingElements([<LoaderModule.Loader />]),
        ).to.be.equal(true);
      });

      it('displays the correct transaction in the table', async () => {
        await Constants.ReRenderAfterLoad(200);
        wrapper.setProps({ loggedUserId: 98217 });
        Chai.expect(
          wrapper
            .find('.InfoTableValueContent')
            .filterWhere(result => result.text() !== 'TEST ORDER NUMBER')
            .first(),
        ).to.be.lengthOf(1);
      });
    });
  });
});
