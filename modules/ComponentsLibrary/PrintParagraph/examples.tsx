import React from 'react';
import { PrintParagraph } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <PrintParagraph>
      Mauris tincidunt non lacus eu dictum.
      <br />
      Maecenas sodales ligula in ultricies molestie.
      <br />
      Donec faucibus pellentesque tincidunt.
    </PrintParagraph>
    <ExampleTitle>tag h1</ExampleTitle>
    <PrintParagraph tag="h1">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <ExampleTitle>align center</ExampleTitle>
    <PrintParagraph align="center">
      Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat.
    </PrintParagraph>
    <ExampleTitle>align right</ExampleTitle>
    <PrintParagraph align="right">
      In at ante sed mi mollis viverra quis sit amet orci.
      <br />
      Sed at efficitur velit, interdum porta mi.
    </PrintParagraph>
  </>
);
