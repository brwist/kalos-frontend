import React from 'react';
import renderer from 'react-test-renderer';
import { SearchIndex } from './main';

test('SearchIndex renders correctly', () => {
  const tree = renderer
    .create(<SearchIndex loggedUserId={101253} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
