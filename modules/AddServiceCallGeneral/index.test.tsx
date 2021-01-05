import React from 'react';
import renderer from 'react-test-renderer';
import { AddServiceCallGeneral } from './main';

test('AddServiceCallGeneralrenders correctly', () => {
  const tree = renderer
    .create(<AddServiceCallGeneral loggedUserId={101253} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
