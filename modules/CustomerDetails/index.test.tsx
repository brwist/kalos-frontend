import React from 'react';
import renderer from 'react-test-renderer';
import { CustomerDetails } from './main';

test('CustomerDetails renders correctly', () => {
  const tree = renderer
    .create(<CustomerDetails userID={2573} loggedUserId={101253} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
