import React from 'react';
import { FileTags } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Default</ExampleTitle>
    <FileTags />
    <ExampleTitle>with onClose and on onFileTagsChange</ExampleTitle>
    <FileTags
      onClose={() => console.log('CLOSED')}
      onFileTagsChange={() => console.log('FILE TAGS CHANGED')}
    />
    <ExampleTitle>with initial fileTags </ExampleTitle>
    <FileTags
      fileTags={[
        {
          id: 1,
          name: 'Failure',
          color: '#880000',
          isActive: true,
          dateCreated: '',
          fieldMaskList: [],
        },
        {
          id: 2,
          name: 'Success',
          color: '#008800',
          isActive: true,
          dateCreated: '',
          fieldMaskList: [],
        },
        {
          id: 2,
          name: 'Warning',
          color: '#ffd966',
          isActive: true,
          dateCreated: '',
          fieldMaskList: [],
        },
      ]}
    />
  </>
);
