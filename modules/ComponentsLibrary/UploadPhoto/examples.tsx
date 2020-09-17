import React from 'react';
import { UploadPhoto } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <UploadPhoto
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={console.log}
    />
    <ExampleTitle>title, no close, with defaultSubjectTag</ExampleTitle>
    <UploadPhoto
      loggedUserId={101253}
      bucket="testbuckethelios"
      onClose={null}
      title="Lorem ipsum"
      defaultTag="Data Tag"
    />
  </>
);
