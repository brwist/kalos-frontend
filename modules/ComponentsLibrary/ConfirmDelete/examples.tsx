import React, { useState, useCallback } from 'react';
import { ConfirmDelete } from './';

export default () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={toggleOpen(true)}>Delete</button>
      <ConfirmDelete
        open={open}
        onClose={toggleOpen(false)}
        kind="entry type"
        name="entry name"
        onConfirm={() => alert('Confirmed')}
      />
    </>
  );
};
