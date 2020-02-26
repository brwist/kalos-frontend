import React from 'react';
import { SectionBar } from './';

export default () => (
  <>
    <SectionBar title="Title" />
    <br />
    <SectionBar title="With button" buttons={[{ label: 'Button' }]} />
    <br />
    <SectionBar
      title="With buttons"
      buttons={Array.from(Array(5)).map((_, idx) => ({
        label: `Button ${idx + 1}`,
      }))}
    />
  </>
);
