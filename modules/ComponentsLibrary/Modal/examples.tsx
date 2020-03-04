import React, { FC, useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { LoremIpsumList } from '../helpers';
import { Modal } from './';

type Props = {
  button: string;
  compact?: boolean;
};

const EnhancedModal: FC<Props> = ({ button, children, ...props }) => {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={handleToggleOpen(true)}>{button}</button>{' '}
      <Modal open={open} onClose={handleToggleOpen(false)} {...props}>
        <div style={{ padding: 20 }}>{children}</div>
      </Modal>
    </>
  );
};

export default () => (
  <>
    <EnhancedModal button="Modal">
      <LoremIpsumList />
    </EnhancedModal>
    <EnhancedModal button="Compact Modal" compact>
      <Typography>Lorem ipsum dolor sit amet</Typography>
    </EnhancedModal>
  </>
);
