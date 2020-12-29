import React from 'react';
import renderer from 'react-test-renderer';
import { AddTimeOff } from './main';

test('AddTimeOff renders correctly', () => {
  const tree = renderer
    .create(
      <AddTimeOff
        userId={8418}
        loggedUserId={8418}
        withHeader
        onCancel={() => console.log('Cancel')}
        onSaveOrDelete={data => console.log('Save', data)}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
