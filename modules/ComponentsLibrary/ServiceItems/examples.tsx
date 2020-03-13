import React from 'react';
import { ServiceItems } from './';

export default () => (
  <>
    <ServiceItems userID={2573} propertyId={6552} loggedUserId={101253} />
    <hr />
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
    />
  </>
);
