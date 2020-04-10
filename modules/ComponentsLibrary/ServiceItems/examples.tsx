import React from 'react';
import { ServiceItems } from './';
import { LoremIpsum } from '../helpers';

export default () => (
  <>
    <ServiceItems userID={2573} propertyId={6552} loggedUserId={101253} />
    <hr />
    <ServiceItems
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      loading
    />
    <hr />
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
      onSelect={selected => console.log(selected)}
      actions={[{ label: 'Lorem' }, { label: 'Ipsum' }]}
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
