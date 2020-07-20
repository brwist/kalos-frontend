import React, { ReactNode } from 'react';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import './styles.less';

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

export const Modal = ({
  open,
  onClose,
  children,
  compact = false,
  maxWidth = 'none',
  fullScreen = false,
  fullHeight = false,
}: Props) => (
  <ModalUI open={open} onClose={onClose} className={'Modal'}>
    <Paper
      className={'ModalPaper'}
      style={{
        maxWidth,
        width: fullScreen ? '100%' : 'auto',
        height: fullScreen || fullHeight ? '100%' : 'auto',
      }}
    >
      {children}
    </Paper>
  </ModalUI>
);
