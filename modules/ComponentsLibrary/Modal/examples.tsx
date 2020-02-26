import React, { useState, useCallback } from 'react';
import { Modal } from './';

export default () => {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = useCallback(open => () => setOpen(open), [setOpen]);
  return (
    <>
      <button onClick={handleToggleOpen(true)}>Open Modal</button>
      <Modal open={open} onClose={handleToggleOpen(false)}>
        <div style={{ padding: 20 }}>
          <h1 style={{ marginTop: 0 }}>Lorem ipsum dolor sit amet</h1>
          Consectetur adipiscing elit. Vivamus volutpat iaculis feugiat. Donec
          et iaculis augue, quis posuere velit. In at ante sed mi mollis viverra
          quis sit amet orci. Sed at efficitur velit, interdum porta mi. Proin
          quis sapien orci. Aliquam vulputate vitae ex interdum tincidunt.
          Curabitur eu aliquet augue. Mauris tincidunt non lacus eu dictum.
          Maecenas sodales ligula in ultricies molestie. Donec faucibus
          pellentesque tincidunt. Vivamus in mollis felis.
        </div>
      </Modal>
    </>
  );
};
