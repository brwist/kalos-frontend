import React from 'react';
import { PrintPage } from './';
import { LoremIpsumList, ExampleTitle, LOREM } from '../helpers';
import PrintTableExample from '../PrintTable/examples';

export default () => (
  <>
    <ExampleTitle>with children only</ExampleTitle>
    <PrintPage>
      <LoremIpsumList />
    </PrintPage>
    <ExampleTitle>with header, footer and example print table</ExampleTitle>
    <PrintPage
      headerProps={{ title: 'Lorem ipsum' }}
      footerProps={{ children: LOREM }}
    >
      <PrintTableExample />
    </PrintPage>
    <ExampleTitle>with long example print table</ExampleTitle>
    <PrintPage
      headerProps={{ title: 'Lorem ipsum' }}
      footerProps={{ children: LOREM }}
      buttonProps={{ variant: 'outlined', label: 'Print me' }}
    >
      <PrintTableExample rows={200} />
    </PrintPage>
  </>
);
