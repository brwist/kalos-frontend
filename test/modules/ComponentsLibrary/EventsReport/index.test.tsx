export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;
const SETUP_PATH_FROM_TEST =
  require('../../../test-constants/constants').SETUP_PATH_FROM_TEST;

const EventsReport =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/EventsReport`).EventsReport;
const React = require('react');
const shallow = require('enzyme').shallow;
const SectionBar =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/SectionBar/index`).SectionBar;
const PlainForm =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/PlainForm/index`).PlainForm;

require(`${SETUP_PATH_FROM_TEST}/grpc-endpoint.js`); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require(`${SETUP_PATH_FROM_TEST}/enzyme-setup.js`); // ? Required to run tests with Enzyme for React
const expectImport =
  require(`${SETUP_PATH_FROM_TEST}/chai-setup.js`).expectImport;

describe('ComponentsLibrary', () => {
  describe('EventsReport', () => {
    describe('<EventsReport loggedUserId={101253} kind="jobStatus"filter={{ status: "Completed", startDate: "2019-10-01", endDate: "2019-10-03" }} onClose={() => console.log("CLOSE")} />', () => {
      it('renders with a "Job Status Report" title', () => {
        const wrapper = shallow(
          <EventsReport
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

        expectImport(
          wrapper.find({ title: 'Job Status Report' }),
        ).to.have.lengthOf(1);
      });
    });
  });
});
