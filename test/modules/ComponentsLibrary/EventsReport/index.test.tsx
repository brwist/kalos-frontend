export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

import EventsReportModule = require('../../../../modules/ComponentsLibrary/EventsReport/index');
import React = require('react');
import Enzyme = require('enzyme');

import Chai = require('chai');

describe('ComponentsLibrary', () => {
  describe('EventsReport', () => {
    describe('<EventsReport loggedUserId={101253} kind="jobStatus"filter={{ status: "Completed", startDate: "2019-10-01", endDate: "2019-10-03" }} onClose={() => console.log("CLOSE")} />', () => {
      it('renders with a "Job Status Report" title', () => {
        // FIXME make this test more thorough, it uses mount but only basically checks that the entire thing renders
        const wrapper = Enzyme.mount(
          <EventsReportModule.EventsReport
            loggedUserId={101253}
            kind="jobStatus"
            filter={{
              status: 'Completed',
              startDate: '2019-10-01',
              endDate: '2019-10-03',
            }}
            onClose={() => console.log('CLOSE')}
          />,
        );

        // ! Print page and section bar title both have Job Status Report
        Chai.expect(
          wrapper.find({ title: 'Job Status Report' }),
        ).to.have.lengthOf(2);
      });
    });
  });
});
