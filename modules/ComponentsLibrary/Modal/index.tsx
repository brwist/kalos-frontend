import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

type Style = {
  compact?: boolean;
  maxWidth?: number | 'none';
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
  paper: ({ maxWidth }: Style) => ({
    width: 'auto',
    maxWidth,
    minWidth: 300,
    maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
    overflow: 'hidden',
    outline: 'none',
  }),
}));

export const Modal = ({
  open,
  onClose,
  children,
  compact = false,
  maxWidth = 'none',
}: Props) => {
  const classes = useStyles({ compact, maxWidth });
  return (
    <ModalUI open={open} onClose={onClose} className={classes.modal}>
      <Paper className={classes.paper}>{children}</Paper>
    </ModalUI>
  );
};
