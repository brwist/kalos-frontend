import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

type Style = {
  compact?: boolean;
};

interface Props extends Style {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    width: ({ compact }: Style) => (compact ? 'auto' : '40%'),
    minWidth: 300,
    maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
    overflow: 'hidden',
    outline: 'none',
  },
}));

export const Modal = ({ open, onClose, children, compact = false }: Props) => {
  const classes = useStyles({ compact });
  return (
    <ModalUI open={open} onClose={onClose} className={classes.modal}>
      <Paper className={classes.paper}>{children}</Paper>
    </ModalUI>
  );
};
