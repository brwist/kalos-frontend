import React, { useState } from 'react';
import { Tooltip } from './';
import { Field, Value } from '../Field';
import { LoremIpsumList, ExampleTitle } from '../helpers';

const PLACEMENTS = [
  'bottom-end',
  'bottom-start',
  'bottom',
  'left-end',
  'left-start',
  'left',
  'right-end',
  'right-start',
  'right',
  'top-end',
  'top-start',
  'top',
] as const;

const EnhancedTooltip = ({ controllable }: { controllable: boolean }) => {
  const [big, setBig] = useState<Value>(0);
  const [opened, setOpened] = useState<Value>(0);
  return (
    <>
      <div style={{ display: 'flex' }}>
        <span>
          <Field
            name="big"
            label="Use big content for tooltip content"
            value={big}
            onChange={setBig}
            type="checkbox"
          />
        </span>
        {controllable && (
          <span>
            <Field
              name="opened"
              label="Tooltips opened"
              value={opened}
              onChange={setOpened}
              type="checkbox"
            />
          </span>
        )}
      </div>
      {PLACEMENTS.map(placement => (
        <Tooltip
          key={placement}
          content={big ? <LoremIpsumList /> : placement}
          placement={placement}
          controlled={controllable}
          open={opened === 1}
        >
          <div
            style={{
              display: 'inline-flex',
              width: 200,
              height: 200,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'black',
              margin: 10,
              backgroundColor: 'gold',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {placement}
          </div>
        </Tooltip>
      ))}
    </>
  );
};

export default () => (
  <>
    <ExampleTitle>default</ExampleTitle>
    <EnhancedTooltip controllable={false} />
    <ExampleTitle>controlled open</ExampleTitle>
    <EnhancedTooltip controllable />
  </>
);
