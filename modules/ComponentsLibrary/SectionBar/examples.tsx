import React, { useState } from 'react';
import { SectionBar } from './';
import { LoremIpsumList } from '../helpers';

export default () => {
  const [page, setPage] = useState(0);
  return (
    <>
      <SectionBar title="Title" />
      <hr />
      <SectionBar
        title="With actions"
        actions={Array.from(Array(5)).map((_, idx) => ({
          label: `Button ${idx + 1}`,
        }))}
      />
      <hr />
      <SectionBar
        title="With fixed actions"
        actions={[{ label: 'Button' }]}
        fixedActions
      />
      <hr />
      <SectionBar
        title="With Paging"
        pagination={{
          count: 35,
          rowsPerPage: 10,
          page,
          onChangePage: setPage,
        }}
      />
      <hr />
      <SectionBar title="With content">
        <LoremIpsumList style={{ padding: 10, backgroundColor: '#eee' }} />
      </SectionBar>
    </>
  );
};
