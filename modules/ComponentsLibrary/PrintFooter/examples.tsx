import React from 'react';
import { PrintFooter } from './';
import { PrintParagraph } from '../PrintParagraph';
import { LOREM } from '../helpers';

export default () => (
  <>
    <PrintFooter height={30}>
      <PrintParagraph align="center">{LOREM}</PrintParagraph>
    </PrintFooter>
  </>
);
