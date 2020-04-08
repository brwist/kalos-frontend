import React, { useState, useCallback } from 'react';
import { StoredQuotes } from './';

export default () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleOpen = useCallback(() => setOpen(!open), [open, setOpen]);
  return (
    <>
      <button onClick={toggleOpen}>Quick Add</button>
      <StoredQuotes
        open={open}
        onClose={toggleOpen}
        onSelect={storedQuote => console.log(storedQuote)}
      />
    </>
  );
};
