import React from 'react';
import { Projects } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <Projects loggedUserId={101253} />
    <ExampleTitle>with startDate, endDate, onClose</ExampleTitle>
    <Projects
      loggedUserId={101253}
      startDate="2020-06-10"
      endDate="2020-06-30"
      onClose={() => console.log('CLOSE')}
    />
  </>
);
