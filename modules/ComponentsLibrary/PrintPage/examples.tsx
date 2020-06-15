import React from 'react';
import { PrintPage } from './';
import { LoremIpsumList, ExampleTitle, LOREM } from '../helpers';
import PrintTableExample from '../PrintTable/examples';
import PrintListExample from '../PrintList/examples';
import PrintParagraphExample from '../PrintParagraph/examples';
import { PrintParagraph } from '../PrintParagraph';
import { PrintPageBreak } from '../PrintPageBreak';

export default () => (
  <>
    <ExampleTitle>with children only</ExampleTitle>
    <PrintPage>
      <LoremIpsumList />
    </PrintPage>
    <ExampleTitle>with header, footer and example print table</ExampleTitle>
    <PrintPage
      headerProps={{ title: 'Lorem ipsum' }}
      footerProps={{
        height: 250,
        children: (
          <PrintParagraph>
            <LoremIpsumList />
          </PrintParagraph>
        ),
      }}
      downloadPdfFilename="lorem_ipsum_1"
    >
      <PrintTableExample />
      <PrintParagraphExample />
      <PrintListExample />
      <PrintPageBreak height={250} />
    </PrintPage>
    <ExampleTitle>with long example print table</ExampleTitle>
    <PrintPage
      headerProps={{ title: 'Lorem ipsum' }}
      footerProps={{ height: 30, children: LOREM }}
      buttonProps={{ variant: 'outlined', label: 'Print me' }}
      downloadPdfFilename="lorem_ipsum_2"
    >
      <PrintTableExample rows={200} />
    </PrintPage>
  </>
);
