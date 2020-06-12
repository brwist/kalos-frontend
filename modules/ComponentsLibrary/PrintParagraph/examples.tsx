import React from 'react';
import { PrintParagraph } from './';

export default () => (
  <>
    <PrintParagraph>
      Mauris tincidunt non lacus eu dictum.
      <br />
      Maecenas sodales ligula in ultricies molestie.
      <br />
      Donec faucibus pellentesque tincidunt.
    </PrintParagraph>
    <PrintParagraph tag="h1">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <PrintParagraph tag="h2">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <PrintParagraph tag="h3">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <PrintParagraph tag="h4">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <PrintParagraph tag="h5">
      Maecenas sodales ligula in ultricies molestie.
    </PrintParagraph>
    <PrintParagraph align="center">
      Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat.
    </PrintParagraph>
    <PrintParagraph align="right">
      In at ante sed mi mollis viverra quis sit amet orci.
      <br />
      Sed at efficitur velit, interdum porta mi.
    </PrintParagraph>
  </>
);
