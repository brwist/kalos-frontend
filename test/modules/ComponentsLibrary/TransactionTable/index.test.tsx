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
import TimesheetDepartmentModule = require('@kalos-core/kalos-rpc/TimesheetDepartment');

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

        let departmentReq = new TimesheetDepartmentModule.TimesheetDepartment();
        departmentReq.setIsActive(1);

        Stubs.setupStubs(
          'TimesheetDepartmentClientService',
          'BatchGet',
          TestConstants.getFakeTimesheetDepartments(),
          departmentReq,
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

      describe('Transactions Table', () => {
        it('displays the correct transaction in the table', async () => {
          await Constants.ReRenderAfterLoad(200);
          wrapper.update();
          Chai.expect(
            wrapper
              .find('.InfoTableValueContent')
              .filterWhere(result => result.text() !== 'TEST ORDER NUMBER')
              .first(),
          ).to.be.lengthOf(1);
        });

        describe('Table row', () => {
          describe('Actions', () => {
            describe('"Copy Data to Clipboard" button', () => {
              it('has an icon to Copy Data to Clipboard', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper
                    .find({ title: 'Copy data to clipboard' })
                    .filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"Edit this transaction" button', () => {
              it('has an icon to edit the transaction', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper
                    .find({ title: 'Edit this transaction' })
                    .filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"Upload File" button', () => {
              it('has an icon to Upload File', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper.find({ title: 'Upload File' }).filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"View Photos and Documents" button', () => {
              it('has an icon to View Photos and Documents', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper
                    .find({ title: 'View Photos and Documents' })
                    .filter('span'), // Span because this is the one generated from the gallery, which doesn't output an HTML button
                ).to.be.lengthOf(1);
              });
            });

            describe('"View activity log" button', () => {
              it('has an icon to View activity log', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper.find({ title: 'View activity log' }).filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"View Notes" button', () => {
              it('has an icon to View notes', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper.find({ title: 'View notes' }).filter('span'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"Mark as accepted" button', () => {
              it('has an icon to Mark as accepted', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper.find({ title: 'Mark as accepted' }).filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"Assign an employee to this task" button', () => {
              it('has an icon to Assign an employee to this task', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper
                    .find({ title: 'Assign an employee to this task' })
                    .filter('button'),
                ).to.be.lengthOf(1);
              });
            });

            describe('"Reject transaction" button', () => {
              it('has an icon to Reject transaction', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper
                    .find({ title: 'Reject transaction' })
                    .filter('button'),
                ).to.be.lengthOf(1);
              });
            });
          });
        });
      });

      describe('Pagination', () => {
        it('shows the correct pages for a single transaction', async () => {
          await Constants.ReRenderAfterLoad();
          wrapper.update();
          Chai.expect(
            wrapper
              .find('.MuiTypography-root')
              .filterWhere(result => result.text() === '1-1 of 1'),
          ).to.be.lengthOf(1);
        });
      });
    });
  });
});
