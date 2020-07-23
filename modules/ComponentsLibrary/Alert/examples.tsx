import React, { useState } from 'react';
import { Alert } from './';
import { LoremIpsumList } from '../helpers';

export default () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open alert</button>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        label="Custom label"
        title="Lorem ipsum"
      >
        <LoremIpsumList />
      </Alert>
    </>
  );
};
