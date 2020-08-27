import React from 'react';
import { UploadPhoto } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <UploadPhoto bucket="testbuckethelios" onClose={console.log} />
    <ExampleTitle>title, no close</ExampleTitle>
    <UploadPhoto bucket="testbuckethelios" onClose={null} title="Lorem ipsum" />
  </>
);
