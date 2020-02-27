import React, { useState } from 'react';
import { SectionBar } from './';

export default () => {
  const [page, setPage] = useState(0);
  return (
    <>
      <SectionBar title="Title" />
      <hr />
      <SectionBar title="With button" buttons={[{ label: 'Button' }]} />
      <hr />
      <SectionBar
        title="With buttons"
        buttons={Array.from(Array(5)).map((_, idx) => ({
          label: `Button ${idx + 1}`,
        }))}
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
    </>
  );
};
