/*
    ! Please write your tests here (failing first) and make them pass as development progresses.
    This ensures the spec is followed and that there can be no regression in the component. 
*/

/* 

  Design Specification: 

*/

export {};

import NewContract = require('../../../modules/NewContract/main');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('NewContract', () => {
  describe('<NewContract userID={8418} />', () => {
    let wrapper: Enzyme.ReactWrapper;
    before(() => {
      wrapper = Enzyme.mount(<NewContract.NewContract userID={8418} />);
    });
    after(() => {
      wrapper.unmount();
    });

    it('renders correctly', () => {
      Chai.expect(wrapper.text().includes('NewContract works!')).to.equal(true);
    });

    describe('New Contract Section', () => {
      it('exists', () => {
        Chai.expect(wrapper.find({ title: 'New Contract' })).to.be.lengthOf(1);
      });

      it('contains a cancel button', () => {
        Chai.expect(
          wrapper
            .find('.MuiButton-label')
            .filterWhere(button => button.text() === 'Cancel'),
        ).to.be.lengthOf(1);
      });

      describe('Start Date Field', () => {
        it('Contains a start date field');

        it('is required');

        it('is a date selector');
      });

      describe('End Date Field', () => {
        it('Contains an end date field');
        it('is required');

        it('is a date selector');
      });

      describe('Frequency Field', () => {
        it('Contains a frequency field');
        it('is required');

        describe('dropdown', () => {
          it('has a monthly setting');

          it('has a bi-monthly setting');

          it('has a quarterly setting');

          it('has a bi-annual setting');

          it('has a yearly setting');
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
