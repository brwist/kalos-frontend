import React from 'react';
import { ProjectDetail } from './';
import { ExampleTitle } from '../helpers';

export default () => {
  return (
    <>
      <ExampleTitle>default</ExampleTitle>
      <ProjectDetail userID={2573} loggedUserId={101253} propertyId={0} />
    </>
  );
};
