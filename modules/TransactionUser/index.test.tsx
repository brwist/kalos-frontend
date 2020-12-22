import React from 'react';
import renderer from 'react-test-renderer';
import Transaction from './main';

test('TransactionUser renders correctly', () => {
  const tree = renderer
    .create(<Transaction userID={8418} withHeader />)
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
