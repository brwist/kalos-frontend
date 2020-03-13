import React from 'react';
import { ServiceItems } from './';

export default () => (
  <>
    <ServiceItems userID={2573} propertyId={6552} loggedUserId={101253} />
    <hr />
    <ServiceItems
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
    />
  </>
);
