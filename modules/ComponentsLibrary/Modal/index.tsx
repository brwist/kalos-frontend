import React, { ReactNode, useEffect, useState, CSSProperties } from 'react';
import ModalUI from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import './Modal.module.less';

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
  onOpen?: () => void;
  classname?: string;
  styles?: CSSProperties;
}

export const Modal = ({
  open,
  onClose,
  children,
  compact = false,
  maxWidth = 'none',
  fullScreen = false,
  fullHeight = false,
  classname = '',
  styles = {},
  onOpen,
}: Props) => {
  useEffect(() => {
    if (open && onOpen) {
      onOpen();
    }
  }, [open, onOpen]);
  return (
    <ModalUI open={open} onClose={onClose} className={'Modal'}>
      <Paper
        className={`ModalPaper ${classname}`}
        style={{
          maxWidth,
          width: fullScreen ? '100%' : 'auto',
          height: fullScreen || fullHeight ? '100%' : 'auto',
          ...styles,
        }}
      >
        {children}
      </Paper>
    </ModalUI>
  );
};
