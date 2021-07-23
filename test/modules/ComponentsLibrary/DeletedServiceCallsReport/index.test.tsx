export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import DeletedServiceCallsReportModule = require('../../../../modules/ComponentsLibrary/DeletedServiceCallsReport/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('ComponentsLibrary', () => {
  describe('DeletedServiceCallsReport', () => {
    describe('<DeletedServiceCallsReport loggedUserId={101253} dateStart="2018-05-25" dateEnd="2018-05-25" onClose={() => console.log("CLOSE")} />', () => {
      it('renders with a "Deleted Service Calls Report" title', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = Enzyme.shallow(
          <DeletedServiceCallsReportModule.DeletedServiceCallsReport
            loggedUserId={101253}
            dateStarted="2018-05-25"
            dateEnded="2018-05-25"
            onClose={() => console.log('CLOSE')}
          />,
        );

        Chai.expect(
          wrapper.find({ title: 'Deleted Service Calls Report' }),
        ).to.have.lengthOf(1);
      });
    });
  });
});
