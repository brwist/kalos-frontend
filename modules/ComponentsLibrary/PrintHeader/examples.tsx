import React from 'react';
import { PrintHeader, PrintHeaderSubtitleItem } from './';

export default () => (
  <>
    <PrintHeader
      title="Lorem ipsum"
      subtitle={
        <>
          {[...Array(5)].map((_, idx) => (
            <PrintHeaderSubtitleItem
              key={idx}
              label={`Label ${idx + 1}:`}
              value={`value ${idx + 1}`}
            />
          ))}
        </>
      }
    />
  </>
);
