import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Button } from '../../ComponentsLibrary/Button';

type Props = {
  onClose: () => void,
};

const ReportBugForm: FC<Props> = ({ onClose }): JSX.Element => {
  const handleSubmit = () => {
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogContent>rich editor</DialogContent>
      <DialogActions>
        <Button label="Cancel" variant="outlined" onClick={handleCancel} />
        <Button label="Submit" onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  );
};

export default ReportBugForm;