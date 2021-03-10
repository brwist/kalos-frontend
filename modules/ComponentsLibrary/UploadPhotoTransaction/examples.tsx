import React from 'react';
import { UploadPhotoTransaction } from '.';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <UploadPhotoTransaction
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={console.log}
    />
    <ExampleTitle>title, no close, with defaultSubjectTag</ExampleTitle>
    <UploadPhotoTransaction
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={null}
      title="Lorem ipsum"
      defaultTag="Data Tag"
    />
  </>
);
