import React from 'react';
import { FileGallery } from './';

export default () => (
  <FileGallery
    loggedUserId={8418}
    title="Add Photo from Gallery"
    bucket="testbuckethelios" //"kalos-pre-transaction"
    onClose={() => console.log('close')}
    onAdd={console.log}
    removeFileOnAdd={false}
  />
);
