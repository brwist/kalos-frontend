import React, { useState } from 'react';
import { SectionBar } from './';
import { Button } from '../Button';
import { LoremIpsumList } from '../helpers';

const Examples = ({
  subtitle,
  withCheck = false,
}: {
  subtitle?: string;
  withCheck?: boolean;
}) => {
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState<number>(0);
  return (
    <>
      <SectionBar
        title="Top Title"
        subtitle={subtitle}
        onCheck={withCheck ? setChecked : undefined}
        checked={withCheck ? checked : undefined}
      />
      <hr />
      <SectionBar
        title="Small"
        subtitle={subtitle}
        small
        onCheck={withCheck ? setChecked : undefined}
        checked={withCheck ? checked : undefined}
      />
      <hr />
      <SectionBar
        pagination={{ count: 11, onPageChange: console.log, page: 1 }}
      />
      <hr />
      <SectionBar
        actions={Array.from(Array(5)).map((_, idx) => ({
          label: `Button ${idx + 1}`,
        }))}
        asideContent={<Button label="Custom" />}
        onCheck={withCheck ? setChecked : undefined}
        checked={withCheck ? checked : undefined}
        loading
      />
      <hr />
      <SectionBar
        title="With title and actions"
        subtitle={subtitle}
        asideContent={<Button label="Custom" />}
        asideContentFirst
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
          onPageChange: setPage,
        }}
      />
      <hr />
      <SectionBar
        title="With content"
        subtitle={subtitle}
        footer="Footer"
        actions={[{ label: 'Button' }]}
        fixedActions
      >
        <LoremIpsumList style={{ padding: 10, backgroundColor: '#eee' }} />
      </SectionBar>
      <hr />
    </>
  );
};

export default () => (
  <>
    <Examples />
    <Examples subtitle="Subtitle below" withCheck />
  </>
);
