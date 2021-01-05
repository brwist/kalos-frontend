import React from 'react';
import renderer from 'react-test-renderer';
import SideMenu from './main';

test('SideMenu renders correctly', () => {
  const tree = renderer.create(<SideMenu userID={8418} />).toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
