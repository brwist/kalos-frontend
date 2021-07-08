const Tasks = require('../../../../modules/ComponentsLibrary/Tasks').Tasks;
const React = require('react');
const shallow = require('enzyme').shallow;

require('../../../grpc-endpoint.js'); // ? Required to run tests with RPCs in Mocha (because Mocha runs in a Node environment)
require('../../../enzyme-setup.js'); // ? Required to run tests with Enzyme for React
const expectImport = require('../../../chai-setup.js').expectImport;

describe('ComponentsLibrary', () => {
  describe('Tasks', () => {
    describe('<Tasks />', () => {
      it('renders a fragment wrapper', () => {
        const wrapper = shallow(
          <Tasks
            externalCode="customers"
            externalId={2573}
            loggedUserId={101253}
          />,
        );

        expectImport(wrapper.contains(<></>)).to.equal(true);
      });
    });
  });
});
