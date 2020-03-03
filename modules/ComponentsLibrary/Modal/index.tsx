import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

type Style = {
  compact?: boolean;
  maxWidth?: number | 'none';
  fullScreen?: boolean;
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
  paper: ({ maxWidth, fullScreen }: Style) => ({
    width: fullScreen ? '100%' : 'auto',
    height: fullScreen ? '100%' : 'auto',
    maxWidth,
    minWidth: 300,
    outline: 'none',
    maxHeight: fullScreen ? '100%' : `calc(100% - ${theme.spacing(4)}px)`,
    overflowX: 'hidden',
    overflowY: 'auto',
    [theme.breakpoints.up('md')]: {
      overflowY: 'hidden',
    },
  }),
}));

export const Modal = ({
  open,
  onClose,
  children,
  compact = false,
  maxWidth = 'none',
  fullScreen = false,
}: Props) => {
  const classes = useStyles({ compact, maxWidth, fullScreen });
  return (
    <ModalUI open={open} onClose={onClose} className={classes.modal}>
      <Paper className={classes.paper}>{children}</Paper>
    </ModalUI>
  );
};
