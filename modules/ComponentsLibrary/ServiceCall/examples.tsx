import React from 'react';
import { ServiceCall } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>Edit</ExampleTitle>
    <ServiceCall
      serviceCallId={86246}
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      onClose={() => console.log('CLOSE')}
    />
    <hr />
    <ExampleTitle>Create</ExampleTitle>
    <ServiceCall userID={2573} propertyId={6552} loggedUserId={101253} />
  </>
);
