import React from 'react';
import { Gallery } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <Gallery
      title="Alt Gallery"
      text="Lorem ipsum..."
      fileList={[]}
      transactionID={8397}
    />
    <ExampleTitle>with canDelete</ExampleTitle>
    <Gallery
      title="Alt Gallery"
      text="Lorem ipsum..."
      fileList={[]}
      transactionID={8397}
      canDelete
    />
  </>
);
