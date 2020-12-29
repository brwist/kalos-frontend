import React from 'react';
import renderer from 'react-test-renderer';
import { ServiceCalendar } from './main';

test('ServiceCalendar renders correctly', () => {
  const tree = renderer
    .create(<ServiceCalendar userId={32} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
