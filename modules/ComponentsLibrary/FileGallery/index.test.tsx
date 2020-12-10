import React from 'react';
import renderer from 'react-test-renderer';
import { FileGallery } from './index';

test('FileGallery renders correctly', () => {
  const tree = renderer
    .create(
      <FileGallery
        loggedUserId={8418}
        title="Add Photo from Gallery"
        bucket="testbuckethelios" //"kalos-pre-transaction"
        onClose={() => console.log('close')}
        onAdd={console.log}
        removeFileOnAdd={false}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot(); // Rendered correctly
});
