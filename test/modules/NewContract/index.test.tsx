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
        Chai.expect(wrapper.find('.NewContract')).to.be.lengthOf(1);
      });

      describe('Start Date Field', () => {
        it('Contains a start date field', () => {
          throw new Error('Not implemented');
        });

        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('End Date Field', () => {
        it('Contains an end date field', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Frequency Field', () => {
        it('Contains a frequency field', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Billing Section', () => {
        it('Contains a billing section', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Payment Type Section', () => {
        it('Contains a payment type section', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Payment Status Section', () => {
        it('Contains a payment status section', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Payment Terms Section', () => {
        it('Contains a payment terms section', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Notes Section', () => {
        it('Contains a notes section', () => {
          throw new Error('Not implemented');
        });
      });

      describe('Property Selector Section', () => {
        it('Contains a property selector', () => {
          throw new Error('Not implemented');
        });
        it('is required', () => {
          throw new Error('Not implemented');
        });
      });
    });
  });
});
