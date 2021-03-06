/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: converting this to React from Coldfusion
  https://app.kalosflorida.com/index.cfm?action=admin:contracts.edit&contract_id=3365&p=1
  
*/

export {};

import EditContractInfo = require('../../../../modules/ComponentsLibrary/EditContractInfo/index');
import PropertyDropdownModule = require('../../../../modules/ComponentsLibrary/PropertyDropdown/index');

import React = require('react');
import Enzyme = require('enzyme');
import Stubs = require('../../../test-setup/stubs'); // ? Sets the auth token up in a one-liner
import Chai = require('chai');
import {
  BILLING_OPTIONS,
  FREQUENCIES,
} from '../../../../modules/ComponentsLibrary/EditContractInfo/reducer';
import {
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../../../../modules/CustomerDetails/components/ContractInfo';

import DevlogModule = require('../../../@kalos-core/kalos-rpc/Devlog');
import EditInvoiceDataModule = require('../../../../modules/ComponentsLibrary/EditInvoiceData/index');

let saves = false;
let closes = false;
describe('ComponentsLibrary', () => {
  describe('EditContractInfo', () => {
    describe('<EditContractInfo userID={8418} />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        wrapper = Enzyme.mount(
          <EditContractInfo.EditContractInfo
            contractID={1051}
            userID={8418}
            onSaveStarted={() => {
              saves = true;
            }}
            onClose={() => {
              closes = true;
            }}
          />,
        );

        let devlog = new DevlogModule.Devlog();
        Stubs.setupStubs('DevlogClientService', 'Create', devlog);
      });
      after(() => {
        wrapper.unmount();
        Stubs.restoreStubs();
      });
      afterEach(() => {
        // Reset these after each test
        saves = false;
        closes = false;
      });

      describe('Edit Contract Section', () => {
        it('exists', () => {
          Chai.expect(
            wrapper.find({ title: 'Edit Contract' }).length,
          ).to.be.greaterThanOrEqual(1);
        });

        describe('cancel button', () => {
          it('contains a cancel button', () => {
            Chai.expect(
              wrapper
                .find('.MuiButton-label')
                .filterWhere(button => button.text() === 'Cancel').length,
            ).to.be.greaterThanOrEqual(1);
          });

          it('fires an onClose off when clicked', () => {
            wrapper
              .find('.MuiButton-label')
              .filterWhere(button => button.text() === 'Cancel')
              .first()
              .simulate('click');
            Chai.expect(closes).to.be.equal(true);
          });
        });

        describe('save button', () => {
          it('contains a save button', () => {
            Chai.expect(
              wrapper
                .find('.MuiButton-label')
                .filterWhere(button => button.text() === 'Save').length,
            ).to.be.greaterThanOrEqual(1);
          });

          it('fires an onSave off when clicked', () => {
            wrapper
              .find('.MuiButton-label')
              .filterWhere(button => button.text() === 'Save')
              .first()
              .simulate('click');

            wrapper
              .find('.MuiButton-label')
              .filterWhere(button => button.text() === 'Confirm')
              .first()
              .simulate('click');

            Chai.expect(saves).to.be.equal(true);
          });
        });

        describe('Start Date Field', () => {
          it('Contains a start date field', () => {
            Chai.expect(wrapper.text().includes('Start Date')).to.be.equal(
              true,
            );
          });

          it('is required', () => {
            Chai.expect(
              wrapper.find({ label: 'Start Date' }).find({ required: true }),
            ).to.be.lengthOf(1);
          });

          it('is a date selector', () => {
            Chai.expect(
              wrapper.find({ type: 'date' }).find({ label: 'Start Date' }),
            ).to.be.lengthOf(1);
          });
        });

        describe('End Date Field', () => {
          it('Contains an end date field', () => {
            Chai.expect(wrapper.text().includes('End Date')).to.be.equal(true);
          });
          it('is required', () => {
            Chai.expect(
              wrapper.find({ label: 'End Date' }).find({ required: true }),
            ).to.be.lengthOf(1);
          });

          it('is a date selector', () => {
            Chai.expect(
              wrapper.find({ type: 'date' }).find({ label: 'End Date' }),
            ).to.be.lengthOf(1);
          });
        });

        describe('Frequency Field', () => {
          it('Contains a frequency field', () => {
            Chai.expect(wrapper.text().includes('Frequency')).to.be.equal(true);
          });
          it('is required', () => {
            Chai.expect(
              wrapper.find({ label: 'Frequency' }).find({ required: true }),
            ).to.be.lengthOf(1);
          });

          describe('dropdown', () => {
            it('has a monthly setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Frequency' })
                  .prop('options')
                  .includes(FREQUENCIES.MONTHLY),
              ).to.be.equal(true);
            });

            it('has a bi-monthly setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Frequency' })
                  .prop('options')
                  .includes(FREQUENCIES.BIMONTHLY),
              ).to.be.equal(true);
            });

            it('has a quarterly setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Frequency' })
                  .prop('options')
                  .includes(FREQUENCIES.QUARTERLY),
              ).to.be.equal(true);
            });

            it('has a semi-annual setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Frequency' })
                  .prop('options')
                  .includes(FREQUENCIES.SEMIANNUAL),
              ).to.be.equal(true);
            });

            it('has a yearly setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Frequency' })
                  .prop('options')
                  .includes(FREQUENCIES.ANNUAL),
              ).to.be.equal(true);
            });
          });
        });

        describe('Group Billing Section', () => {
          it('Contains a group billing section', () => {
            Chai.expect(wrapper.text().includes('Group Billing')).to.be.equal(
              true,
            );
          });
          it('is required', () => {
            Chai.expect(
              wrapper.find({ label: 'Group Billing' }).find({ required: true }),
            ).to.be.lengthOf(1);
          });

          describe('dropdown', () => {
            it('has a site setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Group Billing' })
                  .prop('options')
                  .includes(BILLING_OPTIONS.SITE),
              ).to.be.equal(true);
            });
            it('has a group setting', () => {
              Chai.expect(
                wrapper
                  .find({ label: 'Group Billing' })
                  .prop('options')
                  .includes(BILLING_OPTIONS.GROUP),
              ).to.be.equal(true);
            });
          });
        });

        describe('Payment Type Section', () => {
          it('Contains a payment type section', () => {
            Chai.expect(wrapper.text().includes('Payment Type')).to.be.equal(
              true,
            );
          });
          it('is required', () => {
            Chai.expect(
              wrapper.find({ label: 'Payment Type' }).find({ required: true }),
            ).to.be.lengthOf(1);
          });
          describe('dropdown', () => {
            it('has every payment type', () => {
              Chai.expect(
                PAYMENT_TYPE_OPTIONS.filter(option =>
                  wrapper
                    .find({ label: 'Payment Type' })
                    .text()
                    .includes(option as string),
                ),
              ).to.be.lengthOf(0);
            });
          });
        });

        describe('Payment Status Section', () => {
          it('Contains a payment status section', () => {
            Chai.expect(wrapper.text().includes('Payment Status')).to.be.equal(
              true,
            );
          });
          it('is required', () => {
            Chai.expect(
              wrapper
                .find({ label: 'Payment Status' })
                .find({ required: true }),
            ).to.be.lengthOf(1);
          });
          describe('dropdown', () => {
            it('has every payment status', () => {
              Chai.expect(
                PAYMENT_STATUS_OPTIONS.filter(option =>
                  wrapper
                    .find({ label: 'Payment Type' })
                    .text()
                    .includes(option as string),
                ),
              ).to.be.lengthOf(0);
            });
          });
        });

        describe('Payment Terms Section', () => {
          it('Contains a payment terms section', () => {
            Chai.expect(wrapper.text().includes('Payment Terms')).to.be.equal(
              true,
            );
          });

          it('is a single-line field', () => {
            Chai.expect(
              wrapper.find({ label: 'Payment Status' }).find({ type: 'text' }),
            ).to.be.lengthOf(2); // 2 elements with type text are generated per text field
          });
        });

        describe('Notes Section', () => {
          it('Contains a notes section', () => {
            Chai.expect(wrapper.text().includes('Notes')).to.be.equal(true);
          });

          it('is a multi-line field', () => {
            Chai.expect(
              wrapper
                .find({ label: 'Notes' })
                .find({ type: 'text' })
                .find({ multiline: true }),
            ).to.be.lengthOf(7); // 7 elements with type text are generated per each multiline text field
          });
        });

        describe('Property Dropdown', () => {
          it('contains a property dropdown', () => {
            Chai.expect(
              wrapper.containsMatchingElement(
                // @ts-expect-error
                <PropertyDropdownModule.PropertyDropdown />,
              ),
            ).to.be.equal(true);
          });
        });
      });

      describe('Invoice Data Section', () => {
        it('contains an Edit Invoice Data component', () => {
          Chai.expect(
            wrapper.containsMatchingElement(
              // @ts-expect-error
              <EditInvoiceDataModule.EditInvoiceData />,
            ),
          ).to.be.equal(true);
        });
      });
    });
  });
});
