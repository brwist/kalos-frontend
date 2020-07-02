import React from 'react';
import { ServiceItems } from './';
import { PrintPage } from '../PrintPage';
import { LoremIpsum, ExampleTitle } from '../helpers';

const PrintExample = (
  <PrintPage
    headerProps={{
      bigLogo: true,
      withKalosAddress: true,
      withKalosContact: true,
    }}
  >
    <LoremIpsum />
  </PrintPage>
);

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <ServiceItems userID={2573} propertyId={6552} loggedUserId={101253} />
    <ExampleTitle>loading</ExampleTitle>
    <ServiceItems
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      loading
    />
    <ExampleTitle>selectable, actions, asideContent</ExampleTitle>
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
      onSelect={selected => console.log(selected)}
      actions={[{ label: 'Lorem' }, { label: 'Ipsum' }]}
      asideContent={PrintExample}
    />
    <ExampleTitle>selectable, repair, asideContent</ExampleTitle>
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      selectable
      repair
      onSelect={selected => console.log(selected)}
      onRepairsChange={repairs => console.log(repairs)}
      asideContent={PrintExample}
    >
      <LoremIpsum />
    </ServiceItems>
    <ExampleTitle>repair, disableRepair</ExampleTitle>
    <ServiceItems
      title="Lorem Ipsum"
      userID={2573}
      propertyId={6552}
      loggedUserId={101253}
      repair
      disableRepair
      onRepairsChange={repairs => console.log(repairs)}
    >
      <LoremIpsum />
    </ServiceItems>
  </>
);
