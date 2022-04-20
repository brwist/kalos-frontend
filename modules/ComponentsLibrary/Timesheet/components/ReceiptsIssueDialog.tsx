import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './ReceiptsIssueDialog.module.less';

type Props = {
  isAdmin: boolean;
  receiptsIssueStr: string;
  handleTimeout: () => void;
};

const ReceiptsIssueDialog: FC<Props> = ({
  isAdmin,
  receiptsIssueStr,
  handleTimeout,
}: Props): JSX.Element => (
  <Dialog open>
    <DialogContent>
      <Typography align="center">{receiptsIssueStr}</Typography>
    </DialogContent>
    <DialogActions className="TimesheetReceiptsIssueDialogActions">
      <Button
        variant="contained"
        color="primary"
        href="https://app.kalosflorida.com/index.cfm?action=admin:reports.transactions"
      >
        Go To Receipts
      </Button>
      {isAdmin && (
        <Button variant="contained" color="primary" onClick={handleTimeout}>
          Dismiss
        </Button>
      )}
    </DialogActions>
  </Dialog>
);

export default ReceiptsIssueDialog;
