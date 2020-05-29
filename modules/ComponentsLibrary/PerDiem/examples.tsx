import React from 'react';
import { PerDiemComponent } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Viewed as Owner</ExampleTitle>
    <PerDiemComponent userId={101253} loggedUserId={101253} />
    <ExampleTitle>Viewed as Manager</ExampleTitle>
    <PerDiemComponent
      userId={101253}
      loggedUserId={1734}
      onClose={() => console.log('CLOSE')}
    />
    <ExampleTitle>Viewed as other</ExampleTitle>
    <PerDiemComponent
      userId={101253}
      loggedUserId={2573}
      onClose={() => console.log('CLOSE')}
    />
  </>
);
