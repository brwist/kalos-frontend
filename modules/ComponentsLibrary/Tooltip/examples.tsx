import React, { useState } from 'react';
import { Tooltip } from './';
import { Field, Value } from '../Field';
import { LoremIpsumList } from '../helpers';

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

export default () => {
  const [big, setBig] = useState<Value>(0);
  return (
    <>
      <Field
        name="big"
        label="Use big content for tooltip content"
        value={big}
        onChange={setBig}
        type="checkbox"
      />
      {PLACEMENTS.map(placement => (
        <Tooltip
          key={placement}
          content={big ? <LoremIpsumList /> : placement}
          placement={placement}
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
