import React from 'react';
import { TimeOff } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>add</ExampleTitle>
    <TimeOff
      loggedUserId={101253}
      onCancel={() => console.log('Cancel')}
      onSaveOrDelete={data => console.log('Save', data)}
    />
    <ExampleTitle>edit</ExampleTitle>
    <TimeOff
      loggedUserId={101253}
      onCancel={() => console.log('Cancel')}
      onSaveOrDelete={data => console.log('Delete', data)}
      onAdminSubmit={data => console.log('Admin Submit', data)}
      requestOffId={2068}
    />
  </>
);
