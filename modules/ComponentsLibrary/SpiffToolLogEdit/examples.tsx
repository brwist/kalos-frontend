import React from 'react';
import { SpiffToolLogEdit } from './';
import { ExampleTitle } from '../helpers';
import spiffExample from './spiffExample';
import toolExample from './toolExample';

export default () => (
  <>
    <ExampleTitle>Spiff</ExampleTitle>
    <SpiffToolLogEdit
      data={spiffExample}
      loggedUserId={101253}
      type="Spiff"
      onClose={() => console.log('CLOSE')}
      onSave={() => console.log('SAVE')}
      onStatusChange={() => console.log('UPSERT STATUS')}
      loading={false}
    />
    <ExampleTitle>Tool</ExampleTitle>
    <SpiffToolLogEdit
      data={toolExample}
      loggedUserId={101253}
      type="Tool"
      onClose={() => console.log('CLOSE')}
      onSave={() => console.log('SAVE')}
      onStatusChange={() => console.log('UPSERT STATUS')}
      loading={false}
    />
  </>
);
