export {};

/* eslint-disable react/jsx-key */
// ! Disabled key errors in ESLint because they incorrectly label the elements within certain expectations as needing keys when they don't and will not work with keys

const COMPONENTS_LIBRARY_PATH_FROM_TEST =
  require('../../../test-constants/constants').COMPONENTS_LIBRARY_PATH_FROM_TEST;

const DeletedServiceCallsReport =
  require(`${COMPONENTS_LIBRARY_PATH_FROM_TEST}/DeletedServiceCallsReport`).DeletedServiceCallsReport;
const React = require('react');
const shallow = require('enzyme').shallow;

const expect = require('chai').expect;

describe('ComponentsLibrary', () => {
  describe('DeletedServiceCallsReport', () => {
    describe('<DeletedServiceCallsReport loggedUserId={101253} dateStart="2018-05-25" dateEnd="2018-05-25" onClose={() => console.log("CLOSE")} />', () => {
      it('renders with a "Deleted Service Calls Report" title', () => {
        // FIXME write out a more extensive "mount" test when possible now that we have mount working
        const wrapper = shallow(
          <DeletedServiceCallsReport
            loggedUserId={101253}
            dateStart="2018-05-25"
            dateEnd="2018-05-25"
            onClose={() => console.log('CLOSE')}
          />,
        );

        expect(
          wrapper.find({ title: 'Deleted Service Calls Report' }),
        ).to.have.lengthOf(1);
      });
    });
  });
});
