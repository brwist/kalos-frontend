import React, { FC, useState, useCallback } from 'react';
import { Search } from './';

type Props = {
  button: string;
  compact?: boolean;
};

const EnhancedModal: FC<Props> = ({ button, children, ...props }) => {
  const [open, setOpen] = useState(true);
  const handleToggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={handleToggleOpen(true)}>{button}</button>{' '}
      <Search
        open={open}
        onClose={handleToggleOpen(false)}
        {...props}
        onSelect={user => console.log('SELECTED USER', user)}
      />
    </>
  );
};

export default () => (
  <>
    <EnhancedModal button="Search" />
  </>
);
