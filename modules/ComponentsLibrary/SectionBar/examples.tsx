import React, { useState } from 'react';
import { SectionBar } from './';
import { Button } from '../Button';
import { LoremIpsumList } from '../helpers';

const Examples = ({ subtitle }: { subtitle?: string }) => {
  const [page, setPage] = useState(0);
  return (
    <>
      <SectionBar title="Title" subtitle={subtitle} />
      <hr />
      <SectionBar
        actions={Array.from(Array(5)).map((_, idx) => ({
          label: `Button ${idx + 1}`,
        }))}
        asideContent={<Button label="Custom" />}
      />
      <hr />
      <SectionBar
        title="With title and actions"
        subtitle={subtitle}
        actions={Array.from(Array(5)).map((_, idx) => ({
          label: `Button ${idx + 1}`,
        }))}
      />
      <hr />
      <SectionBar
        title="With fixed actions"
        subtitle={subtitle}
        actions={[{ label: 'Button' }]}
        fixedActions
      />
      <hr />
      <SectionBar
        title="With Paging"
        subtitle={subtitle}
        pagination={{
          count: 35,
          rowsPerPage: 10,
          page,
          onChangePage: setPage,
        }}
      />
      <hr />
      <SectionBar title="With content" subtitle={subtitle} footer="Footer">
        <LoremIpsumList style={{ padding: 10, backgroundColor: '#eee' }} />
      </SectionBar>
      <hr />
    </>
  );
};

export default () => (
  <>
    <Examples />
    <Examples subtitle="Subtitle" />
  </>
);
