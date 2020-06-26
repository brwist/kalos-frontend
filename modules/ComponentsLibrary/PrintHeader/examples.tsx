import React from 'react';
import { PrintHeader, PrintHeaderSubtitleItem } from './';
import { ExampleTitle } from '../helpers';

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
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
    <ExampleTitle>withKalosAddress</ExampleTitle>
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
      withKalosAddress
    />
    <ExampleTitle>bigLogo</ExampleTitle>
    <PrintHeader title="Lorem ipsum" withKalosAddress bigLogo />
  </>
);
