import React, { FC, useState, useCallback } from 'react';
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
      <h1 style={{ marginTop: 0 }}>Lorem ipsum dolor sit amet</h1>
      <ul>
        <li>Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat.</li>
        <li>Donec et iaculis augue, quis posuere velit.</li>
        <li>In at ante sed mi mollis viverra quis sit amet orci.</li>
        <li>Sed at efficitur velit, interdum porta mi.</li>
        <li>Proin quis sapien orci.</li>
        <li>Aliquam vulputate vitae ex interdum tincidunt.</li>
        <li>Curabitur eu aliquet augue.</li>
        <li>Mauris tincidunt non lacus eu dictum.</li>
        <li>Maecenas sodales ligula in ultricies molestie.</li>
        <li>Donec faucibus pellentesque tincidunt.</li>
        <li>Vivamus in mollis felis.</li>
      </ul>
    </EnhancedModal>
    <EnhancedModal button="Compact Modal" compact>
      Lorem ipsum dolor sit amet
    </EnhancedModal>
  </>
);
