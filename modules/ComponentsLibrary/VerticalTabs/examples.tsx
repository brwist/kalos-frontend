import React from 'react';
import { VerticalTabs } from '.';
import { LoremIpsumList } from '../helpers';

export default () => (
  <VerticalTabs
    tabs={Array.from(Array(5)).map((_, idx) => ({
      label: `Tab ${idx + 1}`,
      content: (
        <LoremIpsumList
          title={`Content for tab ${idx + 1}`}
          style={{ paddingTop: 16 }}
        />
      ),
    }))}
    defaultOpenIdx={3}
    onChange={idx => console.log({ idx })}
  />
);
