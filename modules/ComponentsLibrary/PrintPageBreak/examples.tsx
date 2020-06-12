import React from 'react';
import { PrintPageBreak } from './';
import { PrintPage } from '../PrintPage';
import { PrintHeader } from '../PrintHeader';
import { LoremIpsumList } from '../helpers';

export default () => (
  <PrintPage>
    {[...Array(5)].map((_, idx) => (
      <div>
        <PrintHeader title={`Page ${idx + 1}`} />
        <LoremIpsumList />
        <PrintPageBreak />
      </div>
    ))}
  </PrintPage>
);
