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
import EditTransactionModule = require('../../../../modules/ComponentsLibrary/EditTransaction');
import UserModule = require('@kalos-core/kalos-rpc/User');
import TransactionActivityModule = require('@kalos-core/kalos-rpc/TransactionActivity');
import TimesheetDepartmentModule = require('@kalos-core/kalos-rpc/TimesheetDepartment');
import TransactionAccountModule = require('@kalos-core/kalos-rpc/TransactionAccount');

import TestConstants = require('../../../test-constants/test-response-data');
import Constants = require('../../../test-constants/constants');

describe('ComponentsLibrary', () => {
  describe('TransactionTable', () => {
    describe('<TransactionTable loggedUserId={98217} hasActions />', () => {
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
        req.setVendorCategory("'PickTicket','Receipt','Invoice'");
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

        let transactionAccount =
          new TransactionAccountModule.TransactionAccount();
        transactionAccount.setId(0);
        transactionAccount.setIsActive(1);
        transactionAccount.setPageNumber(0);
        transactionAccount.setDescription('An account for unit tests');

        let transactionAccountList =
          new TransactionAccountModule.TransactionAccountList();
        transactionAccountList.setResultsList([transactionAccount]);
        Stubs.setupStubs(
          'TransactionAccountClientService',
          'BatchGet',
          transactionAccountList,
          new TransactionAccountModule.TransactionAccount(),
        );
      });
      after(() => {
        Stubs.restoreStubs();
      });

      beforeEach(() => {
        wrapper = Enzyme.mount(
          <TransactionTableModule.TransactionTable
            loggedUserId={98217}
            hasActions
          />,
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

        describe('New Transaction button', () => {
          it('has a "New Transaction" button', async () => {
            await Constants.ReRenderAfterLoad(200);
            wrapper.update();
            Chai.expect(
              wrapper
                .find('.MuiButton-label')
                .filterWhere(button => button.text() === 'New Transaction')
                .first(),
            ).to.be.lengthOf(1);
          });
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

              describe('"Edit Transaction Created From Merge" modal', () => {
                beforeEach(async () => {
                  await Constants.ReRenderAfterLoad();
                  wrapper.update();
                  wrapper
                    .find({ title: 'Edit this transaction' })
                    .filter('button')
                    .simulate('click');
                });

                it('can be clicked to open a modal with an EditTransaction component in it', async () => {
                  wrapper.update();

                  Chai.expect(
                    wrapper.find({ open: true }).containsMatchingElement(
                      // @ts-expect-error
                      <EditTransactionModule.EditTransaction />,
                    ),
                  ).to.be.equal(true);
                });

                it('has a functional "CANCEL" button', () => {
                  wrapper
                    .find('span')
                    .findWhere(span => span.text() === 'Cancel')
                    .find('.MuiButton-label')
                    .simulate('click');

                  Chai.expect(wrapper.find({ open: true })).to.be.lengthOf(0);
                });

                it('has a disabled "Save" button when first opened', () => {
                  // Checking to ensure the button is disabled
                  Chai.expect(
                    wrapper
                      .find('span')
                      .findWhere(span => span.text() === 'Save')
                      .find('.MuiButton-label')
                      .parent()
                      .prop('disabled'),
                  ).to.be.equal(true);
                });
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

            describe('"Delete this task" button', () => {
              it('has an icon to Delete this task', async () => {
                await Constants.ReRenderAfterLoad();
                wrapper.update();
                Chai.expect(
                  wrapper.find({ title: 'Delete this task' }).filter('button'),
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
