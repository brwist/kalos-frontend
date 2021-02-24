import React, { useState, useCallback } from 'react';
import { Confirm } from './';

export default () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={toggleOpen(true)}>Action</button>
      <Confirm
        title="Confirm something"
        open={open}
        onClose={toggleOpen(false)}
        onConfirm={() => alert('Confirmed')}
        submitLabel="Custom label"
      >
        Are you sure you want to do it?
      </Confirm>
    </>
  );
};
