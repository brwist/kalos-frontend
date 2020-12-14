import React from 'react';
import renderer from 'react-test-renderer';
import { PropertyInformation } from './main';
test('PropertyInformation renders correctly', () => {
  const tree = renderer
    .create(
      <PropertyInformation
        userID={32}
        propertyId={6152}
        loggedUserId={101253}
        withHeader
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
