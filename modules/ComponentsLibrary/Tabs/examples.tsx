import React from 'react';
import { Tabs } from './';
import { LoremIpsumList } from '../helpers';

export default () => (
  <Tabs
    tabs={Array.from(Array(10)).map((_, idx) => ({
      label: `Tab ${idx + 1}`,
      content: (
        <LoremIpsumList
          title={`Content for tab ${idx + 1}`}
          style={{ paddingTop: 16 }}
        />
      ),
    }))}
  />
);
