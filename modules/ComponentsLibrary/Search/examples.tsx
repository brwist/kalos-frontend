import React, { FC, useState, useCallback } from 'react';
import { Search, Kind } from './';

type Props = {
  button: string;
  compact?: boolean;
  kinds: Kind[];
  defaultOpen?: boolean;
};

const EnhancedModal: FC<Props> = ({
  button,
  children,
  defaultOpen = false,
  ...props
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const handleToggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={handleToggleOpen(true)}>{button}</button>{' '}
      <Search
        open={open}
        onClose={handleToggleOpen(false)}
        {...props}
        onSelect={user => console.log('SELECTED: ', user)}
      />
    </>
  );
};

export default () => (
  <>
    <EnhancedModal button="Search Customers" kinds={['Customers']} />
    <EnhancedModal button="Search Properties" kinds={['Properties']} />
    <EnhancedModal
      button="Search Customers and Properties"
      kinds={['Customers', 'Properties']}
    />
  </>
);
