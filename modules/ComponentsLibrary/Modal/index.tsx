import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

type Style = {
  compact?: boolean;
  maxWidth?: number | 'none';
  fullScreen?: boolean;
  fullHeight?: boolean;
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
  paper: ({ maxWidth, fullScreen, fullHeight }: Style) => ({
    position: 'relative',
    width: fullScreen ? '100%' : 'auto',
    height: fullScreen || fullHeight ? '100%' : 'auto',
    maxWidth,
    minWidth: 300,
    outline: 'none',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  }),
}));

export const Modal = ({
  open,
  onClose,
  children,
  compact = false,
  maxWidth = 'none',
  fullScreen = false,
  fullHeight = false,
}: Props) => {
  const classes = useStyles({ compact, maxWidth, fullScreen, fullHeight });
  return (
    <ModalUI open={open} onClose={onClose} className={classes.modal}>
      <Paper className={classes.paper}>{children}</Paper>
    </ModalUI>
  );
};
