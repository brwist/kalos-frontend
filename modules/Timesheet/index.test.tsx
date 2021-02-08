import React from 'react';
import renderer from 'react-test-renderer';
import { Timesheet } from './main';

test('Timesheet renders correctly', () => {
  const tree = renderer
    .create(<Timesheet userId={10240} timesheetOwnerId={10240} />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
