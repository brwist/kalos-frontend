/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/

export {};

import NewContract = require('../../../../modules/ComponentsLibrary/NewContract/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');
import { FREQUENCIES } from '../../../../modules/ComponentsLibrary/NewContract/reducer';

let saves = false;
let closes = false;
describe('ComponentsLibrary', () => {
  describe('NewContract', () => {
    describe('<NewContract userID={8418} />', () => {
      let wrapper: Enzyme.ReactWrapper;
      before(() => {
        wrapper = Enzyme.mount(
          <NewContract.NewContract
            userID={8418}
            onSave={() => {
              saves = true;
            }}
            onClose={() => {
              closes = true;
            }}
          />,
        );
      });
      after(() => {
        wrapper.unmount();
      });
      afterEach(() => {
        // Reset these after each test
        saves = false;
        closes = false;
      });

      it('renders correctly', () => {
        Chai.expect(wrapper.text().includes('New Contract')).to.equal(true);
      });

      describe('New Contract Section', () => {
        it('exists', () => {
          Chai.expect(wrapper.find({ title: 'New Contract' })).to.be.lengthOf(
            1,
          );
        });

        describe('cancel button', () => {
          it('contains a cancel button', () => {
            Chai.expect(
              wrapper
                .find('.MuiButton-label')
                .filterWhere(button => button.text() === 'Cancel'),
            ).to.be.lengthOf(1);
          });

          it('fires an onClose off when clicked', () => {
            wrapper
              .find('.MuiButton-label')
              .filterWhere(button => button.text() === 'Cancel')
              .simulate('click');
            Chai.expect(closes).to.be.equal(true);
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

        describe('Billing Section', () => {
          it('Contains a billing section');
          it('is required');

          describe('dropdown', () => {
            it('has a site setting');
            it('has a group setting');
          });
        });

        describe('Payment Type Section', () => {
          it('Contains a payment type section');
          it('is required');
          it('has a payment type dropdown');
        });

        describe('Payment Status Section', () => {
          it('Contains a payment status section');
          it('is required');
          describe('dropdown', () => {
            // Pending billed cancelled paid
            it('has a pending setting');
            it('has a billed setting');
            it('has a cancelled setting');
            it('has a paid setting');
          });
        });

        describe('Payment Terms Section', () => {
          it('Contains a payment terms section');

          it('is a single-line field');
        });

        describe('Notes Section', () => {
          it('Contains a notes section');

          it('is a multi-line field');
        });

        describe('Property Selector Section', () => {
          it('Contains a property selector');
          it('is required');
          it('is a checkbox selection field');
        });
      });
    });
  });
});
