import React from 'react';
import renderer from 'react-test-renderer';
import { EmployeeDirectory } from './main';

test('EmployeeDirectory renders correctly', () => {
  const tree = renderer
    .create(<EmployeeDirectory loggedUserId={101253} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
