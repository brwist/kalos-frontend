import React from 'react';
import { ServiceItems } from './';
import { LoremIpsum } from '../helpers';

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
      onSelect={selected => console.log(selected)}
    />
    <hr />
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
      repair
      onSelect={selected => console.log(selected)}
      onRepairsChange={repairs => console.log(repairs)}
    >
      <LoremIpsum />
    </ServiceItems>
  </>
);
