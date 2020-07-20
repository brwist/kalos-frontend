import React, { FC, useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { SectionBar } from '../SectionBar';
import { LoremIpsumList } from '../helpers';
import { Modal } from './';

type Props = {
  button: string;
  compact?: boolean;
  fullScreen?: boolean;
  fullHeight?: boolean;
};

const EnhancedModal: FC<Props> = ({
  button,
  children,
  fullScreen = false,
  fullHeight = false,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={handleToggleOpen(true)}>{button}</button>{' '}
      <Modal
        open={open}
        onClose={handleToggleOpen(false)}
        fullScreen={fullScreen}
        fullHeight={fullHeight}
        {...props}
      >
        <SectionBar
          title={button}
          actions={[{ label: 'Close', onClick: handleToggleOpen(false) }]}
          fixedActions
        />
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
    <EnhancedModal button="Full Screen Modal" fullScreen>
      {Array.from(Array(10)).map((_, idx) => (
        <LoremIpsumList key={idx} />
      ))}
    </EnhancedModal>
    <EnhancedModal button="Full Height Modal" fullHeight>
      <LoremIpsumList />
    </EnhancedModal>
  </>
);
