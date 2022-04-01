import React, { useState, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '../Button';
import { ConfirmServiceProvider, useConfirm } from './';

const ButtonWithConfirm = () => {
  const [catchOnCancel, toggleCatchOnCancel] = useState(false);
  const confirm = useConfirm();
  const handleClick = useCallback(() => {
    confirm({
      catchOnCancel,
      title: 'Title',
      description: 'Are you sure you want to perform this action?',
    })
      .then(() => {
        // put here all the stuff needed if user confirms the action
        alert('confirmed');
      })
      .catch(() => {
        // if catchOnCancel equals false it won't fall down here
        alert('caught on cancel');
      });
  }, [catchOnCancel]);

  return (
    <Box className="ConfirmServiceContainer">
      <Button label="Some Action with Confirm" onClick={handleClick} />
      <FormControlLabel
        style={{ display: 'block' }}
        control={
          <Checkbox
            checked={catchOnCancel}
            onChange={() => toggleCatchOnCancel(!catchOnCancel)}
            color="primary"
          />
        }
        label="Catch on Cancel"
      />
    </Box>
  );
};

/* ConfirmServiceProvider should wrap every component that uses confirm.
 *  Can wrap all the application when it's ready.
 * */
export default () => (
  <ConfirmServiceProvider>
    <ButtonWithConfirm />
  </ConfirmServiceProvider>
);
